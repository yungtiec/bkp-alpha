import * as types from "./actionTypes";
import {
  values,
  orderBy,
  clone,
  keys,
  cloneDeep,
  assignIn,
  groupBy,
  filter,
  flow
} from "lodash";
import moment from "moment";
import { findItemInTreeById } from "../../../../../../utils";

const initialState = {
  engagementItemsById: {},
  engagementItemIds: []
};

function addEngagementItems(state, action) {
  const sortedEngagementItems = orderBy(
    keys(action.engagementItemsById).map(cid => ({
      id: cid,
      unix: parseInt(
        moment(action.engagementItemsById[cid].updatedAt).format("X")
      )
    })),
    ["unix"],
    ["desc"]
  );
  const engagementItemIds = sortedEngagementItems.map(a => a.id);
  return {
    engagementItemsById: action.engagementItemsById,
    engagementItemIds
  };
}

function updateEngagementItemStatus(state, action) {
  var target = findItemInTreeById(
    values(state.engagementItemsById),
    action.engagementItem.engagementItemId,
    "engagementItemId"
  );
  target.reviewed = action.status;
  return {
    ...state
  };
}

function updateEngagementItemIssueStatus(state, action) {
  if (
    !state.engagementItemsById[action.engagementItem.engagementItemId].issue
  ) {
    state.engagementItemsById[
      action.engagementItem.engagementItemId
    ].issue = {};
  }
  state.engagementItemsById[action.engagementItem.engagementItemId].issue.open =
    action.open;
  return state;
}

export default function reduce(state = initialState, action = {}) {
  var sortedEngagementItems, engagementItemIds;
  switch (action.type) {
    case types.ENGAGEMENT_ITEMS_FETCH_SUCCESS:
      return addEngagementItems(cloneDeep(state), action);
    case types.ENGAGEMENT_ITEM_VERIFIED_SUCCESS:
      return updateEngagementItemStatus(cloneDeep(state), action);
    case types.ENGAGEMENT_ITEM_ISSUE_UPDATED:
      return updateEngagementItemIssueStatus(cloneDeep(state), action);
    default:
      return state;
  }
}

export const getEngagementItems = state => {
  const filterDict = {
    annotation: "engagementItemType",
    page_comment: "engagementItemType",
    verified: "reviewStatus",
    spam: "reviewStatus",
    pending: "reviewStatus",
    open: "issueStatus",
    closed: "issueStatus"
  };
  const {
    engagementItemsById,
    engagementItemIds
  } = state.scenes.admin.scenes.projectSurvey.data.engagementItems;
  const checked = state.scenes.admin.scenes.projectSurvey.checked;
  const checkedDict = groupBy(
    checked.map(c => ({
      filter: filterDict[c],
      value: c
    })),
    "filter"
  );
  const filterByEngagementItemTypeBound = filterByEngagementItemType.bind(
    null,
    (checkedDict.engagementItemType &&
      checkedDict.engagementItemType.map(c => c.value)) ||
      [],
    engagementItemsById
  );
  const filterByReviewStatusBound = filterByReviewStatus.bind(
    null,
    (checkedDict.reviewStatus && checkedDict.reviewStatus.map(c => c.value)) ||
      [],
    engagementItemsById
  );
  const filterByIssueStatusBound = filterByIssueStatus.bind(
    null,
    (checkedDict.issueStatus && checkedDict.issueStatus.map(c => c.value)) ||
      [],
    engagementItemsById
  );
  const filters = flow([
    filterByEngagementItemTypeBound,
    filterByReviewStatusBound,
    filterByIssueStatusBound
  ]);
  const filteredEngagementItemIds = filters(_.keys(engagementItemsById));
  return {
    engagementItemIds: filteredEngagementItemIds,
    engagementItemsById
  };
};

function filterByEngagementItemType(
  engagementItemTypeArr,
  engagementItemsById,
  engagementItemsIds
) {
  if (!engagementItemTypeArr || !engagementItemTypeArr.length)
    return engagementItemsIds;
  return filter(engagementItemsIds, engagementItemId => {
    return (
      engagementItemTypeArr.indexOf(
        engagementItemsById[engagementItemId].engagementItemType
      ) !== -1
    );
  });
}

function filterByReviewStatus(
  statusArr,
  engagementItemsById,
  engagementItemsIds
) {
  if (!statusArr || !statusArr.length) return engagementItemsIds;
  return filter(engagementItemsIds, engagementItemId => {
    return (
      statusArr.indexOf(engagementItemsById[engagementItemId].reviewed) !== -1
    );
  });
}

function filterByIssueStatus(
  issueStatusArr,
  engagementItemsById,
  engagementItemsIds
) {
  if (!issueStatusArr || !issueStatusArr.length) return engagementItemsIds;
  return filter(engagementItemsIds, engagementItemId => {
    const issueStatus = !engagementItemsById[engagementItemId].issue
      ? "none"
      : engagementItemsById[engagementItemId].issue.open ? "open" : "closed";
    return issueStatusArr.indexOf(issueStatus) !== -1;
  });
}

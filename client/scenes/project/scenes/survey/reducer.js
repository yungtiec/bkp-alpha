import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "survey.SIDEBAR_OPEN_TOGGLE";
const VERIFICATION_STATUS_IN_VIEW = "survey.VERIFICATION_STATUS_IN_VIEW";
const COMMENT_SORT_BY = "survey.COMMENT_SORT_BY";
const COMMENT_CONTEXT_UPDATED = "survey.COMMENT_CONTEXT_UPDATED";
const ISSUE_FILTER_UPDATED = "survey.ISSUE_FILTER_UPDATED";

export const toggleSidebar = () => ({
  type: SIDEBAR_OPEN_TOGGLE
});

export const updateVerificationStatusInView = verificationStatus => ({
  type: VERIFICATION_STATUS_IN_VIEW,
  verificationStatus
});

export const sortCommentBy = commentSortBy => ({
  type: COMMENT_SORT_BY,
  commentSortBy
});

export const updateSidebarContext = sidebarContext => ({
  type: COMMENT_CONTEXT_UPDATED,
  sidebarContext
});

export const updateIssueFilter = issueFilter => ({
  type: ISSUE_FILTER_UPDATED,
  issueFilter
});

const initialState = {
  sidebarOpen: true,
  verificationStatus: "all",
  commentSortBy: "position",
  commentIssueFilter: [],
  sidebarContext: {
    selectedText: "",
    selectedCommentId: null,
    focusOnce: false
  }
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case VERIFICATION_STATUS_IN_VIEW:
      return { ...state, verificationStatus: action.verificationStatus };
    case SIDEBAR_OPEN_TOGGLE:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case COMMENT_SORT_BY:
      return { ...state, commentSortBy: action.commentSortBy };
    case COMMENT_CONTEXT_UPDATED:
      return {
        ...state,
        sidebarContext: { ...state.sidebarContext, ...action.sidebarContext }
      };
    case ISSUE_FILTER_UPDATED:
      return {
        ...state,
        commentIssueFilter: action.issueFilter
      };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}

export const getSidebarContext = state =>
  state.scenes.project.scenes.survey.sidebarContext;

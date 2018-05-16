import * as types from "./actionTypes";
import { keyBy } from "lodash";
import { getUserAnnotations } from "./service";
import { batchActions } from "redux-batched-actions";

const FILTER_DICT = {
  verified: "reviewedStatus",
  spam: "reviewedStatus",
  pending: "reviewedStatus",
  open: "issueStatus",
  close: "issueStatus"
};

const extractReviewAndIssueStats = checked => {
  const checkedWithLabel = checked.map(value => ({
    label: FILTER_DICT[value],
    value
  }));
  const reviewStatus = checkedWithLabel
    .filter(checkItem => checkItem.label === "reviewedStatus")
    .map(checkItem => checkItem.value);
  const issueStatus = checkedWithLabel
    .filter(checkItem => checkItem.label === "issueStatus")
    .map(checkItem => checkItem.value);
  return {
    reviewStatus,
    issueStatus
  };
};

export function fetchUserAnnotations(userId) {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const state = getState();
      const {
        pageLimit,
        pageOffset,
        pageProjectFilter,
        pageSurveyFilter
      } = state.scenes.profile.scenes.annotations.data;
      const { annotations, annotationCount } = await getUserAnnotations({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter
      });
      const annotationsById = keyBy(annotations, "id");
      dispatch({
        type: types.USER_ANNOTATIONS_FETCH_SUCCESS,
        annotationsById,
        annotationIds: annotations.map(a => a.id),
        annotationCount
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export const updatePageLimit = pageLimit => ({
  type: types.PAGE_LIMIT_UPDATED,
  pageLimit
});

export const updatePageOffset = (userId, pageOffset) => {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const state = getState();
      const {
        pageLimit,
        pageProjectFilter,
        pageSurveyFilter,
        checked
      } = state.scenes.profile.scenes.annotations.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const { annotations, annotationCount } = await getUserAnnotations({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const annotationsById = keyBy(annotations, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_ANNOTATIONS_FETCH_SUCCESS,
            annotationsById,
            annotationCount,
            annotationIds: annotations.map(a => a.id)
          },
          {
            type: types.PAGE_OFFSET_UPDATED,
            pageOffset
          }
        ])
      );
    } catch (err) {}
  };
};

export const updatePageProjectFilter = (userId, pageProjectFilter) => {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const state = getState();
      const {
        pageLimit,
        pageOffset,
        pageSurveyFilter,
        checked
      } = state.scenes.profile.scenes.annotations.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const { annotations, annotationCount } = await getUserAnnotations({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const annotationsById = keyBy(annotations, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_ANNOTATIONS_FETCH_SUCCESS,
            annotationsById,
            annotationCount,
            annotationIds: annotations.map(a => a.id)
          },
          {
            type: types.PAGE_PROJECT_FILTER_UPDATED,
            pageProjectFilter
          }
        ])
      );
    } catch (err) {}
  };
};

export const updatePageSurveyFilter = pageSurveyFilter => ({
  type: types.PAGE_SURVEY_FILTER_UPDATED,
  pageSurveyFilter
});

export const checkSidebarFilter = (userId, checked) => {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const state = getState();
      const {
        pageLimit,
        pageOffset,
        pageProjectFilter,
        pageSurveyFilter
      } = state.scenes.profile.scenes.annotations.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const { annotations, annotationCount } = await getUserAnnotations({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const annotationsById = keyBy(annotations, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_ANNOTATIONS_FETCH_SUCCESS,
            annotationsById,
            annotationCount,
            annotationIds: annotations.map(a => a.id)
          },
          {
            type: types.SIDEBAR_FILTER_CHECKED,
            checked
          }
        ])
      );
    } catch (err) {
      console.log(err);
    }
  };
};

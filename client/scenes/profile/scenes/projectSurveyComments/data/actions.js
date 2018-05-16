import * as types from "./actionTypes";
import { keyBy } from "lodash";
import { getUserProjectSurveyComments } from "./service";
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

export function fetchUserProjectSurveyComments(userId) {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const state = getState();
      const {
        pageLimit,
        pageOffset,
        pageProjectFilter,
        pageSurveyFilter
      } = state.scenes.profile.scenes.projectSurveyComments.data;
      const {
        projectSurveyComments,
        projectSurveyCommentCount
      } = await getUserProjectSurveyComments({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter
      });
      const projectSurveyCommentsById = keyBy(projectSurveyComments, "id");
      dispatch({
        type: types.USER_PROJECT_SURVEY_COMMENTS_FETCH_SUCCESS,
        projectSurveyCommentsById,
        projectSurveyCommentIds: projectSurveyComments.map(a => a.id),
        projectSurveyCommentCount
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
      } = state.scenes.profile.scenes.projectSurveyComments.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const {
        projectSurveyComments,
        projectSurveyCommentCount
      } = await getUserProjectSurveyComments({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const projectSurveyCommentsById = keyBy(projectSurveyComments, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_PROJECT_SURVEY_COMMENTS_FETCH_SUCCESS,
            projectSurveyCommentsById,
            projectSurveyCommentCount,
            projectSurveyCommentIds: projectSurveyComments.map(a => a.id)
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
      } = state.scenes.profile.scenes.projectSurveyComments.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const {
        projectSurveyComments,
        projectSurveyCommentCount
      } = await getUserProjectSurveyComments({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const projectSurveyCommentsById = keyBy(projectSurveyComments, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_PROJECT_SURVEY_COMMENTS_FETCH_SUCCESS,
            projectSurveyCommentsById,
            projectSurveyCommentCount,
            projectSurveyCommentIds: projectSurveyComments.map(a => a.id)
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
      } = state.scenes.profile.scenes.projectSurveyComments.data;
      const { reviewStatus, issueStatus } = extractReviewAndIssueStats(checked);
      const {
        projectSurveyComments,
        projectSurveyCommentCount
      } = await getUserProjectSurveyComments({
        userId,
        offset: pageOffset,
        limit: pageLimit,
        projects: pageProjectFilter,
        surveys: pageSurveyFilter,
        reviewStatus,
        issueStatus
      });
      const projectSurveyCommentsById = keyBy(projectSurveyComments, "id");
      dispatch(
        batchActions([
          {
            type: types.USER_PROJECT_SURVEY_COMMENTS_FETCH_SUCCESS,
            projectSurveyCommentsById,
            projectSurveyCommentCount,
            projectSurveyCommentIds: projectSurveyComments.map(a => a.id)
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

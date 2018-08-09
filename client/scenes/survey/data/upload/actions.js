import * as types from "./actionTypes";
import { postMarkdown, getCollaboratorOptions } from "./services";
import history from "../../../../history";
import { orderBy } from "lodash";

export const fetchCollaboratorOptions = projectSymbol => async dispatch => {
  try {
    const collaboratorOptions = await getCollaboratorOptions(projectSymbol);
    dispatch({
      type: types.COLLABORATOR_OPTIONS_FETCHED_SUCCESS,
      collaboratorOptions
    });
  } catch (err) {
    console.log(err);
  }
};

export const importMarkdown = markdown => ({
  type: types.MARKDOWN_IMPORTED,
  markdown
});

export const uploadMarkdownToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const parentProjectSurveyId = orderBy(
      state.scenes.survey.data.metadata.survey.project_surveys,
      ["hierarchyLevel"],
      ["desc"]
    )[0].id;
    const projectSymbol =
      state.scenes.survey.data.metadata.survey.project.symbol;
    const {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodUnit,
      commentPeriodValue,
      scorecard
    } = state.scenes.survey.data.upload;
    const projectSurvey = await postMarkdown({
      parentProjectSurveyId,
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodUnit,
      commentPeriodValue,
      scorecard
    });
    history.push(`/project/${projectSymbol}/survey/${projectSurvey.id}`);
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
  } catch (err) {
    console.log(err);
  }
};

export const selectIssueToResolve = issueId => ({
  type: types.ISSUE_SELECTED,
  issueId
});

export const updateCollaborators = collaboratorEmails => ({
  type: types.COLLABORATOR_UPDATED,
  collaboratorEmails
});

export const addNewIssue = issue => ({
  type: types.ISSUE_ADDED,
  issue
});

export const removeIssue = issue => ({
  type: types.ISSUE_DELETED,
  issue
});

export const updateCommentPeriodUnit = commentPeriodUnit => ({
  type: types.COMMENT_PERIOD_UNIT_UPDATED,
  commentPeriodUnit
});

export const updateCommentPeriodValue = commentPeriodValue => ({
  type: types.COMMENT_PERIOD_VALUE_UPDATED,
  commentPeriodValue
});

export const updateProjectScorecard = projectScorecard => ({
  type: types.PROJECT_SCORECARD_UPDATED,
  projectScorecard
});

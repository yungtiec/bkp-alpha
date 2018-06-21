import * as types from "./actionTypes";
import { postMarkdown } from "./services";
import history from "../../../../../../history";
import { orderBy } from "lodash";

export const importMarkdown = markdown => ({
  type: types.MARKDOWN_IMPORTED,
  markdown
});

export const uploadMarkdownToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const parentProjectSurveyId = orderBy(
      state.scenes.project.scenes.survey.data.metadata.versions,
      ["hierarchyLevel"],
      ["desc"]
    )[0].id;
    const projectSymbol = state.scenes.project.data.metadata.symbol;
    const {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodInDay,
      scorecard
    } = state.scenes.project.scenes.survey.data.upload;
    const projectSurvey = await postMarkdown({
      parentProjectSurveyId,
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails: collaboratorEmails.map(c => c.value),
      commentPeriodInDay,
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

export const updateCommentPeriod = commentPeriodInDay => ({
  type: types.COMMENT_PERIOD_UPDATED,
  commentPeriodInDay
});

export const updateProjectScorecard = projectScorecard => ({
  type: types.PROJECT_SCORECARD_UPDATED,
  projectScorecard
})

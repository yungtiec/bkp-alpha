import * as types from "./actionTypes";
import { postMarkdown } from "./services";
import history from "../../../../../../history";

export const importMarkdown = markdown => ({
  type: types.MARKDOWN_IMPORTED,
  markdown
});

export const uploadMarkdownToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const parentProjectSurveyId =
      state.scenes.project.scenes.survey.data.metadata.id;
    const projectSymbol = state.scenes.project.data.metadata.symbol;
    const {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails
    } = state.scenes.project.scenes.survey.data.upload;
    const projectSurvey = await postMarkdown({
      parentProjectSurveyId,
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails
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

export const addNewCollaborator = collaboratorEmail => ({
  type: types.COLLABORATOR_ADDED,
  collaboratorEmail
});

export const removeCollaborator = collaboratorEmail => ({
  type: types.COLLABORATOR_DELETED,
  collaboratorEmail
});

export const addNewIssue = issue => ({
  type: types.ISSUE_ADDED,
  issue
});

export const removeIssue = issue => ({
  type: types.ISSUE_DELETED,
  issue
});

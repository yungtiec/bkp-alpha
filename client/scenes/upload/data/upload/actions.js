import * as types from "./actionTypes";
import { postMarkdown } from "./services";
import history from "../../../../history";
import { orderBy } from "lodash";

export const importMarkdown = markdown => ({
  type: types.MARKDOWN_IMPORTED,
  markdown
});

export const uploadMarkdownToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      markdown,
      collaboratorEmails,
      commentPeriodInDay,
      selectedProjectSymbol
    } = state.scenes.upload.data.upload;
    const projectSurvey = await postMarkdown({
      markdown,
      collaboratorEmails,
      commentPeriodInDay,
      selectedProjectSymbol
    });
    history.push(
      `/project/${selectedProjectSymbol}/survey/${projectSurvey.id}`
    );
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
  } catch (err) {
    console.log(err);
  }
};

export const addNewCollaborator = collaboratorEmail => ({
  type: types.COLLABORATOR_ADDED,
  collaboratorEmail
});

export const removeCollaborator = collaboratorEmail => ({
  type: types.COLLABORATOR_DELETED,
  collaboratorEmail
});

export const updateCommentPeriod = commentPeriodInDay => ({
  type: types.COMMENT_PERIOD_UPDATED,
  commentPeriodInDay
});

export const updateSelectedProject = selectedProjectSymbol => ({
  type: types.SELECTED_PROJECT_UPDATED,
  selectedProjectSymbol
});

import * as types from "./actionTypes";
import { postMarkdown, getManagedProjects } from "./services";
import history from "../../../../history";
import { orderBy, keyBy } from "lodash";

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
      commentPeriodValue,
      commentPeriodUnit,
      selectedProject,
      scorecard
    } = state.scenes.upload.data.upload;
    const version = await postMarkdown({
      markdown,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol: selectedProject.symbol,
      scorecard
    });
    history.push(
      `/project/${selectedProject.symbol}/document/${version.id}`
    );
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateCollaborators = collaboratorEmails => ({
  type: types.COLLABORATOR_UPDATED,
  collaboratorEmails
});

export const updateCommentPeriodUnit = commentPeriodUnit => ({
  type: types.COMMENT_PERIOD_UNIT_UPDATED,
  commentPeriodUnit
});

export const updateCommentPeriodValue = commentPeriodValue => ({
  type: types.COMMENT_PERIOD_VALUE_UPDATED,
  commentPeriodValue
});

export const updateSelectedProject = selectedProject => ({
  type: types.SELECTED_PROJECT_UPDATED,
  selectedProject
});

export const updateProjectScorecard = projectScorecard => ({
  type: types.PROJECT_SCORECARD_UPDATED,
  projectScorecard
});

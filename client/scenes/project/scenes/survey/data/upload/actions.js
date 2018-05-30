import * as types from "./actionTypes";
import { postMarkdown } from "./services";

export const importMarkdown = markdown => ({
  type: types.MARKDOWN_IMPORTED,
  markdown
});

export const uploadMarkdownToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const parentProjectSurveyId =
      state.scenes.project.scenes.survey.data.metadata.id;
    const markdown = state.scenes.project.scenes.survey.data.upload.markdown;
    await postMarkdown(parentProjectSurveyId, markdown);
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
  } catch (err) {
    console.log(err);
  }
};

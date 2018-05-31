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
    const markdown = state.scenes.project.scenes.survey.data.upload.markdown;
    const projectSurvey = await postMarkdown(parentProjectSurveyId, markdown);
    history.push(`/project/${projectSymbol}/survey/${projectSurvey.id}`);
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
  } catch (err) {
    console.log(err);
  }
};

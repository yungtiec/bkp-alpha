import * as types from "./actionTypes";

const initialState = {
  markdown: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.MARKDOWN_IMPORTED:
      return {
        markdown: action.markdown
      };
    case types.MARKDOWN_UPLOADED:
      return {
        markdown: null
      };
    default:
      return state;
  }
}

export function getImportedMarkdown(state) {
  return state.scenes.project.scenes.survey.data.upload.markdown;
}

import { cloneDeep } from "lodash";
import * as types from "./actionTypes";

// section that has title but no content serves as divider in document
const labelDividerTitle = documentQnasById => {
  for (var id in documentQnasById) {
    const isDividerTitle =
      documentQnasById[id].version_answers.length === 1 &&
      !documentQnasById[id].version_answers[0].markdown.trim();
    documentQnasById[id].isDividerTitle = isDividerTitle;
  }
  return documentQnasById;
};

const initialState = {
  documentQnasById: {},
  documentQnaIds: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_QUESTIONS_FETCH_SUCCESS:
      return {
        ...state,
        documentQnasById: labelDividerTitle(cloneDeep(action.documentQnasById)),
        documentQnaIds: action.documentQnaIds
      };
    default:
      return state;
  }
}

export function getAllDocumentQuestions(state) {
  return state.scenes.document.data.qnas;
}


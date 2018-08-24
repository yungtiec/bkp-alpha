import { cloneDeep, keys, values, sortBy } from "lodash";
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

const updateQuestions = (state, action) => {
  var documentQnas;
  delete state.documentQnasById[action.prevVersionQuestionId];
  state.documentQnasById[action.newlyAddedVersionQuestion.id] =
    action.newlyAddedVersionQuestion;
  documentQnas = sortBy(
    values(state.documentQnasById),
    ["order_in_version"],
    ["asc"]
  );
  state.documentQnaIds = documentQnas.map(qna => qna.id);
  return state;
};

const revertQuestion = (state, action) => {
  var documentQnas;
  var history = cloneDeep(
    state.documentQnasById[action.prevVersionQuestionId].history
  );
  delete state.documentQnasById[action.prevVersionQuestionId];
  state.documentQnasById[action.versionQuestion.id] = action.versionQuestion;
  state.documentQnasById[action.versionQuestion.id].history = history;
  documentQnas = sortBy(
    values(state.documentQnasById),
    ["order_in_version"],
    ["asc"]
  );
  state.documentQnaIds = documentQnas.map(qna => qna.id);
  console.log(state)
  return state;
};

const updateAnswer = (state, action) => {
  state.documentQnasById[action.versionQuestionId].version_answers = [
    action.newlyAddedVersionAnswer
  ];
  return state;
};

const revertAnswer = (state, action) => {
  var history = cloneDeep(
    state.documentQnasById[action.versionQuestionId].version_answers[0].history
  );
  state.documentQnasById[action.versionQuestionId].version_answers = [
    action.versionAnswer
  ];
  state.documentQnasById[
    action.versionQuestionId
  ].version_answers[0].history = history;
  return state;
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_QUESTIONS_FETCH_SUCCESS:
      return {
        documentQnasById: labelDividerTitle(cloneDeep(action.documentQnasById)),
        documentQnaIds: action.documentQnaIds
      };
    case types.PROJECT_SURVEY_QUESTION_EDITED:
      return updateQuestions(cloneDeep(state), action);
    case types.PROJECT_SURVEY_ANSWER_EDITED:
      return updateAnswer(cloneDeep(state), action);
    case types.PROJECT_SURVEY_ANSWER_REVERTED:
      return revertAnswer(cloneDeep(state), action);
    case types.PROJECT_SURVEY_QUESTION_REVERTED:
      return revertQuestion(cloneDeep(state), action);
    default:
      return state;
  }
}

export function getAllDocumentQuestions(state) {
  return state.scenes.document.data.qnas;
}

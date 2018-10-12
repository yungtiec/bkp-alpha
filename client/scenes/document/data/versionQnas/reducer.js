import { cloneDeep, keys, values, sortBy } from "lodash";
import * as types from "./actionTypes";

// section that has title but no content serves as divider in document
const labelDividerTitle = versionQnasById => {
  for (var id in versionQnasById) {
    const isDividerTitle =
      versionQnasById[id].version_answers.length === 1 &&
      !versionQnasById[id].version_answers[0].markdown.trim();
    versionQnasById[id].isDividerTitle = isDividerTitle;
  }
  return versionQnasById;
};

const setDefaultToIsNotBeingEdited = versionQnasById => {
  for (var id in versionQnasById) {
    versionQnasById[id].isBeingEdited = false;
    versionQnasById[id].version_answers[0].isBeingEdited = false;
  }
  return versionQnasById;
};

const initialState = {
  versionQnasById: {},
  versionQnaIds: null,
  loading: true
};

const updateQuestions = (state, action) => {
  var versionQnas;
  delete state.versionQnasById[action.prevVersionQuestionId];
  state.versionQnasById[action.newlyAddedVersionQuestion.id] =
    action.newlyAddedVersionQuestion;
  versionQnas = sortBy(
    values(state.versionQnasById),
    ["order_in_version"],
    ["asc"]
  );
  state.versionQnaIds = versionQnas.map(qna => qna.id);
  return state;
};

const openQuestionEditor = (state, action) => {
  var versionQnas;
  const isBeingEdited =
    state.versionQnasById[action.versionQuestionId].isBeingEdited;
  state.versionQnasById[
    action.versionQuestionId
  ].isBeingEdited = !isBeingEdited;
  versionQnas = sortBy(
    values(state.versionQnasById),
    ["order_in_version"],
    ["asc"]
  );
  state.versionQnaIds = versionQnas.map(qna => qna.id);
  return state;
};

const openAnswerEditor = (state, action) => {
  const isBeingEdited =
    state.versionQnasById[action.versionQuestionId].version_answers[0]
      .isBeingEdited;
  state.versionQnasById[
    action.versionQuestionId
  ].version_answers[0].isBeingEdited = !isBeingEdited;
  return state;
};

const revertQuestion = (state, action) => {
  var versionQnas;
  var history = cloneDeep(
    state.versionQnasById[action.prevVersionQuestionId].history
  );
  delete state.versionQnasById[action.prevVersionQuestionId];
  state.versionQnasById[action.versionQuestion.id] = action.versionQuestion;
  state.versionQnasById[action.versionQuestion.id].history = history;
  state.versionQnasById[action.versionQuestion.id].isBeingEdited = true;
  versionQnas = sortBy(
    values(state.versionQnasById),
    ["order_in_version"],
    ["asc"]
  );
  state.versionQnaIds = versionQnas.map(qna => qna.id);
  return state;
};

const updateAnswer = (state, action) => {
  state.versionQnasById[action.versionQuestionId].version_answers = [
    action.newlyAddedVersionAnswer
  ];
  return state;
};

const revertAnswer = (state, action) => {
  var history = cloneDeep(
    state.versionQnasById[action.versionQuestionId].version_answers[0].history
  );
  state.versionQnasById[action.versionQuestionId].version_answers = [
    action.versionAnswer
  ];
  state.versionQnasById[
    action.versionQuestionId
  ].version_answers[0].isBeingEdited = true;
  state.versionQnasById[
    action.versionQuestionId
  ].version_answers[0].history = history;
  return state;
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.VERSION_QUESTIONS_FETCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.VERSION_QUESTIONS_FETCH_SUCCESS:
      const versionQnasById = setDefaultToIsNotBeingEdited(
        cloneDeep(action.versionQnasById)
      );
      return {
        versionQnasById: setDefaultToIsNotBeingEdited(
          labelDividerTitle(versionQnasById)
        ),
        versionQnaIds: action.versionQnaIds,
        loading: false
      };
    case types.VERSION_QUESTION_EDITOR_IS_OPEN:
      return openQuestionEditor(cloneDeep(state), action);
    case types.VERSION_ANSWER_EDITOR_IS_OPEN:
      return openAnswerEditor(cloneDeep(state), action);
    case types.VERSION_QUESTION_EDITED:
      return updateQuestions(cloneDeep(state), action);
    case types.VERSION_ANSWER_EDITED:
      return updateAnswer(cloneDeep(state), action);
    case types.VERSION_ANSWER_REVERTED:
      return revertAnswer(cloneDeep(state), action);
    case types.VERSION_QUESTION_REVERTED:
      return revertQuestion(cloneDeep(state), action);
    default:
      return state;
  }
}

export function getAllDocumentQuestions(state) {
  return {
    ...state.scenes.document.data.versionQnas,
    versionQnasLoading: state.scenes.document.data.versionQnas.loading
  };
}

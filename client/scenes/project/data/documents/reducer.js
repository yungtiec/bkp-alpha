import * as types from "../actionTypes";

const initialState = {
  documentsById: {},
  documentIds: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_FETCH_SUCCESS:
      return {
        documentsById: action.documentsById,
        documentIds: action.documentIds
      };
    default:
      return state;
  }
}

export function getAllVersions(state) {
  return state.scenes.project.data.documents
}

import * as types from "./actionTypes";
import { assignIn } from "lodash";

const initialState = {
  draftsById: null,
  draftIds: null,
  draftOffset: 0,
  draftLimit: 10,
  draftCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.DRAFTS_FETCHED_SUCESSS:
      return {
        ...state,
        draftsById: assignIn(action.draftsById, state.draftsById),
        draftIds: (state.draftIds || []).concat(action.draftIds),
        draftOffset: action.draftOffset,
        draftCount: action.count
      };
    default:
      return state;
  }
}

export function getOwnDrafts(state) {
  return {
    draftsById: state.scenes.myDocuments.scenes.drafts.data.draftsById,
    draftIds: state.scenes.myDocuments.scenes.drafts.data.draftIds
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.myDocuments.scenes.drafts.data.draftOffset <
    state.scenes.myDocuments.scenes.drafts.data.draftCount
  );
}

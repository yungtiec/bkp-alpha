import * as types from "./actionTypes";

const initialState = {
  modalType: null,
  modalProps: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      };
    case types.HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
}

import * as types from "./actionTypes";

export const loadModal = (modalType, modalProps) => {
  return {
    type: types.SHOW_MODAL,
    modalType,
    modalProps
  };
};

export const updateModalProps = (modalProps) => {
  return {
    type: types.UPDATE_MODAL_PROPS,
    modalProps
  };
};

export const hideModal = () => {
  return {
    type: types.HIDE_MODAL
  };
};

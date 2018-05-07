import * as types from "./actionTypes";

const defaultUser = {};

export default function(state = defaultUser, action) {
  switch (action.type) {
    case types.GET_USER:
      return action.user;
    case types.REMOVE_USER:
      return defaultUser;
    default:
      return state;
  }
}

export const currentUserIsAdmin = state => {
  return (
    state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length
  );
}

import * as types from "./actionTypes";

const defaultUser = {};

export default function(state = defaultUser, action) {
  switch (action.type) {
    case types.GET_USER:
      return action.user;
    case types.REMOVE_USER:
      return defaultUser;
    case types.PROFILE_UPDATED:
      return {
        ...state,
        first_name: action.profile.firstName,
        last_name: action.profile.lastName,
        name: action.profile.name,
        organization: action.profile.organization
      };
    case types.MANAGED_PROJECTS_FETCH_SUCCESS:
      return {
        ...state,
        projectSymbolArr: action.projectSymbolArr,
        projectsBySymbol: action.projectsBySymbol
      };
    default:
      return state;
  }
}

export const currentUserIsAdmin = state => {
  return (
    state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length
  );
};

export function getManagedProjects(state) {
  const { projectSymbolArr, projectsBySymbol } = state.data.user;
  return {
    projectSymbolArr,
    projectsBySymbol
  };
}

import * as types from "./actionTypes";

const defaultUser = {};

export default function(state = defaultUser, action) {
  switch (action.type) {
    case types.GET_USER:
      return {
        ...state,
        ...action.user
      };
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
    case types.OWN_PROJECT_SURVEYS_FETCH_SUCCESS:
      return {
        ...state,
        projectSurveysById: action.projectSurveysById,
        projectSurveyIds: action.projectSurveyIds
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

export function getOwnProjectSurveys(state) {
  const { projectSurveysById, projectSurveyIds } = state.data.user;
  return {
    projectSurveysById,
    projectSurveyIds
  };
}

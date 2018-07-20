import axios from "axios";
import history from "../../history";
import * as types from "./actionTypes";
import { pick, keyBy } from "lodash";
import ReactGA from "react-ga";
import { loadModal } from "../modal/actions";
import { uport } from "./connector";
const isProduction = process.env.NODE_ENV === "production";

export const getUser = user => {
  return dispatch => {
    if (isProduction && user && user.email) ReactGA.set({ userId: user.email });
    dispatch({ type: types.GET_USER, user });
  };
};

export const removeUser = () => ({ type: types.REMOVE_USER });

export const me = () => dispatch =>
  axios
    .get("/auth/me")
    .then(res => dispatch(getUser(res.data || {})))
    .catch(err => console.log(err));

export const auth = (userInfo, method) => dispatch => {
  userInfo =
    method === "login" ? pick(userInfo, ["email", "password"]) : userInfo;
  return axios
    .post(`/auth/${method}`, userInfo)
    .then(
      res => {
        dispatch(getUser(res.data));
        if (res.data.restricted_access) history.push("/user/profile");
        else if (!res.data.name)
          history.push({
            pathname: "/user/profile",
            state: { edit: true, basicInfoMissing: true }
          });
        else history.push("/projects");
      },
      authError => {
        // rare example: a good use case for parallel (non-catch) error handler
        dispatch(getUser({ error: authError }));
      }
    )
    .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr));
};

export const logout = () => dispatch =>
  axios
    .post("/auth/logout")
    .then(res => {
      dispatch(removeUser());
      history.push("/login");
    })
    .catch(err => console.log(err));

export const editProfile = profile => dispatch =>
  axios
    .put("/auth/profile", profile)
    .then(res => {
      dispatch({ type: types.PROFILE_UPDATED, profile });
    })
    .catch(err => console.log(err));

export const signinWithUport = () => dispatch =>
  uport
    .requestCredentials({
      requested: ["name", "email"]
    })
    .then(userProfile => axios.post("/auth/uport", userProfile))
    .then(
      res => {
        dispatch(getUser(res.data));
        if (res.data.restricted_access) history.push("/user/profile");
        else if (!res.data.name)
          history.push({
            pathname: "/user/profile",
            state: { edit: true, basicInfoMissing: true }
          });
        else history.push("/projects");
      },
      authError => {
        dispatch(getUser({ error: authError }));
      }
    )
    .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr));

export const fetchManagedProjects = () => async (dispatch, getState) => {
  try {
    const projects = await axios
      .get(`api/users/-/projects`)
      .then(res => res.data);
    const projectsBySymbol = keyBy(projects, "symbol");
    const projectSymbolArr = projects.map(project => project.symbol);
    dispatch({
      type: types.MANAGED_PROJECTS_FETCH_SUCCESS,
      projectsBySymbol,
      projectSymbolArr
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchOwnProjectSurveys = () => async (dispatch, getState) => {
  try {
    const projectSurveys = await axios
      .get(`api/users/-/surveys`)
      .then(res => res.data);
    const projectSurveysById = keyBy(projectSurveys, "id");
    const projectSurveyIds = projectSurveys.map(ps => ps.id);
    dispatch({
      type: types.OWN_PROJECT_SURVEYS_FETCH_SUCCESS,
      projectSurveysById,
      projectSurveyIds
    });
  } catch (err) {
    console.log(err);
  }
};


import axios from "axios";
import history from "../../history";
import * as types from "./actionTypes";
import { pick } from "lodash";
import ReactGA from "react-ga";
const isProduction = process.env.NODE_ENV === "production";

export const getUser = user => {
  return dispatch => {
    if (isProduction && user && user.email) ReactGA.set({ user: user.email });
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

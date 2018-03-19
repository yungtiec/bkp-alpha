import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user/reducer";
import project from "./project/reducer";

const reducer = combineReducers({
  user,
  project
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from "./user/actions";
export * from "./project/actions";
export * from "./project/reducer";
export * from "./project/survey/reducer";
export * from "./project/question/reducer";

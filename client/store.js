import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import data from "./data/reducer";
import scenes from "./scenes/reducer";
import {reducer as notificationsReducer} from 'reapop';

const reducer = combineReducers({
  data,
  scenes,
  notifications: notificationsReducer()
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from "./data/user/actions";

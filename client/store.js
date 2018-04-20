import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import data from "./data/reducer";
import scenes from "./scenes/reducer";
import { reducer as notificationsReducer } from "reapop";
import { enableBatching } from "redux-batched-actions";

const isDev = process.env.NODE_ENV === "development";

const reducer = combineReducers({
  data,
  scenes,
  notifications: notificationsReducer()
});

const middleware = composeWithDevTools(
  isDev
    ? applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
    : applyMiddleware(thunkMiddleware)
);
const store = createStore(enableBatching(reducer), middleware);

export default store;
export * from "./data/user/actions";

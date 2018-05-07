import { combineReducers } from "redux";

import { default as userListReducer } from "./UserList/reducer";


export const reducer = combineReducers({
  userList: userListReducer
});

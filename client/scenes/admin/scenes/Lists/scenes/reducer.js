import { combineReducers } from "redux";

import { default as adminUserListReducer } from "./AdminUserList/reducer";


export const reducer = combineReducers({
  adminUserList: adminUserListReducer
});

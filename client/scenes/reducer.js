import { combineReducers } from "redux";

import { default as projectReducer } from "./project/reducer";
import { default as profileReducer } from "./profile/reducer";
import { default as adminReducer } from "./admin/reducer";

export default combineReducers({
  project: projectReducer,
  profile: profileReducer,
  admin: adminReducer
});

import { combineReducers } from "redux";

import { default as userReducer } from "./user/reducer";
import { default as modalReducer } from "./modal/reducer";
import { default as searchReducer } from "./search/reducer";
import { default as environmentReducer } from "./environment/reducer";
import { default as projectsReducer } from "./projects/reducer";
import { default as documentsReducer } from "./documents/reducer";
import { default as notificationsReducer } from "./notifications/reducer";

export default combineReducers({
  user: userReducer,
  modal: modalReducer,
  search: searchReducer,
  environment: environmentReducer,
  projects: projectsReducer,
  documents: documentsReducer,
  notifications: notificationsReducer
});

export * from "./user/reducer";
export * from "./user/actions";
export * from "./modal/reducer";
export * from "./modal/actions";
export * from "./search/reducer";
export * from "./search/actions";
export * from "./environment/reducer";
export * from "./environment/actions";
export * from "./projects/reducer";
export * from "./projects/actions";
export * from "./documents/reducer";
export * from "./documents/actions";
export * from "./notifications/reducer";
export * from "./notifications/actions";

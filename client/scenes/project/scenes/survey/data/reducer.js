import { values, orderBy, assignIn } from "lodash";
import { combineReducers } from "redux";
import moment from "moment";

import { default as metadataReducer } from "./metadata/reducer";
import { default as qnasReducer } from "./qnas/reducer";
import { default as commentsReducer } from "./comments/reducer";
import { default as tagsReducer } from "./tags/reducer";
import { default as uploadReducer } from "./upload/reducer";

export const reducer = combineReducers({
  metadata: metadataReducer,
  qnas: qnasReducer,
  comments: commentsReducer,
  tags: tagsReducer,
  upload: uploadReducer
});

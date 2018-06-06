import { values, orderBy, assignIn } from "lodash";
import { combineReducers } from "redux";
import moment from "moment";

import { default as metadataReducer } from "./metadata/reducer";
import { default as qnasReducer } from "./qnas/reducer";
import { default as annotationsReducer } from "./annotations/reducer";
import { default as tagsReducer } from "./tags/reducer";
import { default as uploadReducer } from "./upload/reducer";

export const reducer = combineReducers({
  metadata: metadataReducer,
  qnas: qnasReducer,
  annotations: annotationsReducer,
  tags: tagsReducer,
  upload: uploadReducer
});

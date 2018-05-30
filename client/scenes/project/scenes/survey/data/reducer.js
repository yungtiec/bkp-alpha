import { values, orderBy, assignIn } from "lodash";
import { combineReducers } from "redux";
import moment from "moment";

import { default as metadataReducer } from "./metadata/reducer";
import { default as qnasReducer } from "./qnas/reducer";
import { default as annotationsReducer } from "./annotations/reducer";
import { default as tagsReducer } from "./tags/reducer";
import { default as commentsReducer } from "./comments/reducer";
import { default as uploadReducer } from "./upload/reducer";

export const reducer = combineReducers({
  metadata: metadataReducer,
  qnas: qnasReducer,
  annotations: annotationsReducer,
  tags: tagsReducer,
  comments: commentsReducer,
  upload: uploadReducer
});

export const getOutstandingIssues = state => {
  const annotations = values(
    state.scenes.project.scenes.survey.data.annotations.annotationsById
  )
    .filter(item => item.issue && item.issue.open)
    .map(item => assignIn({ unix: moment(item.createdAt).format("X") }, item));
  const comments = values(
    state.scenes.project.scenes.survey.data.comments.commentsById
  )
    .filter(item => item.issue && item.issue.open)
    .map(item => assignIn({ unix: moment(item.createdAt).format("X") }, item));
  const outstandingIssues = orderBy(
    annotations.concat(comments),
    ["upvotesFrom.length", "unix"],
    ["desc", "desc"]
  );
  return outstandingIssues;
};

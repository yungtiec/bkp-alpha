import { combineReducers } from 'redux';

import { default as commentsReducer } from './comments/reducer';

export const reducer = combineReducers({
  comments: commentsReducer
});


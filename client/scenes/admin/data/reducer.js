import { combineReducers } from 'redux';

import { default as pendingAnnotationsReducer } from './pendingAnnotations/reducer';

export const reducer = combineReducers({
  pendingAnnotations: pendingAnnotationsReducer,
});


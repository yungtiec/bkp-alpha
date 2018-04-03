import { combineReducers } from 'redux';

import { default as pendinAnnotationsReducer } from './pendingAnnotations/reducer';

export const reducer = combineReducers({
  pendinAnnotations: pendinAnnotationsReducer,
});

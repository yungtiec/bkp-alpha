import { combineReducers } from 'redux';

import { default as surveyReducer } from './survey/reducer';

export const reducer = combineReducers({
  survey: surveyReducer
});

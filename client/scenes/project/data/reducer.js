import { combineReducers } from 'redux';

import { default as metadataReducer } from './metadata/reducer';
import { default as surveysReducer } from './surveys/reducer';

export const reducer = combineReducers({
  metadata: metadataReducer,
  surveys: surveysReducer
});

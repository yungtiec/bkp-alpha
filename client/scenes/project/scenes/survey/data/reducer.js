import { combineReducers } from 'redux';

import { default as metadataReducer } from './metadata/reducer';
import { default as qnasReducer } from './qnas/reducer';

export const reducer = combineReducers({
  metadata: metadataReducer,
  qnas: qnasReducer
});

import { combineReducers } from 'redux';

import { default as metadataReducer } from './metadata/reducer';
import { default as qnasReducer } from './qnas/reducer';
import { default as annotationsReducer } from './annotations/reducer';


export const reducer = combineReducers({
  metadata: metadataReducer,
  qnas: qnasReducer,
  annotations: annotationsReducer
});

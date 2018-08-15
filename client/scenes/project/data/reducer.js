import { combineReducers } from 'redux';

import { default as metadataReducer } from './metadata/reducer';
import { default as documentsReducer } from './documents/reducer';

export const reducer = combineReducers({
  metadata: metadataReducer,
  documents: documentsReducer
});

import { combineReducers } from 'redux';

import { default as projectsReducer } from './projects/reducer';

export const reducer = combineReducers({
  projects: projectsReducer,
});

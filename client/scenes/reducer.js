import { combineReducers } from 'redux';

import { default as projectReducer } from './project/reducer';
import { default as projectsReducer } from './projects/reducer';

export default combineReducers({
  project: projectReducer,
  projects: projectsReducer,
});

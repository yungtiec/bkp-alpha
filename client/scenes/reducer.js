import { combineReducers } from 'redux';

import { default as projectReducer } from './project/reducer';
import { default as projectsReducer } from './projects/reducer';
import { default as surveyReducer } from './survey/reducer';

export default combineReducers({
  project: projectReducer,
  projects: projectsReducer,
  survey: surveyReducer
});

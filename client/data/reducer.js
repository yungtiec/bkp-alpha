import { combineReducers } from 'redux';

import { default as userReducer } from './user/reducer';

export default combineReducers({
  user: userReducer
});

export * from './user/reducer'
export * from './user/actions'

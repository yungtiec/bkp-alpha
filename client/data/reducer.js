import { combineReducers } from 'redux';

import { default as userReducer } from './user/reducer';

export default combineReducers({
  user: userReducer
});

import { combineReducers } from 'redux';

import { default as userReducer } from './user/reducer';
import { default as modalReducer } from './modal/reducer';


export default combineReducers({
  user: userReducer,
  modal: modalReducer
});

export * from './user/reducer'
export * from './user/actions'
export * from './modal/reducer'
export * from './modal/actions'

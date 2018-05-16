import { combineReducers } from 'redux';

import { default as engagementItemsReducer } from './engagementItems/reducer';

export const reducer = combineReducers({
  engagementItems: engagementItemsReducer
});


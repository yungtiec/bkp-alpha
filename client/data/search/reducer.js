import _ from 'lodash';
import * as types from './actionTypes';

const initialState = {
  input: ''
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SEARCH_INPUT_UPDATED:
      return {
        input: action.input
      }
    case types.SEARCH_INPUT_CLEAR:
      return {
        input: ''
      }
    default:
      return state;
  }
}

export function getSearchInput(state) {
  return state.data.search.input
}

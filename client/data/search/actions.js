import * as types from './actionTypes';

export const updateSearchInput = (input) => ({
  type: types.SEARCH_INPUT_UPDATED,
  input
})

export const clearSearchInput = () => ({
  type: types.SEARCH_INPUT_CLEAR,
})

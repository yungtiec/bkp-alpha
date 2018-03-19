import * as types from './actionTypes';

const defaultUser = {}

export default function (state = defaultUser, action) {
  switch (action.type) {
    case types.GET_USER:
      return action.user
    case types.REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}

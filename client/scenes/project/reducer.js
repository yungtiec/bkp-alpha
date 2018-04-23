import { omit } from "lodash";
import * as projectTypes from "./data/actionTypes";
import * as surveyTypes from "./scenes/survey/data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";
import { reducer as sceneReducer } from "./scenes/reducer";

const initialState = {
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action),
        scenes: sceneReducer(rest.scenes, action)
      };
  }
}

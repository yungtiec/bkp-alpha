import * as types from "./actionTypes";
import { getMetadataByVersionId, putScorecard } from "./service";
import { maxBy } from "lodash";
import { notify } from "reapop";
import { loadModal } from "../../../../data/reducer";

export function fetchMetadataByVersionId(versionId) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.PROJECT_SURVEY_METADATA_FETCH_REQUEST
      });
      var versionMetadata = await getMetadataByVersionId(versionId);
      dispatch({
        type: types.PROJECT_SURVEY_METADATA_FETCH_SUCCESS,
        versionMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function editScorecard({ versionId, scorecard }) {
  return async (dispatch, getState) => {
    try {
      const updatedScorecard = await putScorecard({
        versionId,
        scorecard
      });
      dispatch({
        type: types.VERSION_SCORECARD_UPDATED,
        scorecard: updatedScorecard
      });
    } catch (err) {
      console.log(err);
    }
  };
}

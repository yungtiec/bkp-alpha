import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getResponsibleIssues } from "./service";

export const fetchResponsibleIssues = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { documentsById } = state.data.user;
    const { issueOffset, issueLimit } = state.scenes.dashboard.data;
    const { count, rows } = await getResponsibleIssues({
      versionIds: values(documentsById).reduce((idArray, s) => {
        return idArray.concat(s.versions.map(ps => ps.id));
      }, []),
      offset: issueOffset,
      limit: issueLimit
    });
    const issuesById = keyBy(rows, "id");
    const issueIds = rows.map(i => i.id);
    dispatch({
      type: types.RESPONSIBLE_ISSUES_FETCHED_SUCESSS,
      issueOffset: issueOffset + issueLimit,
      issuesById,
      issueIds,
      count
    });
  } catch (err) {
    console.log(err);
  }
};

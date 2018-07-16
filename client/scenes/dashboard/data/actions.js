import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getResponsibleIssues } from "./service";

export const fetchResponsibleIssues = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { projectSurveysById } = state.data.user;
    const { issueOffset, issueLimit } = state.scenes.dashboard.data;
    const { count, rows } = await getResponsibleIssues({
      projectSurveyIds: values(projectSurveysById).reduce((idArray, ps) => {
        return idArray.concat(ps.id).concat(ps.descendents.map(d => d.id));
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

export function fetchQuestionsBySurveyId(surveyId) {
  return async (dispatch, getState) => {
    try {
      const projectSymbol = getState().project.selectedSymbol;
      const project = await getProjectBySymbol(symbol);
      const surveyQnas = keyBy(project.project_surveys[0], "id")[surveyId]
        .survey_questions;
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyMetadata = omit(project.project_surveys[0], ["survey_questions"])
      dispatch({
        type: types.SURVEY_FETCH_SUCCESS,
        surveyQnasById,
        surveyQnaIds,
        surveyMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

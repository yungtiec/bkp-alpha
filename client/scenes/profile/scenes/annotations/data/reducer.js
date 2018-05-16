import { keyBy, keys, values, groupBy, orderBy, assignIn, forIn } from "lodash";
import * as types from "./actionTypes";
import moment from "moment";

const initialState = {
  annotationsById: {},
  annotationIds: [],
  pageCount: 0,
  pageLimit: 10,
  pageOffset: 0,
  pageProjectFilter: [],
  pageSurveyFilter: [],
  checked: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_ANNOTATIONS_FETCH_SUCCESS:
      return {
        ...state,
        annotationsById: action.annotationsById,
        annotationIds: action.annotationIds,
        pageCount: Math.ceil(action.annotationCount / state.pageLimit)
      };
    case types.PAGE_LIMIT_UPDATED:
      return { ...state, pageLimit: action.pageLimit };
    case types.PAGE_OFFSET_UPDATED:
      return { ...state, pageOffset: action.pageOffset };
    case types.PAGE_PROJECT_FILTER_UPDATED:
      return { ...state, pageProjectFilter: action.pageProjectFilter };
    case types.PAGE_SURVEY_FILTER_UPDATED:
      return { ...state, pageSurveyFilter: action.pageSurveyFilter };
    case types.SIDEBAR_FILTER_CHECKED:
      return { ...state, checked: action.checked };
    default:
      return state;
  }
}

export const getUserAnnotations = state => {
  const {
    annotationsById,
    annotationIds
  } = state.scenes.profile.scenes.annotations.data;
  return {
    annotationsById,
    annotationIds
  };
};

function groupAnnotationsByProjectThenBySurvey(annotationCollection) {
  var annotationsByProjectBySurvey = groupBy(
    annotationCollection,
    "project_survey.project.symbol"
  );
  forIn(annotationsByProjectBySurvey, (projectAnnoatations, projectSymbol) => {
    annotationsByProjectBySurvey[projectSymbol] = groupBy(
      projectAnnoatations,
      "project_survey.survey.title"
    );
    forIn(
      annotationsByProjectBySurvey[projectSymbol],
      (projectSurveyAnnotations, surveyTitle) => {
        annotationsByProjectBySurvey[projectSymbol][surveyTitle] = orderBy(
          projectSurveyAnnotations.map(annotation =>
            assignIn(
              { unix: moment(annotation.createdAt).format("X") },
              annotation
            )
          ),
          ["unix"],
          ["desc"]
        ).map(a => a.id);
      }
    );
  });
  return annotationsByProjectBySurvey;
}

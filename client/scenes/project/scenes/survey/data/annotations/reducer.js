import {
  cloneDeep,
  find,
  orderBy,
  values,
  isEmpty,
  keys,
  assignIn,
  filter,
  flatten,
  maxBy
} from "lodash";
import * as types from "./actionTypes";
import moment from "moment";
import { findItemInTreeById } from "../../../../../../utils";

const initialState = {
  annotationsById: {},
  annotationIds: null
};

const sortFns = {
  timestamp: sortAnnotationsByTimestamp,
  upvotes: sortAnnotationsByUpvotes,
  position: sortAnnotationsByPosition
};

function removeEmptyAnnotationFromHierarchy({ state, accessors, parent }) {
  const rootAnnotation = state.annotationsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    state.annotationsById[accessors[0]].children = state.annotationsById[
      accessors[0]
    ].children.filter(child => !isEmpty(child));
  } else {
    var current = rootAnnotation;
    anscestors.filter(a => a).forEach(aid => {
      current = find(current.children, a => a.id === aid);
    });
    current.children = current.children.filter(child => !isEmpty(child));
  }
  return state;
}

function addEmptyAnnotationToHierarchy({ state, accessors, parent }) {
  const rootAnnotation = state.annotationsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    // add empty annotation to root annotation
    if (!state.annotationsById[accessors[0]].children)
      state.annotationsById[accessors[0]].children = [];
    state.annotationsById[accessors[0]].children.push({});
  } else {
    var current = rootAnnotation;
    anscestors.forEach(aid => {
      current = find(current.children, a => a.id === aid);
    });
    if (!current.children) current.children = [];
    // add empty annotation to parent
    current.children.push({});
  }
  return state;
}

function addNewAnnotationSentFromServer({ state, annotation }) {
  state.annotationsById[annotation.id] = annotation;
  state.annotationIds = keys(state.annotationsById);
  return state;
}

function reviewAnnotation({ state, annotationId, rootId, reviewed }) {
  var target;
  if (state.annotationsById[annotationId]) {
    // itself is root
    state.annotationsById[annotationId].reviewed = reviewed;
  } else {
    // its descendant(reply) to another annotation
    target = find(
      state.annotationsById[rootId].descendents,
      a => a.id === annotationId
    );
    target.reviewed = reviewed;
  }
  return state;
}

function updateAnnotationIssueStatus({ state, annotationId, open }) {
  if (!state.annotationsById[annotationId].issue) {
    state.annotationsById[annotationId].issue = {};
  }
  state.annotationsById[annotationId].issue.open = open;
  return state;
}

function updateUpvotesForAnnotation({
  state,
  annotationId,
  rootId,
  upvotesFrom
}) {
  var target;
  if (state.annotationsById[annotationId]) {
    // itself is root
    state.annotationsById[annotationId].upvotesFrom = upvotesFrom;
  } else {
    // its descendant(reply) to another annotation
    target = find(
      state.annotationsById[rootId].descendents,
      a => a.id === annotationId
    );
    target.upvotesFrom = upvotesFrom;
  }
  return state;
}

function removeTagFromAnnotation({ state, annotation }) {
  state.annotationsById[annotation.id] = annotation;
  return state;
}

function addTagToAnnotation({ state, annotation }) {
  state.annotationsById[annotation.id] = annotation;
  return state;
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ANNOTATIONS_FETCH_SUCCESS:
      return {
        annotationsById: action.annotationsById,
        annotationIds: keys(action.annotationsById)
      };
    case types.ANNOTATION_REPLY_INIT:
      return addEmptyAnnotationToHierarchy({
        state: cloneDeep(state),
        accessors: action.accessors,
        parent: action.parent
      });
    case types.ANNOTATION_REPLY_CANCEL:
      return removeEmptyAnnotationFromHierarchy({
        state: cloneDeep(state),
        accessors: action.accessors,
        parent: action.parent
      });
    case types.ANNOTATION_ADDED:
      return addNewAnnotationSentFromServer({
        state: cloneDeep(state),
        annotation: action.annotation
      });
    case types.ANNOTATION_UPDATED:
      return addNewAnnotationSentFromServer({
        state: cloneDeep(state),
        annotation: action.rootAnnotation
      });
    case types.ANNOTATION_UPVOTED:
      return updateUpvotesForAnnotation({
        state: cloneDeep(state),
        rootId: action.rootId,
        annotationId: action.annotationId,
        upvotesFrom: action.upvotesFrom
      });
    case types.ANNOTATION_VERIFIED:
      return reviewAnnotation({
        state: cloneDeep(state),
        annotationId: action.annotationId,
        reviewed: action.reviewed,
        rootId: action.rootId
      });
    case types.ANNOTATION_ISSUE_UPDATED:
      return updateAnnotationIssueStatus({
        state: cloneDeep(state),
        annotationId: action.annotationId,
        open: action.open
      });
    case types.ANNOTATION_TAG_REMOVED:
      return removeTagFromAnnotation({
        state: cloneDeep(state),
        annotation: action.annotation
      });
    case types.ANNOTATION_TAG_ADDED:
      return addTagToAnnotation({
        state: cloneDeep(state),
        annotation: action.annotation
      });
    default:
      return state;
  }
}

/**
 *
 * filter tags
 *
 */

function filterByTags({ tagFilter, annotationsById, annotationIds }) {
  var tagFilterArray = keys(tagFilter).filter(tag => tagFilter[tag]);
  if (!tagFilterArray.length) return annotationIds;
  return filter(annotationIds, aid => {
    return tagFilterArray.reduce((bool, tag) => {
      return (
        bool || annotationsById[aid].tags.map(t => t.name).indexOf(tag) !== -1
      );
    }, false);
  });
}

/**
 *
 * filter issue
 *
 */

function filterByIssue({
  annotationIssueFilter,
  annotationsById,
  annotationIds
}) {
  if (!annotationIssueFilter.length) return annotationIds;
  return filter(annotationIds, aid => {
    return annotationIssueFilter.reduce((bool, issueStatus) => {
      return bool || issueStatus === "open"
        ? annotationsById[aid].issue && annotationsById[aid].issue.open
        : annotationsById[aid].issue && !annotationsById[aid].issue.open;
    }, false);
  });
}

/**
 *
 * sort fns
 *
 */

function sortAnnotationsByPosition(annotationCollection) {
  if (!annotationCollection.length) return [];
  return orderBy(
    annotationCollection,
    ["range.order_in_survey", "range.startIndex", "range.endIndex"],
    ["asc", "asc", "asc"]
  );
}

function sortAnnotationsByTimestamp(annotationCollection) {
  return orderBy(
    annotationCollection,
    ["unix", "upvotesFrom.length"],
    ["desc", "desc"]
  );
}

function sortAnnotationsByUpvotes(annotationCollection) {
  return orderBy(
    annotationCollection,
    ["upvotesFrom.length", "unix"],
    ["desc", "desc"]
  );
}

function splitRangePath(path) {
  const paths = path.split("/").slice(1);
  const elements = paths.map(p => {
    var [element, order] = p.split("[");
    order = order.replace("]", "");
    if (element === "h5") return [1, Number(order)];
    if (element === "div") return [2, Number(order)];
    if (element === "p") return [3, Number(order)];
  });
  return flatten(elements);
}

function getStartAndEndIndexInSurveyQna(
  surveyQnaIds,
  surveyQnasById,
  annotation
) {
  try {
    if (!surveyQnaIds.length) return;
    const surveyQuestion = surveyQnasById[annotation.survey_question_id];
    const surveyQnaContent =
      surveyQuestion.question.markdown +
      surveyQuestion.project_survey_answers.reduce(
        (string, answer) => answer.markdown + " ",
        ""
      );
    const startIndex = surveyQnaContent.indexOf(annotation.quote);
    const endIndex = startIndex + annotation.quote.length;
    const order_in_survey = surveyQuestion.order_in_survey;
    return { startIndex, endIndex, order_in_survey };
  } catch (err) {}
}

/**
 *
 * selectors
 *
 */

export function getAllAnnotations(state) {
  var filteredAnnotationIds;
  const verificationStatus =
    state.scenes.project.scenes.survey.verificationStatus;
  const sortFn = sortFns[state.scenes.project.scenes.survey.annotationSortBy];
  var {
    annotationIds,
    annotationsById
  } = state.scenes.project.scenes.survey.data.annotations;
  const engagementTab = state.scenes.project.scenes.survey.engagementTab;
  const tagFilterKey =
    engagementTab === "annotations" ? "annotationFilter" : "commentFilter";
  const tagFilter = state.scenes.project.scenes.survey.data.tags[tagFilterKey];
  const annotationIssueFilter =
    state.scenes.project.scenes.survey.annotationIssueFilter;
  const {
    surveyQnaIds,
    surveyQnasById
  } = state.scenes.project.scenes.survey.data.qnas;
  const annotationCollection = values(annotationsById).map(annotation => {
    const range = getStartAndEndIndexInSurveyQna(
      surveyQnaIds,
      surveyQnasById,
      annotation
    );
    return assignIn(
      { unix: moment(annotation.createdAt).format("X"), range },
      annotation
    );
  });
  var sortedAnnotations = sortFn(annotationCollection);
  var sortedAnnotationIds = sortedAnnotations
    .map(a => a.id)
    .filter(aid => annotationsById[aid].reviewed !== "spam");
  filteredAnnotationIds = filterByTags({
    tagFilter,
    annotationIds: sortedAnnotationIds,
    annotationsById
  });
  filteredAnnotationIds = filterByIssue({
    annotationIssueFilter,
    annotationsById,
    annotationIds: filteredAnnotationIds
  });
  if (verificationStatus === "all") {
    return {
      unfilteredAnnotationIds: sortedAnnotationIds,
      annotationIds: filteredAnnotationIds,
      annotationsById
    };
  } else {
    filteredAnnotationIds = filteredAnnotationIds.filter(
      aid =>
        annotationsById[aid].reviewed === verificationStatus &&
        annotationsById[aid].reviewed !== "spam"
    );
    return {
      annotationIds: filteredAnnotationIds,
      annotationsById,
      unfilteredAnnotationIds: sortedAnnotationIds
    };
  }
}

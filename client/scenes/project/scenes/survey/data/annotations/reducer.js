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
import { findItemInTreeById } from "../utils";

const initialState = {
  annotationsById: {},
  annotationIds: []
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

function reviewAnnotation({ state, annotationId, reviewed }) {
  var target;
  if (state.annotationsById[annotationId]) {
    // itself is root
    state.annotationsById[annotationId].reviewed = reviewed;
  } else {
    // its descendant(reply) to another annotation
    target = findItemInTreeById(values(state.annotationsById), annotationId);
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

function updateUpvotesForAnnotation({ state, annotationId, upvotesFrom }) {
  var target;
  if (state.annotationsById[annotationId]) {
    // itself is root
    state.annotationsById[annotationId].upvotesFrom = upvotesFrom;
  } else {
    // its descendant(reply) to another annotation
    target = findItemInTreeById(values(state.annotationsById), annotationId);
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
        annotationId: action.annotationId,
        upvotesFrom: action.upvotesFrom
      });
    case types.ANNOTATION_VERIFIED:
      return reviewAnnotation({
        state: cloneDeep(state),
        annotationId: action.annotationId,
        reviewed: action.reviewed
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
 * filter fns
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
 * sort fns
 *
 */

function sortAnnotationsByPosition(annotationCollection) {
  if (!annotationCollection.length) return [];
  var mostNestedStartDomPath = maxBy(
    annotationCollection,
    a => a.range.start.length
  ).range.start;
  var mostNestedEndDomPath = maxBy(
    annotationCollection,
    a => a.range.end.length
  ).range.end;
  const startPathOrder = mostNestedStartDomPath.map(
    (p, i) => `range.start[${i}]`
  );
  const endPathOrder = mostNestedEndDomPath.map((p, i) => `range.end[${i}]`);
  const orderByArray = flatten([
    "survey_question_id",
    startPathOrder,
    "range.startOffset",
    endPathOrder,
    "range.endOffset"
  ]);
  return orderBy(
    annotationCollection,
    flatten([
      "survey_question_id",
      startPathOrder,
      "range.startOffset",
      endPathOrder,
      "range.endOffset"
    ]),
    orderByArray.map(o => "asc")
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

/**
 *
 * selectors
 *
 */

export function getAllAnnotations(state) {
  const verificationStatus =
    state.scenes.project.scenes.survey.verificationStatus;
  const sortFn = sortFns[state.scenes.project.scenes.survey.annotationSortBy];
  var {
    annotationIds,
    annotationsById
  } = state.scenes.project.scenes.survey.data.annotations;
  const tagFilter = state.scenes.project.scenes.survey.data.tags.filter;
  const annotationCollection = values(annotationsById).map(annotation => {
    const start = splitRangePath(annotation.ranges[0].start);
    const end = splitRangePath(annotation.ranges[0].end);
    const range = {
      start,
      end,
      startOffset: annotation.ranges[0].startOffset,
      endOffset: annotation.ranges[0].endOffset
    };
    return assignIn(
      { unix: moment(annotation.createdAt).format("X"), range },
      annotation
    );
  });
  var sortedAnnotations = sortFn(annotationCollection);
  var sortedAnnotationIds = sortedAnnotations.map(a => a.id);
  var filteredAnnotationIds = filterByTags({
    tagFilter,
    annotationIds: sortedAnnotationIds,
    annotationsById
  });
  if (verificationStatus === "all") {
    return {
      unfilteredAnnotationIds: sortedAnnotationIds,
      annotationIds: filteredAnnotationIds,
      annotationsById
    };
  } else {
    filteredAnnotationIds = filteredAnnotationIds.filter(
      aid => annotationsById[aid].reviewed === verificationStatus
    );
    return {
      annotationIds: filteredAnnotationIds,
      annotationsById,
      unfilteredAnnotationIds: sortedAnnotationIds
    };
  }
}

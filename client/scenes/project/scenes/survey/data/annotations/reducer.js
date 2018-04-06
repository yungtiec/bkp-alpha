import { cloneDeep, find, orderBy, values, isEmpty, keys } from "lodash";
import * as types from "./actionTypes";

const initialState = {
  annotationsById: {},
  annotationIds: []
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
  var sortedAnnotations;
  state.annotationsById[annotation.id] = annotation;
  sortedAnnotations = orderBy(
    values(state.annotationsById),
    ["survey_question_id"],
    ["asc"]
  );
  state.annotationIds = sortedAnnotations.map(a => a.id);
  return state;
}

function findAnnotationInTreeById(annotationCollection, targetId) {
  if (find(annotationCollection, a => a.id === targetId)) {
    return find(annotationCollection, a => a.id === targetId);
  }
  var result, aid;
  for (var i = 0; i < annotationCollection.length; i++) {
    if (
      annotationCollection[i].children &&
      annotationCollection[i].children.length
    ) {
      result = findAnnotationInTreeById(
        annotationCollection[i].children,
        targetId
      );
      if (result) {
        return result;
      }
    }
  }
  return result;
}

function reviewAnnotation({ state, annotationId, reviewed }) {
  var target;
  if (state.annotationsById[annotationId]) {
    // itself is root
    state.annotationsById[annotationId].reviewed = reviewed;
  } else {
    // its descendant(reply) to another annotation
    target = findAnnotationInTreeById(
      values(state.annotationsById),
      annotationId
    );
    target.reviewed = reviewed;
  }
  return state;
}

export default function reduce(state = initialState, action = {}) {
  var sortedAnnotations, annotationIds;
  switch (action.type) {
    case types.ANNOTATIONS_FETCH_SUCCESS:
      sortedAnnotations = orderBy(
        values(action.annotationsById),
        ["survey_question_id"],
        ["asc"]
      );
      annotationIds = sortedAnnotations.map(a => a.id);
      return {
        annotationsById: action.annotationsById,
        annotationIds
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
    case types.ANNOTATION_UPVOTED:
      return addNewAnnotationSentFromServer({
        state: cloneDeep(state),
        annotation: action.rootAnnotation
      });
    case types.ANNOTATION_VERIFIED:
      return reviewAnnotation({
        state: cloneDeep(state),
        annotationId: action.annotationId,
        reviewed: action.reviewed
      });
    default:
      return state;
  }
}

export function getAllAnnotations(state) {
  const annotationType = state.scenes.project.scenes.survey.annotationType;
  var filteredAnnotationIds, annotationIds, annotationsById;
  if (annotationType === "all") {
    return {
      unfilteredAnnotationIds:
        state.scenes.project.scenes.survey.data.annotations.annotationIds,
      ...state.scenes.project.scenes.survey.data.annotations
    };
  } else {
    annotationIds =
      state.scenes.project.scenes.survey.data.annotations.annotationIds;
    annotationsById =
      state.scenes.project.scenes.survey.data.annotations.annotationsById;
    filteredAnnotationIds = annotationIds.filter(
      aid => annotationsById[aid].reviewed === annotationType
    );
    return {
      annotationIds: filteredAnnotationIds,
      annotationsById,
      unfilteredAnnotationIds:
        state.scenes.project.scenes.survey.data.annotations.annotationIds
    };
  }
}

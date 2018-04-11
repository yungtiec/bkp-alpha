import {
  cloneDeep,
  find,
  orderBy,
  values,
  isEmpty,
  keys,
  assignIn,
  filter
} from "lodash";
import * as types from "./actionTypes";
import moment from "moment";

const initialState = {
  annotationsById: {},
  annotationIds: []
};

const sortFns = {
  timestamp: sortAnnotationsByTimestamp,
  upvotes: sortAnnotationsByUpvotes
};

function sortAnnotationsByTimestamp(annotationCollection) {
  return orderBy(
    annotationCollection.map(annotation =>
      assignIn({ unix: moment(annotation.createdAt).format("X") }, annotation)
    ),
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
  state.annotationIds = keys(state.annotationsById);
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

function removeTagFromAnnotation({ state, annotation }) {
  state.annotationsById[annotation.id] = annotation;
  return state;
}

function addTagToAnnotation({ state, annotation }) {
  state.annotationsById[annotation.id] = annotation;
  return state;
}

export default function reduce(state = initialState, action = {}) {
  var sortedAnnotations, annotationIds;
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

export function getAllAnnotations(state) {
  const annotationType = state.scenes.project.scenes.survey.annotationType;
  const sortFn = sortFns[state.scenes.project.scenes.survey.sortBy];
  var {
    annotationIds,
    annotationsById
  } = state.scenes.project.scenes.survey.data.annotations;
  const tagFilter = state.scenes.project.scenes.survey.data.tags.filter;
  var sortedAnnotations = sortFn(values(annotationsById));
  var sortedAnnotationIds = sortedAnnotations.map(a => a.id);
  var filteredAnnotationIds = filterByTags({
    tagFilter,
    annotationIds: sortedAnnotationIds,
    annotationsById
  });
  if (annotationType === "all") {
    return {
      unfilteredAnnotationIds: sortedAnnotationIds,
      annotationIds: filteredAnnotationIds,
      annotationsById
    };
  } else {
    filteredAnnotationIds = filteredAnnotationIds.filter(
      aid => annotationsById[aid].reviewed === annotationType
    );
    return {
      annotationIds: filteredAnnotationIds,
      annotationsById,
      unfilteredAnnotationIds: sortedAnnotationIds
    };
  }
}


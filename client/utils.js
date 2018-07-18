import { find } from "lodash";
import history from "./history";

/**
 * itemCollection has a tree like structure
 * a collection in which each element has a children array, aka another collection
 * example: values(annotationsById), values(commentsById)
 */
export function findItemInTreeById(itemCollection, targetId, idKey = "id") {
  if (find(itemCollection, a => a[idKey] === targetId)) {
    return find(itemCollection, a => a[idKey] === targetId);
  }
  var result, aid;
  for (var i = 0; i < itemCollection.length; i++) {
    if (itemCollection[i].children && itemCollection[i].children.length) {
      result = findItemInTreeById(itemCollection[i].children, targetId);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

export function getCommentContextPath(comment) {
  var rootItem =
    comment.ancestors && comment.ancestors.length
      ? find(comment.ancestors, a => a.hierarchyLevel === 1)
      : comment;
  return comment.uri
    ? `${rootItem.uri.replace(window.origin, "")}/question/${
        comment.survey_question_id
      }/comment/${rootItem.id}`
    : `/project/${comment.project_survey.survey.project.symbol}/survey/${
        comment.project_survey.id
      }/comment/${rootItem.id}`;
}

export function seeCommentContext(comment) {
  return history.push(getCommentContextPath(comment));
}

import { find } from "lodash";
import history from "../history";

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
  return `/s/${comment.version.document.version_slug}/comment/${rootItem.id}`;
}

export function seeCommentContext(comment) {
  return history.push(getCommentContextPath(comment));
}

export { default as TextDiff } from "./text-diff";

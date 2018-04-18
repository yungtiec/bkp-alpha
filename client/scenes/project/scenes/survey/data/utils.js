import { find } from "lodash";

/**
 * itemCollection has a tree like structure
 * a collection in which each element has a children array, aka another collection
 * example: values(annotationsById), values(commentsById)
 */
export function findItemInTreeById(itemCollection, targetId) {
  if (find(itemCollection, a => a.id === targetId)) {
    return find(itemCollection, a => a.id === targetId);
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

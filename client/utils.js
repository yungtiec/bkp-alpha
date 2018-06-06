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

export function seeAnnotationContext(engagementItem) {
  var rootItem =
    engagementItem.ancestors && engagementItem.ancestors.length
      ? find(engagementItem.ancestors, a => a.hierarchyLevel === 1)
      : engagementItem;
  const path =
    engagementItem.uri
      ? `${rootItem.uri.replace(window.origin, "")}/question/${
          engagementItem.survey_question_id
        }/annotation/${rootItem.id}`
      : `/project/${engagementItem.project_survey.project.symbol}/survey/${
          engagementItem.project_survey.id
        }/annotation/${rootItem.id}`;
  return history.push(path);
}

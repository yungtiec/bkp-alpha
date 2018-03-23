import { find } from "lodash";

export const findFirstAnnotationInQna = ({
  annotationIds,
  annotationsById,
  survey_question_id
}) => {
  if (!annotationIds.length) return;
  const firstAnnotation = find(
    annotationIds.map(aid => annotationsById[aid]),
    annotation => annotation.survey_question_id === survey_question_id
  )
  return firstAnnotation ? firstAnnotation.id : ''
};

import { find } from "lodash";
import striptags from "striptags";

export const findFirstAnnotationInQna = ({
  annotationIds,
  annotationsById,
  survey_question_id
}) => {
  if (!annotationIds.length) return;
  const firstAnnotation = find(
    annotationIds.map(aid => annotationsById[aid]),
    annotation => annotation.survey_question_id === survey_question_id
  );
  return firstAnnotation ? firstAnnotation.id : "";
};

export const findAnnotationsInQna = ({
  annotationIds,
  annotationsById,
  survey_question_id
}) => {
  if (!annotationIds.length) return;
  return annotationIds
    .map(aid => annotationsById[aid])
    .filter(annotation => annotation.survey_question_id === survey_question_id);
};

export const findAnnotationsInQnaByText = ({
  annotationIds,
  annotationsById,
  text,
  qnaId,
  answerId // not in used yet
}) => {
  text = striptags(text);
  if (!annotationIds.length) return;
  return annotationIds
    .map(aid => annotationsById[aid])
    .filter(
      annotation =>
        qnaId === annotation.survey_question_id &&
        annotation.quote.trim().indexOf(text.trim()) !== -1
    );
};

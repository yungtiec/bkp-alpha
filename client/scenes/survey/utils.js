import { find } from "lodash";
import striptags from "striptags";

export const findCommentsInQnaByText = ({
  commentIds,
  commentsById,
  text,
  qnaId,
  answerId // not in used yet
}) => {
  text = striptags(text);
  if (!commentIds.length) return [];
  return commentIds
    .map(aid => commentsById[aid])
    .filter(
      comment =>
        comment.reviewed !== "spam" &&
        qnaId === comment.survey_question_id &&
        comment.quote.trim().indexOf(text.trim()) !== -1
    );
};

export function getFullNameFromUserObject(person) {
  const firstName = person.first_name && person.first_name.toLowerCase();
  const lastName = person.last_name && person.last_name.toLowerCase();
  const fullName = firstName ? `${firstName} ${lastName}` : lastName;
  return fullName;
}

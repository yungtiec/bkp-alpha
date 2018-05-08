import React from "react";
import { AnnotationMain, AnnotationReply } from "../../../components";
import history from "../../../history";

const seeAnnotationContext = engagementItem => {
  const path =
    engagementItem.engagementItemType === "annotation"
      ? engagementItem.ancestors && engagementItem.ancestors.length
        ? `${engagementItem.ancestors[0].uri.replace(
            window.origin,
            ""
          )}/question/${engagementItem.survey_question_id}/annotation/${
            engagementItem.ancestors[0].id
          }`
        : `${engagementItem.uri.replace(window.origin, "")}/question/${
            engagementItem.survey_question_id
          }/annotation/${engagementItem.id}`
      : `/project/${
          engagementItem.project_survey.project.symbol
        }/survey/${engagementItem.project_survey.survey.id}/page-comments`;
  return history.push(path);
};

const ancestorIsSpam = ancestors =>
  ancestors.reduce((bool, a) => a.reviewed === "spam" || bool, false);

export default ({ engagementItemsById, engagementItemIds }) => (
  <div>
    {!engagementItemIds.length && (
      <p style={{ marginTop: "15px" }}>You haven't made any annotation.</p>
    )}
    {engagementItemIds.map(
      aid =>
        engagementItemsById[aid].parentId ? (
          <AnnotationReply
            key={`profile__annotation-reply--${aid}`}
            annotation={engagementItemsById[aid]}
          >
            <a
              key={`profile__annotationreply--${aid}`}
              className="see-in-context"
              onClick={() => seeAnnotationContext(engagementItemsById[aid])}
            >
              {engagementItemsById[aid].reviewed !== "spam" &&
                !ancestorIsSpam(engagementItemsById[aid].ancestors) &&
                "see in context"}
            </a>
            {engagementItemsById[aid].reviewed !== "spam" &&
              ancestorIsSpam(engagementItemsById[aid].ancestors) &&
              "reply no longer exists because the thread contains spam"}
          </AnnotationReply>
        ) : (
          <AnnotationMain
            key={`profile__annotation-main--${aid}`}
            annotation={engagementItemsById[aid]}
          >
            <a
              key={`profile__annotation-main--${aid}`}
              className="see-in-context"
              onClick={() => seeAnnotationContext(engagementItemsById[aid])}
            >
              {engagementItemsById[aid].reviewed !== "spam" && "see in context"}
            </a>
          </AnnotationMain>
        )
    )}
  </div>
);

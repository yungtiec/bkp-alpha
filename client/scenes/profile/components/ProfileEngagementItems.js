import React from "react";
import { AnnotationMain, AnnotationReply } from "../../../components";
import history from "../../../history";
import { find } from "lodash";
import { seeAnnotationContext } from "../../../utils";

const ancestorIsSpam = ancestors =>
  ancestors.reduce((bool, a) => a.reviewed === "spam" || bool, false);

export default ({ engagementItemsById, engagementItemIds }) => (
  <div>
    {!engagementItemIds.length && (
      <p style={{ marginTop: "35px" }}>You haven't made any annotation.</p>
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

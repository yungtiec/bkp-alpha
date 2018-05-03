import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { groupBy, keys, isEmpty } from "lodash";
import moment from "moment";
import {
  ProjectSymbolBlueBox,
  AnnotationMain,
  AnnotationReply
} from "../../../../components";
import { ProfileSidebar } from "../../components";
import {
  updatePageLimit,
  updatePageOffset,
  updatePageProjectFilter,
  updatePageSurveyFilter,
  checkSidebarFilter
} from "./data/actions";

import history from "../../../../history";

const seeAnnotationContext = annotation => {
  const path =
    annotation.ancestors && annotation.ancestors.length
      ? `${annotation.ancestors[0].uri.replace(window.origin, "")}/question/${
          annotation.survey_question_id
        }/annotation/${annotation.ancestors[0].id}`
      : `${annotation.uri.replace(window.origin, "")}/question/${
          annotation.survey_question_id
        }/annotation/${annotation.id}`;
  return history.push(path);
};

const ancestorIsSpam = ancestors =>
  ancestors.reduce((bool, a) => a.reviewed === "spam" || bool, false);

const ProfileAnnotations = ({
  annotationsById,
  annotationIds,
  checked,
  checkSidebarFilter
}) => {
  return (
    <div className="profile-enagement-items__container main-container">
      <ProfileSidebar
        checked={checked}
        checkSidebarFilter={checkSidebarFilter}
        nodes={[
          {
            value: "status",
            label: "STATUS",
            children: [
              { value: "verified", label: "Verified" },
              { value: "spam", label: "Spam" },
              { value: "pending", label: "Pending" }
            ]
          }
        ]}
      />
      <div className="profile-enagement-items">
        {annotationIds.map(
          aid =>
            annotationsById[aid].parentId ? (
              <AnnotationReply
                key={`profile__annotation-reply--${aid}`}
                annotation={annotationsById[aid]}
              >
                <a
                  key={`profile__annotationreply--${aid}`}
                  className="see-in-context"
                  onClick={() => seeAnnotationContext(annotationsById[aid])}
                >
                  {annotationsById[aid].reviewed !== "spam" &&
                    !ancestorIsSpam(annotationsById[aid].ancestors) &&
                    "see in context"}
                </a>
                {annotationsById[aid].reviewed !== "spam" &&
                  ancestorIsSpam(annotationsById[aid].ancestors) &&
                  "reply no longer exists because the thread contains spam"}
              </AnnotationReply>
            ) : (
              <AnnotationMain
                key={`profile__annotation-main--${aid}`}
                annotation={annotationsById[aid]}
              >
                <a
                  key={`profile__annotation-main--${aid}`}
                  className="see-in-context"
                  onClick={() => seeAnnotationContext(annotationsById[aid])}
                >
                  {annotationsById[aid].reviewed !== "spam" && "see in context"}
                </a>
              </AnnotationMain>
            )
        )}
      </div>
    </div>
  );
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    checked: state.scenes.profile.scenes.annotations.data.checked
  };
};

const actions = {
  checkSidebarFilter
};

export default connect(mapState, actions)(ProfileAnnotations);

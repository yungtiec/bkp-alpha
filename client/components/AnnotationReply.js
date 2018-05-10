import "./AnnotationReply.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";
import Avatar from "react-avatar";

export default ({ annotation, path, children }) => {
  const replier = annotation.owner ? (
    <Avatar
      name={`${annotation.owner.first_name} ${annotation.owner.last_name}`}
      size={40}
      color={"#999999"}
    />
  ) : (
    "you"
  );

  const parent = annotation.ancestors.slice(-1)[0];

  return (
    <div className="reply-annotation__main">
      <div className="reply-annotation__parent">
        <div
          className={`reply-annotation__parent-header ${
            annotation.project_survey ? "reply-annotation__parent-header--mobile" : ""
          }`}
        >
          {annotation.project_survey && annotation.project_survey.survey ? (
            <div className="reply-annotation__survey-title-container">
              <span className="reply-annotation__survey-title">
                {annotation.project_survey.project.name}:{" "}
                {annotation.project_survey.survey.title}
              </span>
            </div>
          ) : (
            <p className="reply-annotation__user">
              <span>
                <Avatar
                  name={`${parent.owner.first_name} ${parent.owner.last_name}`}
                  size={40}
                  color={"#999999"}
                />
              </span>
              <span>{moment(parent.createdAt).fromNow()}</span>
            </p>
          )}
          <p>
            <span
              className={`reply-annotation__review reply-annotation__review reply-annotation__review--${
                annotation.reviewed
              }`}
            >
              {annotation.reviewed}
            </span>
          </p>
        </div>
        {annotation.project_survey &&
          annotation.project_survey.survey && (
            <p className="reply-annotation__user">
              <span>
                <Avatar
                  name={`${parent.owner.first_name} ${parent.owner.last_name}`}
                  size={40}
                  color={"#999999"}
                />
              </span>
              <span>{moment(parent.createdAt).fromNow()}</span>
            </p>
          )}
        <p className="reply-annotation__quote">{annotation.quote}</p>
        <p className="reply-annotation__comment">{parent.comment}</p>
        <div className="reply-annotation__tags">
          {parent.tags && parent.tags.length
            ? parent.tags.map(tag => (
                <span
                  key={`annotation-${parent.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
      </div>

      <div className="reply-annotation__reply">
        <p className="reply-annotation__user">
          <span>
            {replier} replied {moment(annotation.createdAt).fromNow()}
          </span>
        </p>
        <p className="reply-annotation__comment">{annotation.comment}</p>
      </div>

      <div className="reply-annotation__action--bottom">
        <div />
        {children}
      </div>
    </div>
  );
};

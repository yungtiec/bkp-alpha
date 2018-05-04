import "./AnnotationMain.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";
import Avatar from "react-avatar";

export default ({ annotation, path, children }) => (
  <div className="main-annotation__main">
    <div className="main-annotation__header">
      {annotation.project_survey && annotation.project_survey.survey ? (
        <div>
          <span className="main-annotation__survey-title">
            {annotation.project_survey.project.name}:{" "}
            {annotation.project_survey.survey.title}
          </span>
        </div>
      ) : (
        <p className="main-annotation__user">
          {annotation.owner && (
            <span>
              <Avatar
                name={`${annotation.owner.first_name} ${
                  annotation.owner.last_name
                }`}
                color={"#999999"}
                size={40}
              />
            </span>
          )}
          <span>{moment(parent.createdAt).fromNow()}</span>
        </p>
      )}
      <p>
        {annotation.issue && (
          <span
            className={`main-annotation__review main-annotation__review--issue-${
              annotation.issue.open ? "open" : "close"
            }`}
          >
            {annotation.issue.open ? "issue:open" : "issue:close"}
          </span>
        )}
        <span
          className={`main-annotation__review main-annotation__review--${
            annotation.reviewed
          }`}
        >
          {annotation.reviewed}
        </span>
      </p>
    </div>
    {annotation.project_survey &&
      annotation.project_survey.survey && (
        <p className="main-annotation__user">
          {annotation.owner && (
            <span>
              <Avatar
                name={`${annotation.owner.first_name} ${
                  annotation.owner.last_name
                }`}
                color={"#999999"}
                size={40}
              />
            </span>
          )}
          <span>{moment(parent.createdAt).fromNow()}</span>
        </p>
      )}
    <p className="main-annotation__quote">{annotation.quote}</p>
    <p className="main-annotation__comment">{annotation.comment}</p>
    <div className="main-annotation__tags">
      {annotation.tags && annotation.tags.length
        ? annotation.tags.map(tag => (
            <span
              key={`annotation-${annotation.id}__tag-${tag.name}`}
              className="badge badge-light"
            >
              {tag.name}
              {"  "}
            </span>
          ))
        : ""}
    </div>
    <div className="main-annotation__action--bottom">
      <div />
      {children}
    </div>
  </div>
);

import "./AnnotationMain.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";
import Avatar from "react-avatar";

export default ({ annotation, path, children }) => (
  <div className="main-annotation__main">
    <div className="main-annotation__header">
      {annotation.owner && (
        <Avatar
          name={`${annotation.owner.first_name} ${annotation.owner.last_name}`}
          size={40}
        />
      )}
      <p>
        <span className={`main-annotation__review--${annotation.reviewed}`}>
          ({annotation.reviewed})
        </span>
        {"  "}
        submitted {moment(annotation.createdAt).fromNow()}
      </p>
    </div>
    <p className="main-annotation__quote">{annotation.quote}</p>
    <p className="main-annotation__comment">{annotation.comment}</p>
    <div className="main-annotation__action--bottom">
      <div />
      {children}
    </div>
  </div>
);

import "./AnnotationMain.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";

export default ({ annotation, path, children }) => (
  <div className="main-annotation__main">
    <div className="main-annotation__header">
      <p>{moment(annotation.createdAt).fromNow()}</p>
    </div>
    <p className="main-annotation__quote">{annotation.quote}</p>
    <p className="main-annotation__comment">{annotation.comment}</p>
    <div className="main-annotation__action--bottom">
      <div />
      {children}
    </div>
  </div>
);

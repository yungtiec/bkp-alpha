import "./AnnotationMain.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";

export default ({ annotation, path }) => (
  <div className="main-annotation__main">
    <div className="main-annotation__header">
      <p>{moment(annotation.createdAt).fromNow()}</p>
    </div>
    <p className="main-annotation__quote">{annotation.quote}</p>
    <p className="main-annotation__comment">{annotation.comment}</p>
    <div className="main-annotation__action--bottom">
      <a
        className="see-in-context"
        onClick={() =>
          history.push(
            `${path}/question/${annotation.survey_question_id}/annotation/${
              annotation.id
            }`
          )
        }
      >
        see in context
      </a>
    </div>
  </div>
);

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
    />
  ) : (
    "you"
  );

  return (
    <div className="reply-annotation__main">
      <p className="reply-annotation__quote">{annotation.quote}</p>
      <div className="reply-annotation__parent">
        <p className="reply-annotation__user">
          <span>
            <Avatar
              name={`${annotation.parent.owner.first_name} ${
                annotation.parent.owner.last_name
              }`}
              size={40}
            />
          </span>
          <span>{moment(annotation.parent.createdAt).fromNow()}</span>
        </p>
        <p className="reply-annotation__comment">{annotation.parent.comment}</p>
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

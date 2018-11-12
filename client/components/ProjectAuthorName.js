import "./ProjectAuthorName.scss";
import React from "react";
import moment from "moment";

export default ({ name, createdAt }) => (
  <p className="project-author__header">
    By {name} |{" "}
    <span className="project-published-date__header">
      Published {moment(createdAt).format("MM.DD.YYYY")}
    </span>
  </p>
);

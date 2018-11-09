import React from "react";

export default props => (
  <div
    className="markdown-body"
    dangerouslySetInnerHTML={{ __html: props.value }}
  />
);

import "./TagChip.scss";
import React from "react";

export default ({ tagValue, closeIconOnClick, containerClassname }) => (
  <div className={containerClassname}>
    <span className="close-icon" onClick={closeIconOnClick}>
      x
    </span>
    <span className="select-value-label">
      {tagValue}
      <span className="select-aria-only">&nbsp;</span>
    </span>
  </div>
);

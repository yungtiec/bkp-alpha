import "./ProfileBanner.scss";
import React from "react";
import Avatar from "react-avatar";

export default ({
  name,
  numAnnotations,
  numPageComments,
  numIssues,
  joinDate
}) => (
  <div className="profile-banner">
    <div className="container">
      <div className="profile-banner__avatar-container">
        <Avatar name={name} size={120} color="#2D4DD1" fgColor="#ffffff" />
      </div>
      <div className="profile-banner__short-bio">
        <h2>{name}</h2>
        <p>
          <span>{numAnnotations || 0} annotation(s)</span>
          <span className="divider">|</span>
          <span>{numPageComments || 0} comment(s)</span>
          <span className="divider">|</span>
          <span>{numIssues || 0} issue(s)</span>
          <span className="divider">|</span>
          <span>joined {joinDate}</span>
        </p>
      </div>
    </div>
  </div>
);

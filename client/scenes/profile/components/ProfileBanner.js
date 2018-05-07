import "./ProfileBanner.scss";
import React from "react";
import Avatar from "react-avatar";

export default ({
  name,
  numAnnotations,
  numProjectSurveyComments,
  numIssues,
  joinDate,
  isAdmin,
  restrictedAccess,
  restrictAccess,
  restoreAccess
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
          <span>{numProjectSurveyComments || 0} comment(s)</span>
          <span className="divider">|</span>
          <span>{numIssues || 0} issue(s)</span>
          <span className="divider">|</span>
          <span>joined {joinDate}</span>
        </p>
      </div>
      {isAdmin ? (
        <div className="profile-banner__access">
          {restrictedAccess ? (
            <button className="btn btn-primary" onClick={restoreAccess}>
              restore access
            </button>
          ) : (
            <button className="btn btn-danger" onClick={restrictAccess}>
              restrict access
            </button>
          )}
        </div>
      ) : null}
    </div>
  </div>
);

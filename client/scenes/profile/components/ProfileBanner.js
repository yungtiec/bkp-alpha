import "./ProfileBanner.scss";
import React from "react";
import Avatar from "react-avatar";

const getOfficialRoleName = name => {
  switch (name) {
    case "admin":
      return "admin";
    case "project_admin":
      return "document admin";
    case "project_editor":
      return "editor";
    default:
      return "contributor";
  }
};

export default ({
  name,
  numComments,
  numIssues,
  joinDate,
  isAdmin,
  restrictedAccess,
  managedProjects,
  editedProjects,
  role,
  restrictAccess,
  restoreAccess
}) => (
  <div className="profile-banner">
    <div className="container">
      <div className="profile-banner__avatar-container">
        <Avatar
          name={name.trim() ? name : "?"}
          size={120}
          color="#2D4DD1"
          fgColor="#ffffff"
        />
      </div>
      <div className="profile-banner__short-bio">
        <h2 className="profile-banner__name">{name}</h2>
        <p>
          <span>{getOfficialRoleName(role && role.name)}</span>
          <span className="divider">|</span>
          <span>{numComments || 0} comment(s)</span>
          <span className="divider">|</span>
          <span>{numIssues || 0} issue(s)</span>
          <span className="divider">|</span>
          <span>joined {joinDate}</span>
        </p>
        {managedProjects && managedProjects.length ? (
          <h6>
            manage documents for{" "}
            {managedProjects.map((mp, i) => (
              <h5>
                <span class="badge badge-secondary" key="`managed-project-${i}`">
                  {mp.name}
                </span>
              </h5>
            ))}
          </h6>
        ) : null}
        {editedProjects && editedProjects.length ? (
          <h6>
            edit documents for{" "}
            {editedProjects.map((ep, i) => (
              <h5>
                <span class="badge badge-secondary" key="`edited-project-${i}`">
                  {ep.name}
                </span>
              </h5>
            ))}
          </h6>
        ) : null}
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

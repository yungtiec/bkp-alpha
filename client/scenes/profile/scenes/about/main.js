import "./index.scss";
import React from "react";

export default about => {
  return (
    <div className="profile-subroute container">
      {about.restricted_access && (
        <div className="profile-about__restricted-access">
          <span className="badge badge-danger">Restricted Access</span>
          <p>
            Due to your recent activities, admin has revoke your comment privilege.
          </p>
        </div>
      )}
      <div className="profile-about__field">
        <span className="profile-about__field-label">First Name</span>
        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.first_name || ""}
            />
          </div>
        </div>
      </div>
      <div className="profile-about__field">
        <span className="profile-about__field-label">Last Name</span>

        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.last_name}
            />
          </div>
        </div>
      </div>
      <div className="profile-about__field">
        <span className="profile-about__field-label">Email</span>

        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.email || ""}
            />
          </div>
        </div>
      </div>
      <div className="profile-about__field">
        <span className="profile-about__field-label">Organization</span>
        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.organization || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

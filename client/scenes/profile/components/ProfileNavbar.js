import "./ProfileNavbar.scss";
import React from "react";
import { Link, withRouter } from "react-router-dom";

export default ({ url, activeTab }) => (
  <div className="profile-navbar">
    <ul className="profile-navbar__list">
      <Link to={`${url}/about`}>
        <li
          className={`profile-navbar__item ${
            activeTab === "about" ? "active" : ""
          }`}
        >
          About
        </li>
      </Link>
      <Link to={`${url}/annotations`}>
        <li className={`profile-navbar__item ${
            activeTab === "annotations" ? "active" : ""
          }`}>Annotations</li>
      </Link>
      <Link to={`${url}/replies`}>
        <li className={`profile-navbar__item ${
            activeTab === "replies" ? "active" : ""
          }`}>Replies</li>
      </Link>
    </ul>
  </div>
);

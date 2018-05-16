import "./Sidebar.scss";
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

const AdminListSidebar = () => (
  <div className="admin-list-navbar">
    <ul className="admin-list-navbar__list">
      <Link to="users">
        <li
          className={`admin-list-navbar__item ${
            window.location.pathname.includes("list/users") ? "active" : ""
          }`}
        >
          users
        </li>
      </Link>
      <Link to="project-surveys">
        <li
          className={`admin-list-navbar__item ${
            window.location.pathname.includes("list/project-surveys")
              ? "active"
              : ""
          }`}
        >
          disclosures
        </li>
      </Link>
    </ul>
  </div>
);

export default withRouter(AdminListSidebar);

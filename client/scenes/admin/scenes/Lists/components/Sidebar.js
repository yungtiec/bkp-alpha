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
      <Link to="version">
        <li
          className={`admin-list-navbar__item ${
            window.location.pathname.includes("list/version")
              ? "active"
              : ""
          }`}
        >
          documents
        </li>
      </Link>
    </ul>
  </div>
);

export default withRouter(AdminListSidebar);

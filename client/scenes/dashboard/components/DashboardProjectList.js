import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export default ({ projectSymbolArr, projectsBySymbol }) => (
  <div className="d-flex flex-column mt-3">
    <p className="dashboard-section__title mb-2 pb-3 pl-1">Projects</p>
    {projectSymbolArr && projectSymbolArr.length ? (
      projectSymbolArr.map(s => (
        <div
          key={`dashboard-project-listing__${s}`}
          className="dashboard-listing__item text-uppercase py-2 pl-1"
        >
          <Link to={`/project/${s}`}>{projectsBySymbol[s].name}</Link>
        </div>
      ))
    ) : (
      <div>currently has no project available</div>
    )}
  </div>
);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export default ({ surveyIds, surveysById }) => {
  return (
    <div className="d-flex flex-column">
      <p className="dashboard-listing__title mb-2 pb-3 pl-1">Documents</p>
      {surveyIds && surveyIds.length ? (
        surveyIds.map(id => (
          <div
            key={`dashboard-survey-listing__${id}`}
            className="dashboard-listing__item py-2 pl-1"
          >
            <Link
              to={`/project/${surveysById[id].project.symbol}/survey/${
                surveysById[id].project_surveys[0].id
              }`}
              className="d-flex align-items-start"
            >
              <p className="mb-0">{surveysById[id].project.symbol}</p>
              <p className="ml-3 mb-0">{surveysById[id].title}</p>
            </Link>
          </div>
        ))
      ) : (
        <div>currently has no document available</div>
      )}
    </div>
  );
};

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export default ({ projectSurveyIds, projectSurveysById }) => {
  return (
    <div className="d-flex flex-column">
      <p className="dashboard-section__title mb-2 pb-3 pl-1">Documents</p>
      {projectSurveyIds && projectSurveyIds.length ? (
        projectSurveyIds.map(id => (
          <div
            key={`dashboard-survey-listing__${id}`}
            className="dashboard-listing__item py-2 pl-1"
          >
            <Link
              to={`/project/${projectSurveysById[id].project.symbol}/survey${
                projectSurveysById[id].descendents &&
                projectSurveysById[id].descendents.length
                  ? projectSurveysById[id].descendents[0].id
                  : projectSurveysById[id].id
              }`}
              className="d-flex align-items-start"
            >
              <p className="mb-0">{projectSurveysById[id].project.symbol}</p>
              <p className="ml-3 mb-0">{projectSurveysById[id].survey.title}</p>
            </Link>
          </div>
        ))
      ) : (
        <div>currently has no documents available</div>
      )}
    </div>
  );
};

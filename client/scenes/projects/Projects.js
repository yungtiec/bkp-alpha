import "./Projects.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListSurvey } from "../../components";

export default ({
  projectsBySymbol,
  projectSymbolArr,
  surveysById,
  surveyIds
}) => (
  <div className="main-container">
    <span className="projects-container__sub-header">Recent Documents</span>
    <ListSurvey surveyIds={surveyIds} surveysById={surveysById} />
    {projectSymbolArr && projectSymbolArr.length ? (
      <span className="projects-container__sub-header">Categories</span>
    ) : null}
    <ListProject
      projectSymbolArr={projectSymbolArr}
      projectsBySymbol={projectsBySymbol}
    />
  </div>
);

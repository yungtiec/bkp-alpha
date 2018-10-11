import "./Documents.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListDocument } from "../../components";

export default ({
  projectsBySymbol,
  projectSymbolArr,
  documentsById,
  documentIds
}) => (
  <div className="main-container">
    <span className="projects-container__sub-header">Recent Documents</span>
    <ListDocument documentIds={documentIds} documentsById={documentsById} />
  </div>
);

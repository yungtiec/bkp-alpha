import React, { Component } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import moment from "moment";
import { ProjectBanner } from "./components";
import { ListDocument } from "../../components";

const ProjectIndex = props => {
  const { documentsById, documentIds, metadata } = props;
  return (
    <div className="main-container">
      <div className="documents-container">
        <ProjectBanner metadata={metadata} />
        <span className="documents-container__sub-header">
          {documentIds.length
            ? "Browse disclosures"
            : `${metadata.name} currently has no disclosure document`}
        </span>
        <ListDocument documentIds={documentIds} documentsById={documentsById} />
      </div>
    </div>
  );
};

export default withRouter(ProjectIndex);

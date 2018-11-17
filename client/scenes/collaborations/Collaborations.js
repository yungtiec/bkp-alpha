import "./Collaborations.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListDocumentGrid } from "../../components";
import { Helmet } from "react-helmet";

const documentTypes = {
  general: 'general',
  scorecard: 'scorecard',
  regulatory: 'regulatory'
};

const filterDocuments = (documentIds, documentsById) => {
  let scorecardsById = [];
  let scorecardIds = [];
  let thoughtLeadershipById = [];
  let thoughtLeadershipIds = [];
  let regulatoryById = [];
  let regulatoryIds = [];

  for (let id in documentIds) {
    const docId = documentIds[id];
    const document = documentsById[docId];
    const documentObj = {};
    documentObj[docId] = document;
    if (document.document_type === documentTypes.scorecard) {
      scorecardIds = [].concat(scorecardIds).concat([docId]);
      scorecardsById = Object.assign({}, scorecardsById, documentObj);
    } else if (document.document_type === documentTypes.regulatory) {
      console.log(document);
      regulatoryIds = [].concat(regulatoryIds).concat([docId]);
      regulatoryById = Object.assign(
        {},
        regulatoryById,
        documentObj
      );
    } else {
      thoughtLeadershipIds = [].concat(thoughtLeadershipIds).concat([docId]);
      thoughtLeadershipById = Object.assign(
        {},
        thoughtLeadershipById,
        documentObj
      );
    }
  }

  return {
    scorecardsById,
    scorecardIds,
    thoughtLeadershipById,
    thoughtLeadershipIds,
    regulatoryById,
    regulatoryIds
  };
};

export default ({
  projectsBySymbol,
  projectSymbolArr,
  documentsById,
  documentIds,
  loadModal,
  hideModal,
  notify
}) => {
  const {
    scorecardsById,
    scorecardIds,
    thoughtLeadershipById,
    thoughtLeadershipIds,
    regulatoryById,
    regulatoryIds
  } = filterDocuments(documentIds, documentsById);
  
  return (
    <div>
      <Helmet>
        <title>The Brooklyn Project | Collaborate</title>
      </Helmet>
      <div className="main-container-collaborations">
        <div className="collaborations-container col-md-7">
          <div className="projects-containers__collaboration-header">
            <span className="collaborations-header">Open Collaborations</span>
          </div>
          <div className="project-row">
            <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
              <div>Regulatory Guidance</div>
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  loadModal("COLLABORATION_PROPOSAL_MODAL", {
                    hideModal,
                    notify
                  })
                }
              >
                Propose collaboration
              </button>
            </div>
            <ListDocumentGrid
              documentIds={regulatoryIds}
              documentsById={regulatoryById}
            />
          </div>
          <div>
            <span className="projects-containers__collaboration-sub-header d-flex justify-content-between">
              Thought Leadership
            </span>
            <ListDocumentGrid
              documentIds={thoughtLeadershipIds}
              documentsById={thoughtLeadershipById}
            />
          </div>
          <div>
            <span className="projects-containers__collaboration-sub-header d-flex justify-content-between">
              Transparency Scorecards
            </span>
            <ListDocumentGrid
              documentIds={scorecardIds}
              documentsById={scorecardsById}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

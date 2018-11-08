import "./Collaborations.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListDocumentGrid } from "../../components";
import { Helmet } from "react-helmet";

const filterDocuments = (documentIds, documentsById) => {
  let scorecardsById = [];
  let scorecardIds = [];
  let thoughtLeadershipById = [];
  let thoughtLeadershipIds = [];

  for (let id in documentIds) {
    const docId = documentIds[id];
    const document = documentsById[docId];
    const documentObj = {};
    documentObj[docId] = document;
    if (document.title.includes("Scorecard")) {
      scorecardIds = [].concat(scorecardIds).concat([docId]);
      scorecardsById = Object.assign({}, scorecardsById, documentObj);
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
    thoughtLeadershipIds
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
    thoughtLeadershipIds
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
              <div>Thought Leadership</div>
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
              documentIds={thoughtLeadershipIds}
              documentsById={thoughtLeadershipById}
            />
          </div>
          <div>
            <span className="projects-containers__collaboration-sub-header">
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

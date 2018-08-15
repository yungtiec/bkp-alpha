import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export default ({ documentIds, documentsById }) => {
  return (
    <div className="d-flex flex-column">
      <p className="dashboard-listing__title mb-2 pb-3 pl-1">Documents</p>
      {documentIds && documentIds.length ? (
        documentIds.map(id => (
          <div
            key={`dashboard-document-listing__${id}`}
            className="dashboard-listing__item py-2 pl-1"
          >
            <Link
              to={`/project/${documentsById[id].project.symbol}/document/${
                documentsById[id].versions[0].id
              }`}
              className="d-flex align-items-start"
            >
              <p className="mb-0">{documentsById[id].project.symbol}</p>
              <p className="ml-3 mb-0">{documentsById[id].title}</p>
            </Link>
          </div>
        ))
      ) : (
        <div>currently has no document available</div>
      )}
    </div>
  );
};

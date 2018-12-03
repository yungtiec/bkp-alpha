import "./AdminDocumentList.scss";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  requiresAuthorization,
  StackableTable
} from "../../../../../../components";
import history from "../../../../../../history";
import { maxBy } from "lodash";

const AdminDocumentList = ({ documentIds, documentsById }) => {
  const columns = [
    { Header: "disclosure", accessor: "id", fixed: true, width: 110 },
    {
      id: "project",
      Header: "project",
      width: 180,
      accessor: d => `${d.project.name} (${d.project.symbol})`
    },
    { Header: "title", accessor: "title", minWidth: 150 },
    { Header: "issues", accessor: "num_issues", width: 80 },
    { Header: "pending comments", accessor: "num_pending_comments" }
  ];
  const data = documentIds.map(id => documentsById[id]);

  return (
    <div className="project-document-list__container  main-container">
      <StackableTable
        columns={columns}
        data={data}
        defaultPageSize={10}
        getTrProps={(state, rowInfo, column, instance) => {
          console.log(rowInfo);
          return {
            onClick: (e, t) => {
              history.push(
                `/s/${rowInfo.original.versions[0].version_slug}`
              );
            }
          };
        }}
      />
    </div>
  );
};

export default withRouter(
  requiresAuthorization({
    Component: AdminDocumentList,
    roleRequired: ["admin"]
  })
);

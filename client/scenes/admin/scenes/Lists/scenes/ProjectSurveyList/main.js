import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import {
  requiresAuthorization,
  StackableTable
} from "../../../../../../components";
import history from "../../../../../../history";

class AdminSurveyList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { surveyIds, surveysById } = this.props;
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
    const data = surveyIds.map(id => surveysById[id]);

    return (
      <div className="project-survey-list__container  main-container">
        <StackableTable
          columns={columns}
          data={data}
          defaultPageSize={10}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, t) => {
                // history.push(`/admin/project-survey/${rowInfo.row.id}`);
                history.push(
                  `/project/${rowInfo.original.project.id}/survey/${
                    rowInfo.original.latest_project_survey.id
                  }`
                );
              }
            };
          }}
        />
      </div>
    );
  }
}

export default withRouter(
  requiresAuthorization({
    Component: AdminSurveyList,
    roleRequired: ["admin"]
  })
);

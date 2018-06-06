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

class AdminProjectSurveyList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { projectSurveyIds, projectSurveysById } = this.props;
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
      { Header: "pending annotations", accessor: "num_pending_annotations" }
    ];
    const data = projectSurveyIds.map(id => projectSurveysById[id]);

    return (
      <div className="project-survey-list__container  main-container">
        <StackableTable
          columns={columns}
          data={data}
          defaultPageSize={10}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, t) => {
                history.push(`/admin/project-survey/${rowInfo.row.id}`);
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
    Component: AdminProjectSurveyList,
    roleRequired: "admin"
  })
);

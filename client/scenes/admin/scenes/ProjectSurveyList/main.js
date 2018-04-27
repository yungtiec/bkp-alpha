import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import { requiresAuthorization, StackableTable } from "../../../../components";
import history from "../../../../history";

class AdminProjectSurveyPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { projectSurveyIds, projectSurveysById } = this.props;
    const columns = [
      {
        id: "project",
        Header: "project",
        width: 180,
        accessor: d => `${d.project.name} (${d.project.symbol})`,
        fixed: true
      },
      { Header: "survey", accessor: "id", fixed: true, width: 80 },
      { Header: "title", accessor: "title", minWidth: 150 },
      { Header: "issues", accessor: "num_issues", width: 80 },
      { Header: "pending annotations", accessor: "num_pending_annotations" },
      { Header: "pending comments", accessor: "num_pending_page_comments" }
    ];
    const data = projectSurveyIds.map(id => projectSurveysById[id]);

    return (
      <div className="container project-survey-list__container">
        <StackableTable
          columns={columns}
          data={data}
          defaultPageSize={10}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, t) => {
                history.push(`project-survey/${rowInfo.row.id}`);
              }
            };
          }}
        />
      </div>
    );
  }
}

export default withRouter(
  requiresAuthorization(AdminProjectSurveyPanel, "admin")
);

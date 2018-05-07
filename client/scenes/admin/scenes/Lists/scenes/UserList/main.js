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

class AdminUserList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { userIds, usersById } = this.props;
    const columns = [
      { Header: "user", accessor: "email", fixed: true, width: 200 },
      { Header: "spam", accessor: "num_spam" },
      {
        id: "contributions",
        Header: "contributions",
        accessor: d => d.num_annotations + d.num_project_survey_comments
      },
      { Header: "issues open", accessor: "num_issues" },
      { Header: "id", accessor: "id", show: false }
    ];
    const data = userIds.map(id => usersById[id]);

    return (
      <div className="user-list__container  main-container">
        <StackableTable
          columns={columns}
          data={data}
          defaultPageSize={10}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, t) => {
                history.push(`/user/${rowInfo.row.id}/about`);
              }
            };
          }}
        />
      </div>
    );
  }
}

export default withRouter(requiresAuthorization(AdminUserList, "admin"));

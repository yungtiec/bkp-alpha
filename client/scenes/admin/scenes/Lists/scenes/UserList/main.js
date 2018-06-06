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
import { changeAccessStatus } from "./data/actions";

class AdminUserList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  restrictAccess(userId) {
    this.props.changeAccessStatus({
      userId: userId,
      accessStatus: "restricted"
    });
  }

  restoreAccess(userId) {
    this.props.changeAccessStatus({
      userId: userId,
      accessStatus: "restore"
    });
  }

  render() {
    const { userIds, usersById } = this.props;
    const columns = [
      { Header: "user", accessor: "email", fixed: true, width: 270 },
      { Header: "spam", accessor: "num_spam" },
      {
        id: "annotations",
        Header: "annotations",
        accessor: "num_annotations"
      },
      {
        id: "upvotes",
        Header: "upvotes",
        accessor: "num_upvotes"
      },
      { Header: "issues open", accessor: "num_issues" },
      { Header: "id", accessor: "id", show: false },
      {
        Header: "access",
        accessor: "restricted_access",
        Cell: rowInfo => {
          return rowInfo.row.restricted_access ? (
            <button className="btn btn-outline-primary">restore access</button>
          ) : (
            <button className="btn btn-outline-danger">restrict access</button>
          );
        }
      }
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
              onClick: (e, handleOriginal) => {
                if (e.target.className.indexOf("btn") === -1)
                  history.push(`/user/${rowInfo.row.id}/about`);
                else {
                  if (rowInfo.row.restricted_access) {
                    this.restoreAccess(rowInfo.row.id);
                  } else {
                    this.restrictAccess(rowInfo.row.id);
                  }
                }
              }
            };
          }}
        />
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return ownProps;
};

const actions = {
  changeAccessStatus
};

export default withRouter(
  connect(mapState, actions)(
    requiresAuthorization({
      Component: AdminUserList,
      roleRequired: "admin"
    })
  )
);

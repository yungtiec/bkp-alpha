import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import { StackableTable } from "../../components";
import history from "../../history";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { userIds, usersById } = this.props;
    const columns = [
      {
        id: "user",
        Header: "user",
        accessor: "displayName"
      },
      {
        id: "upvotes",
        Header: "upvotes received",
        accessor: "num_upvotes"
      },
      { Header: "id", accessor: "id", show: false }
    ];
    const data = userIds.map(id => usersById[id]);

    return (
      <div className="leaderboard__container  main-container">
        <div className="leaderboard__title">leaderboard</div>
        <StackableTable columns={columns} data={data} defaultPageSize={10} />
      </div>
    );
  }
}

export default withRouter(Leaderboard);

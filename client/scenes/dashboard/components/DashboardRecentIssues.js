import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getResponsibleIssues } from "../data/reducer";
import { fetchResponsibleIssues } from "../data/actions";
import { CardIssue } from "./index";
import { ListView } from "../../../components";

class DashboardRecentIssues extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchResponsibleIssues();
  }

  render() {
    if (!this.props.issueIds || !this.props.issuesById) return "loading";
    return (
      <div class="dashboard__recent-issues ml-5">
        <p className="dashboard__recent-issues-title pl-1">Recent Issues</p>
        <ListView
          viewClassName={"row entity-cards"}
          rowClassName={"col-md-12 entity-card__container"}
          rowsIdArray={this.props.issueIds}
          rowsById={this.props.issuesById}
          renderRow={CardIssue}
        />
      </div>
    );
  }
}

const mapState = state => {
  const { issuesById, issueIds } = getResponsibleIssues(state);
  return {
    issuesById,
    issueIds
  };
};

const actions = { fetchResponsibleIssues };

export default connect(mapState, actions)(DashboardRecentIssues);

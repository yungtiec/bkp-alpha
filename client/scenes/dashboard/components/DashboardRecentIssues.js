import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getResponsibleIssues, canLoadMore } from "../data/reducer";
import { fetchResponsibleIssues } from "../data/actions";
import { CardIssue } from "./index";
import { ListView } from "../../../components";
import { ScaleLoader } from "halogenium";

class DashboardRecentIssues extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchResponsibleIssues();
  }

  render() {
    return (
      <div class="dashboard__recent-issues ml-5">
        <p className="dashboard__recent-issues-title pl-1">Recent Issues</p>
        {!this.props.issueIds || !this.props.issuesById ? (
          <div className="component__loader-container d-flex">
            <ScaleLoader
              className="component__loader"
              color="#2d4dd1"
              size="16px"
              margin="4px"
            />
          </div>
        ) : this.props.issueIds && !this.props.issueIds.length ? (
          <div className="component__loader-container d-flex">
            currently has no issue available
          </div>
        ) : (
          <ListView
            viewClassName="row entity-cards"
            rowClassName="col-md-12 entity-card__container  d-flex flex-column"
            rowsIdArray={this.props.issueIds}
            rowsById={this.props.issuesById}
            renderRow={CardIssue}
          />
        )}
        {this.props.canLoadMore ? (
          <a
            className="dashboard__show-more"
            onClick={this.props.fetchResponsibleIssues}
          >
            <p>show more</p>
          </a>
        ) : null}
      </div>
    );
  }
}

const mapState = state => {
  const { issuesById, issueIds } = getResponsibleIssues(state);
  return {
    issuesById,
    issueIds,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchResponsibleIssues };

export default connect(mapState, actions)(DashboardRecentIssues);

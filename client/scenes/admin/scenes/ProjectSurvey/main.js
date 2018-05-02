import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import {
  fetchEngagementItems,
  verifyPendingEngagementItem,
  changeEngagementItemIssueStatus
} from "./data/engagementItems/actions";
import { Sidebar } from "./components";
import {
  requiresAuthorization,
  AnnotationMain,
  AnnotationReply
} from "../../../../components";
import history from "../../../../history";
import asyncPoll from "react-async-poll";

const onPollInterval = (props, dispatch) => {
  return props.fetchEngagementItems(props.match.params.projectSurveyId);
};

class AdminProjectSurveyPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  labelAsNotSpam(engagementItem) {
    this.props.verifyPendingEngagementItem(engagementItem, "verified");
  }

  labelAsSpam(engagementItem) {
    this.props.verifyPendingEngagementItem(engagementItem, "spam");
  }

  renderActions(engagementItem, path) {
    return (
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => this.labelAsSpam(engagementItem)}
        >
          spam
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => this.labelAsNotSpam(engagementItem)}
        >
          verify
        </button>
        {engagementItem.issue ? (
          engagementItem.issue.open ? (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() =>
                this.props.changeEngagementItemIssueStatus(engagementItem)
              }
            >
              close issue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() =>
                this.props.changeEngagementItemIssueStatus(engagementItem)
              }
            >
              re-open issue
            </button>
          )
        ) : null}
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={engagementItem.reviewed === "spam"}
          onClick={() =>
            history.push(
              engagementItem.engagementItemType === "annotation"
                ? engagementItem.hierarchyLevel === 1
                  ? `${path}/question/${
                      engagementItem.survey_question_id
                    }/annotation/${engagementItem.id}`
                  : `${path}/question/${
                      engagementItem.survey_question_id
                    }/annotation/${engagementItem.ancestors[0].id}`
                : `${path}/page-comments`
            )
          }
        >
          see in context
        </button>
      </div>
    );
  }

  render() {
    const {
      engagementItemsById,
      engagementItemIds,
      changeEngagementItemIssueStatus
    } = this.props;

    return (
      <div className="admin-project-survey-panel">
        <Sidebar />
        <div class="admin-project-survey-panel__item-container">
          {engagementItemIds.map(aid => {
            const path =
              engagementItemsById[aid].engagementItemType === "annotation"
                ? engagementItemsById[aid].hierarchyLevel === 1
                  ? engagementItemsById[aid].uri.replace(
                      window.location.origin,
                      ""
                    )
                  : engagementItemsById[aid].ancestors[0].uri.replace(
                      window.location.origin,
                      ""
                    )
                : `/project/${
                    engagementItemsById[aid].project_survey.project.symbol
                  }/survey/${engagementItemsById[aid].project_survey_id}`;

            return engagementItemsById[aid].parentId ? (
              <AnnotationReply
                key={`admin__annotation-reply--${aid}`}
                annotation={engagementItemsById[aid]}
              >
                {this.renderActions(engagementItemsById[aid], path)}
              </AnnotationReply>
            ) : (
              <AnnotationMain
                key={`admin__annotation-main--${aid}`}
                annotation={engagementItemsById[aid]}
              >
                {this.renderActions(engagementItemsById[aid], path)}
              </AnnotationMain>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { engagementItemsById, engagementItemIds } = ownProps;
  return {
    engagementItemsById,
    engagementItemIds
  };
};

const actions = {
  fetchEngagementItems,
  verifyPendingEngagementItem,
  changeEngagementItemIssueStatus
};

export default withRouter(
  connect(mapState, actions)(
    asyncPoll(60 * 1000, onPollInterval)(
      requiresAuthorization(AdminProjectSurveyPanel, "admin")
    )
  )
);

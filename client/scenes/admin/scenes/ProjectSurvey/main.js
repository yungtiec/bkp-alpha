import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import autoBind from "react-autobind";
import {
  fetchComments,
  verifyPendingComment,
  changeCommentIssueStatus
} from "./data/comments/actions";
import {
  AdminProjectSurveySidebar,
  AdminProjectSurveyActionBar
} from "./components";
import {
  requiresAuthorization,
  CommentMain,
  CommentReply
} from "../../../../components";
import history from "../../../../history";
import asyncPoll from "react-async-poll";
import { seeCommentContext } from "../../../../utils";

const onPollInterval = (props, dispatch) => {
  return props.fetchComments(props.match.params.projectSurveyId);
};

class AdminProjectSurveyPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  labelAsNotSpam(comment) {
    this.props.verifyPendingComment(comment, "verified");
  }

  labelAsSpam(comment) {
    this.props.verifyPendingComment(comment, "spam");
  }

  renderActions(comment) {
    return (
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => this.labelAsSpam(comment)}
        >
          spam
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => this.labelAsNotSpam(comment)}
        >
          verify
        </button>
        {comment.issue ? (
          comment.issue.open ? (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => this.props.changeCommentIssueStatus(comment)}
            >
              close issue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => this.props.changeCommentIssueStatus(comment)}
            >
              re-open issue
            </button>
          )
        ) : comment.hierarchyLevel === 1 ? (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => this.props.changeCommentIssueStatus(comment)}
          >
            open issue
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={comment.reviewed === "spam"}
          onClick={() => seeCommentContext(comment)}
        >
          see in context
        </button>
      </div>
    );
  }

  render() {
    const { commentsById, commentIds, changeCommentIssueStatus } = this.props;
    return (
      <div className="admin-project-survey-panel  main-container">
        <Link to="/admin/list/project-surveys">back to survey list</Link>
        <div className="admin-project-survey-panel__content">
          <AdminProjectSurveySidebar />
          <div class="admin-project-survey-panel__item-container">
            {commentIds.map(aid => {
              return commentsById[aid].parentId ? (
                <CommentReply
                  key={`admin__comment-reply--${aid}`}
                  comment={commentsById[aid]}
                >
                  <AdminProjectSurveyActionBar
                    labelAsSpam={this.labelAsSpam}
                    labelAsNotSpam={this.labelAsNotSpam}
                    changeCommentIssueStatus={changeCommentIssueStatus}
                    seeCommentContext={seeCommentContext}
                    comment={commentsById[aid]}
                  />
                </CommentReply>
              ) : (
                <CommentMain
                  key={`admin__comment-main--${aid}`}
                  comment={commentsById[aid]}
                >
                  <AdminProjectSurveyActionBar
                    labelAsSpam={this.labelAsSpam}
                    labelAsNotSpam={this.labelAsNotSpam}
                    changeCommentIssueStatus={changeCommentIssueStatus}
                    seeCommentContext={seeCommentContext}
                    comment={commentsById[aid]}
                  />
                </CommentMain>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { commentsById, commentIds } = ownProps;
  return {
    commentsById,
    commentIds
  };
};

const actions = {
  fetchComments,
  verifyPendingComment,
  changeCommentIssueStatus
};

export default withRouter(
  connect(mapState, actions)(
    asyncPoll(60 * 1000, onPollInterval)(
      requiresAuthorization({
        Component: AdminProjectSurveyPanel,
        roleRequired: ["admin"]
      })
    )
  )
);

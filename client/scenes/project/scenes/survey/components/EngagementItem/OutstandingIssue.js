import "./EngagementItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";

export default class OutstandingIssue extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showReplies: false
    };
  }

  render() {
    const {
      engagementItem,
      resolvedIssueIds,
      selectIssueToResolve
    } = this.props;

    return (
      <div
        className="engagement-item"
        style={{ cursor: "pointer" }}
        onClick={() => selectIssueToResolve(engagementItem.issue.id)}
      >
        {this.renderMainComment(engagementItem, resolvedIssueIds)}
        {this.state.showReplies && (
          <p
            className="mb-3 engagement-item__collapse-btn"
            onClick={this.toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {engagementItem.descendents.length < 3 || this.state.showReplies ? (
          <div className="ml-3">
            {this.renderReplies(engagementItem.descendents, engagementItem.id)}
          </div>
        ) : (
          <p onClick={this.toggleShowReplies}>
            + View {engagementItem.descendents.length} replies
          </p>
        )}
      </div>
    );
  }

  promptLoginToast() {
    this.props.notify({
      title: "",
      message: "Login required",
      status: "error",
      dismissible: true,
      dismissAfter: 3000
    });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  renderMainComment(engagementItem, resolvedIssueIds) {
    return (
      <div className="engagement-item__main">
        <div className="engagement-item__header">
          <p>
            {engagementItem.owner.first_name +
              " " +
              engagementItem.owner.last_name}
          </p>
          <p>
            {moment(engagementItem.createdAt).fromNow()}
            {resolvedIssueIds.indexOf(engagementItem.issue.id) !== -1 ? (
              <i className="ml-2 fas fa-check-circle text-right" />
            ) : null}
          </p>
        </div>
        {engagementItem.engagementItemType === "annotation" && (
          <p className="engagement-item__quote">{engagementItem.quote}</p>
        )}
        <div className="engagement-item__tags">
          {engagementItem.tags && engagementItem.tags.length
            ? engagementItem.tags.map(tag => (
                <span
                  key={`engagement-${engagementItem.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
        <p className="engagement-item__comment">{engagementItem.comment}</p>
      </div>
    );
  }

  renderReplies(replies, rootId) {
    return orderBy(
      replies.map(
        reply =>
          isEmpty(reply)
            ? reply
            : assignIn({ unix: moment(reply.createdAt).format("X") }, reply)
      ),
      ["unix", "upvotesFrom.length"],
      ["asc", "desc"]
    ).map(reply => {
      if (reply.reviewed === "spam") return null;
      return (
        <div
          className="engagement-item__reply-item"
          key={`engagement-item__reply-${reply.id}`}
        >
          <div className="engagement-item__header">
            <p>{reply.owner.first_name + " " + reply.owner.last_name}</p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="engagement-item__comment">[deleted]</p>
          ) : (
            <p className="engagement-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="engagement-item__at-someone">
                  {"@" +
                    reply.parent.owner.first_name +
                    " " +
                    reply.parent.owner.last_name}
                </span>
              )}{" "}
              {reply.comment}
            </p>
          )}
        </div>
      );
    });
  }
}

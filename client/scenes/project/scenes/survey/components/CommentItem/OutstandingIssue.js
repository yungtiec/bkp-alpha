import "./CommentItem.scss";
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
    const { comment, resolvedIssueIds, selectIssueToResolve } = this.props;

    return (
      <div
        className="comment-item"
        style={{ cursor: "pointer" }}
        onClick={() => selectIssueToResolve(comment.issue.id)}
      >
        {this.renderMainComment(comment, resolvedIssueIds)}
        {this.state.showReplies && (
          <p
            className="mb-3 comment-item__collapse-btn"
            onClick={this.toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {comment.descendents.length < 3 || this.state.showReplies ? (
          <div className="ml-3">
            {this.renderReplies(comment.descendents, comment.id)}
          </div>
        ) : (
          <p onClick={this.toggleShowReplies}>
            + View {comment.descendents.length} replies
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

  renderMainComment(comment, resolvedIssueIds) {
    return (
      <div
        className="comment-item__main"
        style={comment.descendents.length ? { borderBottom: "1px solid" } : {}}
      >
        <div className="comment-item__header">
          <p>{comment.owner.first_name + " " + comment.owner.last_name}</p>
          <p>
            {moment(comment.createdAt).fromNow()}
            {resolvedIssueIds.indexOf(comment.issue.id) !== -1 ? (
              <i className="ml-2 fas fa-check-circle text-right" />
            ) : null}
          </p>
        </div>
        {comment.quote && (
          <p className="comment-item__quote">{comment.quote}</p>
        )}
        <div className="comment-item__tags">
          {comment.tags && comment.tags.length
            ? comment.tags.map(tag => (
                <span
                  key={`comment-${comment.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
        <p className="comment-item__comment">{comment.comment}</p>
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
    ).map((reply, i) => {
      if (reply.reviewed === "spam") return null;
      return (
        <div
          className={`comment-item__reply-item ${
            i === replies.length - 1 ? "last-item" : ""
          }`}
          key={`comment-item__reply-${reply.id}`}
        >
          <div className="comment-item__header">
            <p>{reply.owner.first_name + " " + reply.owner.last_name}</p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="comment-item__comment">[deleted]</p>
          ) : (
            <p className="comment-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="comment-item__at-someone">
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

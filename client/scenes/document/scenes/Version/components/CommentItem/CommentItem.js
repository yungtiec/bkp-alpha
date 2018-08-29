import "./CommentItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";
import ActionableIssueTag from "./ActionableIssueTag";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isCommenting: false,
      replyTarget: null,
      showReplies: false
    };
  }

  render() {
    const { comment, user, projectMetadata } = this.props;

    return (
      <PunditContainer policies={policies} user={user}>
        <PunditTypeSet type="Comment">
          <VisibleIf
            action="Read"
            model={{ project: projectMetadata, comment }}
          >
            <div className="comment-item">
              {this.renderMainComment()}
              {this.state.showReplies && (
                <p
                  className="my-3 comment-item__collapse-btn"
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
                <p className="my-3" onClick={this.toggleShowReplies}>
                  + View{" "}
                  {
                    comment.descendents.filter(c => c.reviewed !== "spam")
                      .length
                  }{" "}
                  replies
                </p>
              )}
              {this.state.isCommenting ? (
                <div>
                  {this.state.replyTarget && (
                    <span className="ml-1">{`replying to ${
                      this.state.replyTarget.owner.displayName
                    }`}</span>
                  )}
                  <CommentBox
                    rootId={comment.id}
                    parentId={
                      this.state.replyTarget
                        ? this.state.replyTarget.id
                        : comment.id
                    }
                    versionId={comment.version_id}
                    onSubmit={this.props.replyToItem}
                    onCancel={this.hideCommentBox}
                  />
                </div>
              ) : null}
            </div>
          </VisibleIf>
        </PunditTypeSet>
      </PunditContainer>
    );
  }

  initReply(replyTarget) {
    this.setState({
      isCommenting: true,
      replyTarget
    });
  }

  hideCommentBox(accessors, parent) {
    this.setState({
      isCommenting: false,
      parentId: null
    });
  }

  openModal(comment, showIssueCheckbox, showTags) {
    this.props.loadModal("EDIT_COMMENT_MODAL", {
      ...comment,
      showIssueCheckbox,
      showTags,
      editItem: this.props.editItem
    });
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

  labelAsNotSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({
      comment,
      rootId,
      reviewed: comment.reviewed === "verified" ? "pending" : "verified"
    });
  }

  labelAsSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({
      comment,
      rootId,
      reviewed: comment.reviewed === "spam" ? "pending" : "spam"
    });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  renderMainComment() {
    const { comment, user, projectMetadata } = this.props;
    const hasUpvoted = find(
      comment.upvotesFrom,
      upvotedUser => upvotedUser.id === this.props.user.id
    );
    const initReplyToThis = this.props.isLoggedIn
      ? this.initReply.bind(this, null)
      : this.promptLoginToast;
    const upvoteItem = this.props.isLoggedIn
      ? this.props.upvoteItem.bind(this, {
          rootId: null,
          comment,
          hasUpvoted
        })
      : this.promptLoginToast;
    const openModal = this.openModal.bind(null, comment, true, true);
    const changeItemIssueStatus = this.props.changeItemIssueStatus.bind(
      null,
      comment
    );
    return (
      <div
        className="comment-item__main"
        style={comment.descendents.length ? { borderBottom: "1px solid" } : {}}
      >
        <div className="comment-item__header">
          <p className="comment-item__owner-name d-flex flex-direction-column">
            <PunditContainer policies={policies} user={comment.owner}>
              <PunditTypeSet type="Comment">
                <VisibleIf
                  action="isProjectAdmin"
                  model={{ project: projectMetadata, comment }}
                >
                  <span class="text-primary">
                    <i class="text-primary mr-2 fas fa-certificate" />
                    {`${comment.owner.displayName} (from ${
                      projectMetadata.symbol
                    })`}
                  </span>
                </VisibleIf>
              </PunditTypeSet>
            </PunditContainer>
            <PunditContainer policies={policies} user={comment.owner}>
              <PunditTypeSet type="Comment">
                <VisibleIf
                  action="isNotProjectAdmin"
                  model={{ project: projectMetadata, comment }}
                >
                  <span>{comment.owner.displayName}</span>
                </VisibleIf>
              </PunditTypeSet>
            </PunditContainer>
          </p>
          <p>{moment(comment.createdAt).fromNow()}</p>
        </div>
        {comment.quote && (
          <p className="comment-item__quote">{comment.quote}</p>
        )}
        {(comment.tags && comment.tags.length) || comment.issue ? (
          <div className="comment-item__tags">
            <ActionableIssueTag
              comment={comment}
              changeItemIssueStatus={changeItemIssueStatus}
            />
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
        ) : null}
        <p className="comment-item__comment">{comment.comment}</p>
        {comment.issue && comment.issue.resolvingVersion ? (
          <span className="comment-item__issue-resolved">
            <Link
              to={`/project/${
                comment.issue.resolvingVersion.document.project.symbol
              }/document/${comment.issue.resolvingVersion.id}`}
            >{`issue resolved in document v${
              comment.issue.resolvingVersion.hierarchyLevel
            }`}</Link>
          </span>
        ) : null}
        <ActionBar
          item={comment}
          isClosedForComment={this.props.isClosedForComment}
          projectMetadata={projectMetadata}
          user={user}
          hasUpvoted={hasUpvoted}
          initReplyToThis={initReplyToThis}
          upvoteItem={upvoteItem}
          openModal={openModal}
          labelAsSpam={() => this.labelAsSpam(comment, null)}
          labelAsNotSpam={() => this.labelAsNotSpam(comment, null)}
        />
      </div>
    );
  }

  renderReplies(replies, rootId) {
    const { user, projectMetadata } = this.props;
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
      const hasUpvoted = find(
        reply.upvotesFrom,
        upvotedUser => upvotedUser.id === this.props.user.id
      );
      const upvoteItem = this.props.isLoggedIn
        ? this.props.upvoteItem.bind(this, {
            rootId,
            comment: reply,
            hasUpvoted
          })
        : this.promptLoginToast;
      const openModal = this.openModal.bind(null, reply, false, false);
      const initReplyToThis = this.props.isLoggedIn
        ? this.initReply.bind(this, reply)
        : this.promptLoginToast;
      return (
        <div
          className={`comment-item__reply-item ${
            i === replies.length - 1 ? "last-item" : ""
          }`}
          key={`comment-item__reply-${reply.id}`}
        >
          <div className="comment-item__header">
            <p className="comment-item__owner-name d-flex flex-direction-column">
              <PunditContainer policies={policies} user={reply.owner}>
                <PunditTypeSet type="Comment">
                  <VisibleIf
                    action="isProjectAdmin"
                    model={{ project: projectMetadata, comment: reply }}
                  >
                    <span class="text-primary">
                      <i class="text-primary mr-2 fas fa-certificate" />
                      {projectMetadata.name}
                    </span>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
              <PunditContainer policies={policies} user={reply.owner}>
                <PunditTypeSet type="Comment">
                  <VisibleIf
                    action="isNotProjectAdmin"
                    model={{ project: projectMetadata, comment: reply }}
                  >
                    <span>{reply.owner.displayName}</span>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
            </p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="comment-item__comment">[deleted]</p>
          ) : (
            <p className="comment-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="comment-item__at-someone">
                  {"@" + reply.parent.owner.displayName}
                </span>
              )}{" "}
              {reply.comment}
            </p>
          )}
          <ActionBar
            item={reply}
            isClosedForComment={this.props.isClosedForComment}
            projectMetadata={projectMetadata}
            user={user}
            hasUpvoted={hasUpvoted}
            initReplyToThis={initReplyToThis}
            upvoteItem={upvoteItem}
            openModal={openModal}
            labelAsSpam={() => this.labelAsSpam(reply, rootId)}
            labelAsNotSpam={() => this.labelAsNotSpam(reply, rootId)}
          />
        </div>
      );
    });
  }
}

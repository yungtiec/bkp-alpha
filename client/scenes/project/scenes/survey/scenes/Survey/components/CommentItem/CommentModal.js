import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Modal from "react-modal";
import { hideModal } from "../../../../../../../../data/reducer";
import { addNewComment } from "../../../../data/comments/actions";
import { CommentBox, CommentBoxWithTagField } from "../index";

class Comment extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSubmit(argObj) {
    this.props.addNewComment(argObj);
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.props.hideModal}
        contentLabel="Edit Comment Modal"
      >
        <div className="comment-item--editing">
          <h5>Please leave a comment, and let us know what you think.</h5>
          <hr className="my-2" />
          <CommentBoxWithTagField
            selectedTags={[]}
            initialValue={""}
            projectSurveyId={this.props.projectSurveyId}
            onSubmit={this.props.addNewComment}
            onCancel={this.props.hideModal}
          />
          <div className="comment-item--editing__action--bottom " />
        </div>
      </Modal>
    );
  }
}

const mapState = (state, ownProps) => ({
  ...ownProps
});

const actions = {
  hideModal,
  addNewComment
};

export default connect(mapState, actions)(Comment);

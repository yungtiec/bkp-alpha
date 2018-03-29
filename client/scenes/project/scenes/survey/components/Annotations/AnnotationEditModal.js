import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Modal from "react-modal";
import { hideModal } from "../../../../../../data/reducer";
import { editAnnotationComment } from "../../data/annotations/actions";
import { CommentBox } from "../index";

class AnnotationEditModal extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onClose() {
    this.props.hideModal();
  }

  handleSubmitEditedComment(argObj) {
    this.props.editAnnotationComment(argObj)
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.onClose}
        contentLabel="Annotation Edit Modal"
      >
        <div className="annotation-item__edit">
          <p className="annotation-item__quote">{this.props.quote}</p>
          <CommentBox
            initialValue={this.props.comment}
            annotationId={this.props.id}
            onSubmit={this.handleSubmitEditedComment}
            onCancel={this.onClose}
          />
          <div className="annotation-item__action--bottom " />
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
  editAnnotationComment
};

export default connect(mapState, actions)(AnnotationEditModal);

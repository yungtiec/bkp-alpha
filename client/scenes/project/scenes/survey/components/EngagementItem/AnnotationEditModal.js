import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Modal from "react-modal";
import { hideModal } from "../../../../../../data/reducer";
import { editAnnotationComment } from "../../data/annotations/actions";
import { removeTag, addTag } from "../../data/tags/actions";
import { getAllTags } from "../../data/tags/reducer";
import { CommentBox, CommentBoxWithTagField } from "../index";
import { TagChip } from "../../../../../../components";
import Select from "react-select";

class AnnotationEditModal extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onClose() {
    this.props.hideModal();
  }

  handleSubmitEditedComment(argObj) {
    this.props.editItem(argObj);
  }

  handleTagOnChange(selected) {
    if (this.props.tags.indexOf(selected.value) === -1) {
      this.props.addTag({
        annotationId: this.props.id,
        tagName: selected.length && selected[0].value
      });
    }
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.onClose}
        contentLabel="Annotation Edit Modal"
      >
        <div className="annotation-item__edit">
          <h5>Your annotation/comment</h5>
          <hr className="my-2" />
          <p className="annotation-item__quote mt-4">{this.props.quote}</p>
          <CommentBoxWithTagField
            issueOpen={this.props.issue ? this.props.issue.open : false}
            tags={this.props.availableTags}
            selectedTags={this.props.tags}
            initialValue={this.props.comment}
            annotationId={this.props.id}
            showTags={this.props.showTags}
            showIssueCheckbox={this.props.showIssueCheckbox}
            commentId={this.props.id}
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
  ...ownProps,
  availableTags: getAllTags(state)
});

const actions = {
  hideModal,
  editAnnotationComment,
  removeTag,
  addTag
};

export default connect(mapState, actions)(AnnotationEditModal);

<span
  class="Select-value-label"
  role="option"
  aria-selected="true"
  id="react-select-3--value-0"
>
  tag (3)<span class="Select-aria-only">&nbsp;</span>
</span>;

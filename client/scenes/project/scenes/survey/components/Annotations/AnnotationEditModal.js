import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Modal from "react-modal";
import { hideModal } from "../../../../../../data/reducer";
import {
  editAnnotationComment,
  removeTag,
  addTag
} from "../../data/annotations/actions";
import { getAllTags } from "../../data/annotations/reducer";
import { CommentBox } from "../index";
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
    this.props.editAnnotationComment(argObj);
  }

  handleTagOnChange(selected) {
    console.log(selected);
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
          <p>Edit your annotation</p>
          <hr class="my-4" />
          <p className="annotation-item__quote">{this.props.quote}</p>
          <div className="annotation-item__tags">
            {this.props.tags.length
              ? this.props.tags.map(tag => (
                  <button type="button" class="btn btn-light">
                    {tag.name}
                    <span
                      class="badge badge-danger"
                      onClick={() =>
                        this.props.removeTag({
                          annotationId: this.props.id,
                          tagId: tag.id
                        })
                      }
                    >
                      x
                    </span>
                  </button>
                ))
              : ""}
          </div>
          <Select.Creatable
            multi={true}
            options={this.props.availableTags
              .filter(
                tag => this.props.tags.map(t => t.name).indexOf(tag.name) === -1
              )
              .map(tag => ({
                value: tag.name,
                label: tag.name
              }))}
            onChange={this.handleTagOnChange}
            value={[]}
          />
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

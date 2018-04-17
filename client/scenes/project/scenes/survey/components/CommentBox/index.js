import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
    autoBind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.value)
      this.props.onSubmit({
        projectSurveyId: this.props.projectSurveyId,
        commentId: this.props.commentId,
        annotationId: this.props.annotationId,
        parentId: this.props.parentId,
        comment: this.state.value
      });
  }

  render() {
    return (
      <div className="comment-box">
        <textarea
          className="comment-box__text-area"
          name="textarea"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <div className="comment-box__actions">
          <button onClick={this.handleSubmit}>save</button>
          {this.props.onCancel && (
            <button onClick={this.props.onCancel}>cancel</button>
          )}
        </div>
      </div>
    );
  }
}

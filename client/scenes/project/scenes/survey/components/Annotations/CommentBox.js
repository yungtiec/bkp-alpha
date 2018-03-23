import "./CommentBox.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    autoBind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.value)
      this.props.replyToAnnotation({
        parentId: this.props.parentId,
        comment: this.state.value
      });
  }

  render() {
    return (
      <form className="comment-box">
        <textarea
          className="comment-box__text-area"
          name="textarea"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <div className="comment-box__actions">
          <button onClick={this.handleSubmit}>save</button>
          <button onClick={this.props.cancelReplyToThis}>cancel</button>
        </div>
      </form>
    );
  }
}

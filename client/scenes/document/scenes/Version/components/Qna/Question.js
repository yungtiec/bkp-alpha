import React, { Component } from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import ReactMarkdown from "react-markdown";
import Markmirror from "react-markmirror";

export default class Question extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      markdown: this.props.question.markdown,
      editing: false
    };
  }

  handleEditingOnClick() {
    this.setState({
      editing: true
    });
  }

  handleValueChange(markdown) {
    this.setState({ markdown });
  }

  handleSubmit() {
    this.props.editQuestion({
      versionQuestionId: this.props.qnaId,
      markdown: this.state.markdown
    });
    this.setState({
      editing: false
    });
  }

  handleCancel() {
    this.setState({
      editing: false
    });
  }

  render() {
    return (
      <div
        id={`qna-${this.props.qnaId}__question`}
        className="editing-toolbar__hover-target"
        onClick={e => {
          this.props.handleCommentOnClick(e, this.props.qnaId);
        }}
      >
        {this.state.editing ? (
          <div>
            <Markmirror
              value={this.state.markdown}
              onChange={this.handleValueChange}
            />

            <ReactMarkdown
              className="qna__question qna__question--editing mb-2 pt-3 px-3"
              source={this.state.markdown}
            />
            <div className="d-flex justify-content-end my-3">
              <button className="btn btn-primary" onClick={this.handleSubmit}>
                Save
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={this.handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <ReactMarkdown
            className="qna__question"
            source={this.props.question.markdown}
          />
        )}

        {!this.state.editing && (
          <div className="editing-toolbar__hover-targeted">
            <button
              className="btn btn-secondary"
              onClick={this.handleEditingOnClick}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  }
}

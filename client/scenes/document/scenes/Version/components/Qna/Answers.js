import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import autoBind from "react-autobind";
import { find, keyBy, clone } from "lodash";
import Markmirror from "react-markmirror";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      markdown: this.props.answer.markdown,
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
    this.props.editAnswer({
      versionAnswerId: this.props.answer.id,
      markdown: this.state.markdown,
      versionQuestionId: this.props.qnaId
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

  renderAnswer({ answer, qnaId, handleCommentOnClick }) {
    return (
      <div
        key={`qna-${qnaId}__answer--${answer.id}`}
        onClick={e => {
          handleCommentOnClick(e, qnaId, answer.id);
        }}
        className="markdown-body"
      >
        <ReactMarkdown className="qna__answer" source={answer.markdown} />
      </div>
    );
  }

  render() {
    const { answer, qnaId, handleCommentOnClick } = this.props;

    return (
      <div className="qna__answer-container editing-toolbar__hover-target">
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
          <div
            key={`qna-${qnaId}__answer--${answer.id}`}
            onClick={e => {
              handleCommentOnClick(e, qnaId, answer.id);
            }}
            className="markdown-body"
          >
            <ReactMarkdown className="qna__answer" source={answer.markdown} />
          </div>
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

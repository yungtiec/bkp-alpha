/*eslint no-unused-vars: off*/
import React from "react";
import PropTypes from "prop-types";
import Markmirror from "react-markmirror";
import ReactMarkdown from "react-markdown";
import { sortBy } from "lodash";
import moment from "moment";
import autoBind from 'react-autobind';
import {TextDiff} from '../../../../utils';

class TextEditorWidget extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.diff = new TextDiff();
    this.state = {
      markdown: this.props.value,
      diff: this.diff.main(
        this.props.value,
        this.props.value
      ),
      editing: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      var newState = {
        markdown: this.props.markdown,
        diff: this.diff.main(
          this.props.markdown,
          this.props.markdown
        )
      };
      this.setState(prevState => ({ ...prevState, ...newState }));
      setTimeout(
        () => this.markMirror && this.markMirror.setupCodemirror(),
        200
      );
    }
  }

  static renderToolbar(markmirror, renderButton) {
    return (
      <div className="markmirror__toolbar myapp__toolbar">
        {renderButton("h1")}
        {renderButton("h2")}
        {renderButton("h3")}
        {renderButton("bold")}
        {renderButton("italic")}
        {renderButton("oList")}
        {renderButton("uList")}
        {renderButton("quote")}
        {renderButton("link")}
      </div>
    );
  }

  handleValueChange(markdown) {
    this.setState({
      markdown,
      diff: this.diff.main("", markdown)
    });
    return markdown;
  }

  render() {
    const {
      value,
      onChange,
    } = this.props;

    return (
      <div>
        <Markmirror
          key="answer-markmirror"
          defaultValue={value}
          value={value}
          onChange={markdown => {
            onChange(this.handleValueChange(markdown))
          }}
          renderToolbar={this.renderToolbar}
          ref={el => (this.markMirror = el)}
        />
        <ReactMarkdown
          className="markdown-body markdown-body--text-diff qna__question qna__question--editing mb-2 p-3"
          source={this.diff.getMarkdownWithdifference(this.state.diff)}
        />
      </div>
    );
  }
}

TextEditorWidget.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  TextEditorWidget.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default TextEditorWidget;

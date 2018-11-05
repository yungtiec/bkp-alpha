/*eslint no-unused-vars: off*/
import React from "react";
import PropTypes from "prop-types";
import Markmirror from "react-markmirror";
import ReactMarkdown from "react-markdown";
import { sortBy } from "lodash";
import moment from "moment";
import autoBind from "react-autobind";
import { TextDiff } from "../../../../utils";
import RichTextEditor from "react-rte";

class TextEditorWidget extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  state = {
    value: RichTextEditor.createEmptyValue()
  };

  handleEditorChange(value) {
    this.setState({ value });
    this.props.onChange(value.toString("html"));
  }

  render() {
    const { value, onChange } = this.props;

    return (
      <div style={{ zIndex: 1 }}>
        <RichTextEditor
          value={this.state.value}
          onChange={this.handleEditorChange}
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

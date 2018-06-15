import React, { Component } from "react";
import autoBind from "react-autobind";

class IssueInput extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      issue: ""
    };
  }

  handleChange(event) {
    this.setState({ issue: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.issue.length) {
      this.props.addNewIssue(this.state.issue);
      this.setState({
        issue: ""
      });
    }
    event && event.preventDefault();
  }

  handleKeyPress(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  render() {
    const isEnabled = this.state.issue.length > 0;

    return (
      <div className="social-sidebar__issue-input">
        <textarea
          type="text"
          className="form-control"
          placeholder="This disclosure resolves..."
          value={this.state.issue}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <div className="issue-input__actions">
          <button
            className="btn"
            onClick={this.handleSubmit}
            disabled={!isEnabled}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}

export default IssueInput;

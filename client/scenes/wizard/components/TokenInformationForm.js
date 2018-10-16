import React from "react";
import axios from "axios";
import { Async } from "react-select";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { postDocumentForProject } from "../data/services";
import { getCurrentProject } from "../data/reducer";
import { updateCurrentProject } from "../data/actions";

class TokenInformationForm extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {

  }

  loadOptions(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get("/api/projects/search?q=" + input).then(res => {
      return { options: res.data.map(p => ({ value: p, label: p.name })) };
    });
  }

  onChange(option) {
    this.setState({
      selected: option
    });
  }

  next() {
    // form validation

    this.props.next();
  }

  render() {
    return (
      <div>
        <Async
          name="form-field-name"
          loadOptions={this.loadOptions}
          onChange={this.props.updateCurrentProject}
          value={
            this.props.project
              ? { value: this.props.project, label: this.props.project.name }
              : null
          }
        />
        <div>
          <button onClick={this.next}>next</button>
          <button onClick={this.props.back}>back</button>
        </div>
      </div>
    );
  }
}

const mapStates = (state, ownProps) => ({
  ...ownProps,
  project: getCurrentProject(state)
});

const mapDispatch = (dispatch, ownProps) => ({
  updateCurrentProject: option => dispatch(updateCurrentProject(option.value))
});

export default connect(
  mapStates,
  mapDispatch
)(TokenInformationForm);

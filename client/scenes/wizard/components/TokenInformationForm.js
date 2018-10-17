import React from "react";
import axios from "axios";
import { Async } from "react-select";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { postDocumentForProject } from "../data/services";
import { getCurrentProject } from "../data/reducer";
import { updateCurrentProject, submitDocumentMetadata } from "../data/actions";

class TokenInformationForm extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      pristine: true
    };
  }

  componentDidMount() {
    this.setState({
      projectError: !this.props.project
    });
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
      pristine: false,
      projectError: !option.value
    });
    this.props.updateCurrentProject(option);
  }

  next() {
    // form validation
    this.setState({
      pristine: false,
      projectError: !this.props.project
    });
    if (!this.props.project) return;
    this.props.next();
  }

  render() {
    return (
      <div>
        <div class="form-group row">
          <label for="project" class="col-sm-2 col-form-label">
            project
          </label>
          <div class="col-sm-10 d-flex flex-column">
            <Async
              name="form-field-name"
              loadOptions={this.loadOptions}
              onChange={this.onChange}
              value={
                this.props.project
                  ? {
                      value: this.props.project,
                      label: this.props.project.name
                    }
                  : null
              }
            />
            {!this.state.pristine &&
              this.state.projectError && (
                <p className="text-danger">this is required</p>
              )}
          </div>
        </div>
        <div class="form-group row">
          <label for="description" class="col-sm-2 col-form-label">
            description
          </label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              placeholder="optional short summary"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.props.back}
          >
            back
          </button>
          <button type="button" className="btn btn-primary ml-2" onClick={this.next}>
            next
          </button>
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

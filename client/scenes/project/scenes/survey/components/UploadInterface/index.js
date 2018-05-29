import "./index.scss";
import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import { SurveyHeader } from "../index";
import Dropzone from "react-dropzone";
import ReactMarkdown from "react-markdown";

export default class UploadInterface extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    const self = this;
    this.state = { uploadedMarkdown: null };
    this.fileReader = new FileReader();
    this.fileReader.onload = function(e) {
      self.setState({
        uploadedMarkdown: self.fileReader.result
      });
    };
  }

  onDrop(file) {
    if (file) {
      var fileReader = new FileReader();
      this.fileReader.readAsText(file[0], "UTF8");
    }
  }

  render() {
    const {
      isLoggedIn,
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata
    } = this.props;

    return (
      <div className="project-survey" id="project-survey">
        <SurveyHeader
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
          showVersionToolbar={true}
        />
        {this.state.uploadedMarkdown ? null : (
          <div className="project-survey__upload-dropzone">
            <Dropzone onDrop={this.onDrop} multiple={false}>
              <p>
                Try dropping some files here, or click to select files to
                upload.
              </p>
            </Dropzone>
          </div>
        )}
        {this.state.uploadedMarkdown ? (
          <ReactMarkdown source={this.state.uploadedMarkdown} />
        ) : null}
      </div>
    );
  }
}

import "./index.scss";
import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import { SurveyHeader } from "../index";
import Dropzone from "react-dropzone";
import ReactMarkdown from "react-markdown";
import Diff from "text-diff";
import sanitizeHtml from "sanitize-html";

function getSurveyMarkdown({ surveyTitle, surveyQnaIds, surveyQnasById }) {
  const newline = "\n\n";
  var surveyMarkdown = "# " + surveyTitle + newline;
  surveyQnaIds.forEach(sid => {
    surveyMarkdown += surveyQnasById[sid].question.markdown;
    surveyMarkdown += surveyQnasById[sid].project_survey_answers[0].markdown;
    if (surveyQnasById[sid].project_survey_answers[0].children.length)
      surveyQnasById[sid].project_survey_answers[0].children.forEach(child => {
        surveyMarkdown += child.markdown;
      });
  });
  return surveyMarkdown;
}

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
    this.diff = new Diff();
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
    const originalMarkdown = getSurveyMarkdown({
      surveyTitle: surveyMetadata.title,
      surveyQnaIds,
      surveyQnasById
    });
    var textDiff = this.state.uploadedMarkdown
      ? this.diff.main(originalMarkdown, this.state.uploadedMarkdown)
      : null;
    if (this.state.uploadedMarkdown) this.diff.cleanupSemantic(textDiff);

    return (
      <div className="project-survey" id="project-survey">
        <SurveyHeader
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
          uploadMode={true}
          uploaded={!!this.state.uploadedMarkdown}
          resetUpload={() =>
            this.setState({
              uploadedMarkdown: null
            })
          }
        />
        {this.state.uploadedMarkdown ? null : (
          <div className="project-survey__upload-dropzone">
            <Dropzone
              onDrop={this.onDrop}
              multiple={false}
              style={{
                width: "100%",
                height: "35vh",
                borderWidth: "0px",
                background: "#f2f2f2",
                borderRadius: "5px",
                color: "#857878",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h5>drop your markdown file here</h5>
              <h5>or</h5>
              <h5>click to select file</h5>
            </Dropzone>
          </div>
        )}
        {this.state.uploadedMarkdown ? (
          <div
            className="project-survey__upload-diff"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(this.diff.prettyHtml(textDiff), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                  "ins",
                  "del"
                ])
              })
            }}
          />
        ) : null}
      </div>
    );
  }
}

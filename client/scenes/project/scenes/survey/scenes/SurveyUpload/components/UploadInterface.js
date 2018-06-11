import "./UploadInterface.scss";
import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import { SurveyHeader } from "../../../components/index";
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
    this.fileReader = new FileReader();
    this.fileReader.onload = function(e) {
      self.props.importMarkdown(self.fileReader.result);
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
      userEmail,
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      importedMarkdown,
      importMarkdown,
      uploadMarkdownToServer
    } = this.props;
    const originalMarkdown = getSurveyMarkdown({
      surveyTitle: surveyMetadata.title,
      surveyQnaIds,
      surveyQnasById
    });
    var textDiff = importedMarkdown
      ? this.diff.main(originalMarkdown, importedMarkdown)
      : null;
    if (importedMarkdown) this.diff.cleanupSemantic(textDiff);

    return (
      <div className="project-survey" id="project-survey">
        {importedMarkdown ? null : (
          <div className="project-survey__upload-dropzone">
            <Dropzone
              onDrop={this.onDrop}
              multiple={false}
              style={{
                width: "100%",
                height: "500px",
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
        {importedMarkdown ? (
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

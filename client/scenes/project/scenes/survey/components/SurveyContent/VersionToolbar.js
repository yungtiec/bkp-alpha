import React, { Component } from "react";
import autoBind from "react-autobind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
import { connect } from "react-redux";
import download from "downloadjs";

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

class VersionToolbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
  render() {
    const {
      projectMetadata,
      surveyMetadata,
      surveyQnasById,
      surveyQnaIds
    } = this.props;
    const surveyMarkdown = getSurveyMarkdown({
      surveyTitle: surveyMetadata.title,
      surveyQnaIds,
      surveyQnasById
    });
    return (
      <div className="btn-group" role="group" aria-label="Basic example">
        <button type="button" className="btn btn-outline-primary">
          Upload new version
        </button>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Copy or download
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div className="card-body" style={{ width: "18rem" }}>
              <h6 className="card-subtitle mb-4 text-secondary">
                Edit disclosure in the markdown editor of your choice
              </h6>
              <p className="card-text">
                Don't have an editor in mind?{" "}
                <a
                  href="https://dillinger.io/"
                  target="_blank"
                  className="font-weight-bold text-primary"
                >
                  Here's a place to start.
                </a>
              </p>
              <p className="card-text">
                Need some pointers on writing markdown file?{" "}
                <a
                  href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                  target="_blank"
                  className="font-weight-bold text-primary"
                >
                  check out this cheatsheet.
                </a>
              </p>
              <CopyToClipboard
                text={surveyMarkdown}
                onCopy={() =>
                  this.props.notify({
                    title: "Copied to clipboard",
                    message: "Paste in the editor of your choice",
                    status: "success",
                    dismissible: true,
                    dismissAfter: 3000
                  })
                }
              >
                <a className="card-link text-primary mr-3">Copy markdown</a>
              </CopyToClipboard>
              <a
                className="card-link text-primary mr-3"
                onClick={() =>
                  download(
                    surveyMarkdown,
                    `${projectMetadata.symbol.toLowerCase()}-${
                      surveyMetadata.id
                    }.md`,
                    "text/markdown"
                  )
                }
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, { notify })(VersionToolbar);

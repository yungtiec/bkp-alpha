import React, { Component } from "react";
import autoBind from "react-autobind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
import { connect } from "react-redux";
import download from "downloadjs";
import { Link } from "react-router-dom";
import history from "../../../../../history";
import { orderBy, find } from "lodash";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../policies.js";

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
      resetUpload,
      projectMetadata,
      surveyMetadata,
      surveyQnasById,
      surveyQnaIds,
      uploadMode,
      uploaded,
      user,
      upvoteProjectSurvey
    } = this.props;

    const surveyMarkdown = getSurveyMarkdown({
      surveyTitle: surveyMetadata.title,
      surveyQnaIds,
      surveyQnasById
    });

    const hasUpvoted = find(
      surveyMetadata.upvotesFrom,
      u => u.email === user.email
    );

    return (
      <div className="btn-group mb-5" role="group" aria-label="Basic example">
        <button
          type="button"
          className={`btn ${
            hasUpvoted
              ? "bg-consensys text-light"
              : "text-consensys btn-outline-primary"
          }`}
          onClick={() =>
            upvoteProjectSurvey({
              projectSymbol: projectMetadata.symbol,
              projectSurveyId: surveyMetadata.id,
              hasUpvoted
            })
          }
        >
          <i class="fas fa-thumbs-up mr-2" />
          {surveyMetadata.upvotesFrom ? surveyMetadata.upvotesFrom.length : 0}
        </button>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="versionMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {`Version ${this.props.surveyMetadata.hierarchyLevel}`}
          </button>
          <div className="dropdown-menu" aria-labelledby="versionMenuButton">
            {this.props.surveyMetadata.versions.map(v => (
              <Link
                key={`version-dropdown__item-${v.id}`}
                class="dropdown-item"
                to={`/project/${this.props.projectMetadata.symbol}/survey/${
                  v.id
                }`}
                style={
                  v.hierarchyLevel === this.props.surveyMetadata.hierarchyLevel
                    ? { fontWeight: 700 }
                    : {}
                }
              >
                {`Version ${v.hierarchyLevel}`}
              </Link>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() =>
            history.push(
              `/project/${this.props.projectMetadata.symbol}/survey/${
                this.props.surveyMetadata.id
              }`
            )
          }
        >
          View disclosure
        </button>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="versionProgressButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Link
              to={`/project/${this.props.projectMetadata.symbol}/survey/${
                this.props.surveyMetadata.id
              }/progress`}
            >
              View progress
            </Link>
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby="versionProgressButton"
          >
            <Link
              to={`/project/${this.props.projectMetadata.symbol}/survey/${
                this.props.surveyMetadata.id
              }/progress`}
              class="dropdown-item"
            >
              Milestone
            </Link>
            <Link
              to={`/project/${this.props.projectMetadata.symbol}/survey/${
                this.props.surveyMetadata.id
              }/issues`}
              class="dropdown-item"
            >
              Issues
            </Link>
          </div>
        </div>
        {!uploadMode ? (
          <PunditContainer policies={policies} user={user}>
            <PunditTypeSet type="Disclosure">
              <VisibleIf
                action="Version"
                model={{ project: projectMetadata, disclosure: surveyMetadata }}
              >
                <button type="button" className="btn btn-outline-primary">
                  <Link
                    to={`/project/${this.props.projectMetadata.symbol}/survey/${
                      orderBy(
                        this.props.surveyMetadata.versions,
                        ["hierarchyLevel"],
                        ["desc"]
                      )[0].id
                    }/upload`}
                  >
                    Import new version
                  </Link>
                </button>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    id="downloadMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Copy or download
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="downloadMenuButton"
                  >
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
                        <a className="card-link text-primary mr-3">
                          Copy markdown
                        </a>
                      </CopyToClipboard>
                      <a
                        className="card-link text-primary mr-3"
                        onClick={() =>
                          download(
                            surveyMarkdown,
                            `${this.props.projectMetadata.symbol.toLowerCase()}-${
                              this.props.surveyMetadata.id
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
              </VisibleIf>
            </PunditTypeSet>
          </PunditContainer>
        ) : uploaded ? (
          <PunditContainer policies={policies} user={user}>
            <PunditTypeSet type="Disclosure">
              <VisibleIf
                action="Version"
                model={{ project: projectMetadata, disclosure: surveyMetadata }}
              >
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={resetUpload}
                >
                  Import another file
                </button>
              </VisibleIf>
            </PunditTypeSet>
          </PunditContainer>
        ) : null}
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps, user: state.data.user });

export default connect(mapState, { notify })(VersionToolbar);

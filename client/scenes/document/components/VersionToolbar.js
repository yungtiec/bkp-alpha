import React, { Component } from "react";
import autoBind from "react-autobind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
import { connect } from "react-redux";
import download from "downloadjs";
import { Link } from "react-router-dom";
import history from "../../../history";
import { orderBy, find, isEmpty } from "lodash";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import { loadModal } from "../../../data/reducer";
import policies from "../../../policies.js";
import ReactTooltip from "react-tooltip";

function getDocumentMarkdown({
  documentTitle,
  documentQnaIds,
  documentQnasById
}) {
  const newline = "\n\n";
  var documentMarkdown = "# " + documentTitle + newline;
  documentQnaIds.forEach(sid => {
    documentMarkdown += documentQnasById[sid].markdown;
    documentMarkdown += documentQnasById[sid].version_answers[0].markdown;
  });
  return documentMarkdown;
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
      documentMetadata,
      latestVersionMetadata,
      documentQnasById,
      documentQnaIds,
      uploadMode,
      loadModal,
      user,
      width,
      upvoteDocument,
      downvoteDocument
    } = this.props;

    const documentMarkdown = getDocumentMarkdown({
      documentTitle: latestVersionMetadata.title,
      documentQnaIds,
      documentQnasById
    });

    const hasUpvoted = !!find(
      documentMetadata.upvotesFrom,
      upvotedUser => upvotedUser.id === user.id
    );

    const hasDownvoted = !!find(
      documentMetadata.downvotesFrom,
      downvotedUser => downvotedUser.id === user.id
    );

    return (
      <div>
        <p>Do you like this framework?</p>
        <div className="btn-group mb-5" role="group" aria-label="Basic example">
          <button
            type="button"
            className={`btn ${
              hasUpvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            } project-document__upvote-btn`}
            onClick={() =>
              upvoteDocument({
                projectSymbol: projectMetadata.symbol,
                documentId: documentMetadata.id,
                versionId: latestVersionMetadata.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-up mr-2" />
            {documentMetadata.upvotesFrom
              ? documentMetadata.upvotesFrom.length
              : 0}
          </button>
          <button
            type="button"
            className={`btn ${
              hasDownvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            }`}
            onClick={() =>
              downvoteDocument({
                projectSymbol: projectMetadata.symbol,
                documentId: documentMetadata.id,
                versionId: latestVersionMetadata.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-down mr-2" />
            {documentMetadata.downvotesFrom
              ? documentMetadata.downvotesFrom.length
              : 0}
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
              {`Version ${
                !isEmpty(this.props.versionMetadata)
                  ? this.props.versionMetadata.version_number
                  : this.props.latestVersionMetadata.version_number
              }`}
            </button>
            <div className="dropdown-menu" aria-labelledby="versionMenuButton">
              {this.props.documentMetadata.versions.map(v => {
                var versionMetadata = !isEmpty(this.props.versionMetadata)
                  ? this.props.versionMetadata
                  : this.props.latestVersionMetadata;
                return (
                  <Link
                    key={`version-dropdown__item-${v.id}`}
                    class="dropdown-item"
                    to={`/project/${
                      this.props.projectMetadata.symbol
                    }/document/${documentMetadata.id}/version/${v.id}`}
                    style={
                      v.hierarchyLevel === versionMetadata.hierarchyLevel
                        ? { fontWeight: 700 }
                        : {}
                    }
                  >
                    {`Version ${v.version_number}`}
                  </Link>
                );
              })}
            </div>
          </div>
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
                to={`/project/${this.props.projectMetadata.symbol}/document/${
                  documentMetadata.id
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
                to={`/project/${this.props.projectMetadata.symbol}/document/${
                  documentMetadata.id
                }/progress`}
                class="dropdown-item"
              >
                Milestone
              </Link>
              <Link
                to={`/project/${this.props.projectMetadata.symbol}/document/${
                  documentMetadata.id
                }/issues`}
                class="dropdown-item"
              >
                Issues
              </Link>
            </div>
          </div>
          <button type="button" className="btn btn-outline-primary">
            <a
              href="https://drive.google.com/file/d/1XjDGO2GCkHee0kdomC4sYS1iE-y8RSnL/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              View pdf
            </a>
          </button>
          {!uploadMode ? (
            <PunditContainer policies={policies} user={user}>
              <PunditTypeSet type="Disclosure">
                <VisibleIf
                  action="Version"
                  model={{
                    project: projectMetadata,
                    disclosure: documentMetadata
                  }}
                >
                  <button type="button" className="btn btn-outline-primary">
                    <Link
                      to={`/project/${
                        this.props.projectMetadata.symbol
                      }/document/${documentMetadata.id}/version/${
                        orderBy(
                          documentMetadata.versions,
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
                          text={documentMarkdown}
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
                              documentMarkdown,
                              `${this.props.projectMetadata.symbol.toLowerCase()}-${
                                this.props.latestVersionMetadata.id
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
          ) : null}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  width: state.data.environment.width
});

export default connect(mapState, { notify, loadModal })(VersionToolbar);

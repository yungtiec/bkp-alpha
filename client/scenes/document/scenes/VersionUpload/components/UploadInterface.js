import "./UploadInterface.scss";
import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import { DocumentHeader } from "../../../components/index";
import Dropzone from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { TextDiff } from "../../../../../utils";
import sanitizeHtml from "sanitize-html";

function getDocumentMarkdown({
  documentTitle,
  versionQnaIds,
  versionQnasById
}) {
  const newline = "\n\n";
  var documentMarkdown = "# " + documentTitle + newline;
  versionQnaIds.forEach(sid => {
    documentMarkdown += versionQnasById[sid].markdown;
    documentMarkdown += versionQnasById[sid].version_answers[0].markdown;
  });
  return documentMarkdown;
}

export default class UploadInterface extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.diff = new TextDiff();
    const self = this;
    this.fileReader = new FileReader();
    this.fileReader.onload = function(e) {
      self.props.importMarkdown(self.fileReader.result);
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
      versionQnasById,
      versionQnaIds,
      versionMetadata,
      projectMetadata,
      importedMarkdown,
      importMarkdown,
      uploadMarkdownToServer
    } = this.props;
    const originalMarkdown = getDocumentMarkdown({
      documentTitle: versionMetadata.title,
      versionQnaIds,
      versionQnasById
    });
    var textDiff = importedMarkdown
      ? this.diff.main(originalMarkdown, importedMarkdown)
      : null;
    if (importedMarkdown) this.diff.cleanupSemantic(textDiff);

    return (
      <div style={{ width: "100%" }}>
        {importedMarkdown ? null : (
          <div className="project-document__upload-dropzone">
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
            className="project-document__upload-diff"
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

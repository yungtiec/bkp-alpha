import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import Dropzone from "react-dropzone";
import ReactMarkdown from "react-markdown";
import Diff from "text-diff";
import sanitizeHtml from "sanitize-html";

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
      importedMarkdown,
      importMarkdown,
      uploadMarkdownToServer
    } = this.props;

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
        {importedMarkdown ? <ReactMarkdown source={importedMarkdown} /> : null}
      </div>
    );
  }
}

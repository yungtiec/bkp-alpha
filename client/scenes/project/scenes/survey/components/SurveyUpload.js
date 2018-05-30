import "./SurveyUpload.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { CustomScrollbar } from "../../../../../components";
import { SidebarLayout, UploadInterface, OutstandingIssue } from "./index";

class SurveyUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds,
      unfilteredAnnotationIds,
      isLoggedIn,
      match,
      width,
      commentIds,
      commentsById,
      projectSurveyId,
      outstandingIssues,
      notify,
      importedMarkdown,
      importMarkdown,
      uploadMarkdownToServer
    } = this.props;

    return (
      <div>
        <UploadInterface
          uploadMarkdownToServer={uploadMarkdownToServer}
          importedMarkdown={importedMarkdown}
          importMarkdown={importMarkdown}
          isLoggedIn={isLoggedIn}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <SidebarLayout width={width} uploadMode={true}>
          <CustomScrollbar
            scrollbarContainerWidth={
              width < 767 ? "350px" : width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 120px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <div className="social-sidebar__issue-header">
              Select issue(s) you've resolved with this version
            </div>
            <div className="sidebar-contents">
              {outstandingIssues.map(item => (
                <OutstandingIssue
                  key={`issue-${item.engagementItemId}`}
                  engagementItem={item}
                  notify={notify}
                />
              ))}
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default SurveyUpload;

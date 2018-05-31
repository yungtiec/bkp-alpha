import "./SurveyUpload.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { CustomScrollbar } from "../../../../../components";
import {
  SidebarLayout,
  UploadInterface,
  OutstandingIssue,
  CollaboratorControl,
  IssueInput
} from "./index";

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
      uploadMarkdownToServer,
      selectIssueToResolve,
      resolvedIssueIds,
      addNewCollaborator,
      removeCollaborator,
      collaboratorEmails,
      addNewIssue,
      removeIssue,
      newIssues
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
            <div className="sidebar-contents">
              <CollaboratorControl
                creator={surveyMetadata.creator}
                collaboratorEmails={collaboratorEmails}
                addNewCollaborator={addNewCollaborator}
                removeCollaborator={removeCollaborator}
              />
              <div>
                <div className="social-sidebar__upload-header px-2 py-1">
                  Resolve issue(s)
                </div>
                <div className="social-sidebar__upload-subheader d-flex justify-content-between pb-1 pt-2 px-2">
                  <span>Issue not listed below? Add your own here.</span>
                </div>
                <IssueInput addNewIssue={addNewIssue} />
                <div className="pb-2">
                  {newIssues.map((item, i) => (
                    <div className="engagement-item" key={`new-issue__${i}`}>
                      <p className="engagement-item__comment mt-3">{item}</p>
                      <div className="engagement-item__action--bottom justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeIssue(item)}
                        >
                          remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="social-sidebar__upload-subheader p-2">
                  Select from issues submitted by the community.
                </div>
                <div>
                  {outstandingIssues.map(item => (
                    <OutstandingIssue
                      key={`issue-${item.engagementItemId}`}
                      engagementItem={item}
                      resolvedIssueIds={resolvedIssueIds}
                      notify={notify}
                      selectIssueToResolve={selectIssueToResolve}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default SurveyUpload;

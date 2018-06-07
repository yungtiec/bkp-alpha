import "./SurveyUpload.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { UploadInterface, CollaboratorControl, IssueInput } from "./components";
import {
  CustomScrollbar,
  requiresAuthorization
} from "../../../../../../components";
import { SidebarLayout, OutstandingIssue } from "../../components";

class SurveyUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      isLoggedIn,
      userEmail,
      width,
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
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
          userEmail={userEmail}
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
            scrollbarContainerHeight="calc(100% - 75px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <div className="sidebar-contents">
              <div className="mb-5 mt-2 px-2">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block "
                  onClick={uploadMarkdownToServer}
                >
                  Upload
                </button>
              </div>
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
                    <div className="comment-item" key={`new-issue__${i}`}>
                      <p className="comment-item__comment mt-3">{item}</p>
                      <div className="comment-item__action--bottom justify-content-end">
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
                      key={`issue-${item.id}`}
                      comment={item}
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

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(
  requiresAuthorization({
    Component: SurveyUpload,
    checkSurveyEditRight: true
  })
);

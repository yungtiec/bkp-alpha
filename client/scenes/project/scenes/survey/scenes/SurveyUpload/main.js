import "./SurveyUpload.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import { UploadInterface, IssueInput } from "./components";
import {
  SidebarLayout,
  CollaboratorControl,
  CustomScrollbar,
  requiresAuthorization
} from "../../../../../../components";
import {
  SurveyHeader,
  VersionToolbar,
  OutstandingIssue
} from "../../components";

class SurveyUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleCommentPeriodChange(selected) {
    this.props.updateCommentPeriod(selected.value);
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
      newIssues,
      updateCommentPeriod,
      commentPeriodInDay,
      sidebarOpen,
      toggleSidebar
    } = this.props;

    return (
      <div>
        <SurveyHeader
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <VersionToolbar
          uploadMode={true}
          uploaded={!!importedMarkdown}
          uploadMarkdownToServer={uploadMarkdownToServer}
          userEmail={userEmail}
          projectMetadata={projectMetadata}
          surveyMetadata={surveyMetadata}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
        />
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
        <SidebarLayout
          width={width}
          uploadMode={true}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        >
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
              <div className="mb-5">
                <div className="social-sidebar__upload-header px-2 py-1">
                  Set comment period
                </div>
                <div className="pb-1 pt-2 px-2">
                  <Select
                    name="form-field-name"
                    value={commentPeriodInDay}
                    onChange={this.handleCommentPeriodChange}
                    options={[
                      { value: 7, label: "1 week" },
                      { value: 3, label: "3 day" },
                      { value: 1, label: "1 day" }
                    ]}
                  />
                </div>
              </div>
              <div>
                <div className="social-sidebar__upload-header px-2 py-1">
                  Resolve issue(s)
                </div>
                <div className="social-sidebar__upload-subheader d-flex justify-content-between pb-1 pt-2 px-2">
                  <span>Issue not listed below? Add your own here.</span>
                </div>
                <IssueInput addNewIssue={addNewIssue} />
                <div className="pb-2 mx-2">
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
                {outstandingIssues.length ? (
                  <div className="social-sidebar__upload-subheader p-2">
                    Select from issues submitted by the community.
                  </div>
                ) : null}
                <div className="mx-2">
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

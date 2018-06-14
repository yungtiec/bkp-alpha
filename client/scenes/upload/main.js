import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import {
  SidebarLayout,
  CollaboratorControl,
  CustomScrollbar,
  requiresAuthorization
} from "../../components";
import UploadInterface from "./components/UploadInterface";

class Upload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleCommentPeriodChange(selected) {
    this.props.updateCommentPeriod(selected.value);
  }

  handleProjectSelectChange(selected) {
    this.props.updateSelectedProject(selected.value);
  }

  render() {
    const {
      isLoggedIn,
      currentUser,
      width,
      notify,
      projectsBySymbol,
      projectSymbolArr,
      importedMarkdown,
      importMarkdown,
      uploadMarkdownToServer,
      addNewCollaborator,
      removeCollaborator,
      collaboratorEmails,
      updateCommentPeriod,
      commentPeriodInDay,
      selectedProjectId,
      sidebarOpen,
      toggleSidebar
    } = this.props;

    return (
      <div className="main-container">
        <div
          style={{
            maxWidth: "740px",
            padding: "20px 0px 6rem"
          }}
        >
          <UploadInterface
            importedMarkdown={importedMarkdown}
            importMarkdown={importMarkdown}
            uploadMarkdownToServer={uploadMarkdownToServer}
          />
        </div>
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
                creator={currentUser}
                collaboratorEmails={collaboratorEmails}
                addNewCollaborator={addNewCollaborator}
                removeCollaborator={removeCollaborator}
              />
              <div className="mb-5">
                <div className="social-sidebar__upload-header px-2 py-1">
                  Select Project
                </div>
                <div className="pb-1 pt-2 px-2">
                  <Select
                    name="profile-comments__project-select"
                    value={selectedProjectId}
                    onChange={this.handleProjectSelectChange}
                    options={projectSymbolArr.map(symbol => ({
                      label: projectsBySymbol[symbol].name.toUpperCase(),
                      value: symbol
                    }))}
                  />
                </div>
              </div>
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
    Component: Upload,
    roleRequired: "project_editor"
  })
);

import "./SurveyUpload.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import { UploadInterface, IssueInput } from "./components";
import {
  SidebarLayout,
  CustomScrollbar,
  requiresAuthorization
} from "../../../../../../components";
import {
  SurveyHeader,
  VersionToolbar,
  OutstandingIssue
} from "../../components";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import Steps, { Step } from "rc-steps";

class SurveyUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0
    };
  }

  handleCommentPeriodChange(selected) {
    this.props.updateCommentPeriod(selected.value);
  }

  handleAccordionChange(key) {
    this.setState({
      activeAccordionItemId: key
    });
  }

  handleCollaboratorChange(selected) {
    this.props.updateCollaborators(selected);
  }

  next(field) {
    this.setState(prevState => ({
      ...prevState,
      activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 5
    }));
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
      updateCollaborators,
      collaboratorEmails,
      collaboratorOptions,
      addNewIssue,
      removeIssue,
      newIssues,
      updateCommentPeriod,
      commentPeriodInDay,
      sidebarOpen,
      toggleSidebar,
      upvoteProjectSurvey
    } = this.props;

    return (
      <div className="project-survey">
        <SurveyHeader
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <VersionToolbar
          uploadMode={true}
          uploaded={!!importedMarkdown}
          uploadMarkdownToServer={uploadMarkdownToServer}
          resetUpload={() => importMarkdown(null)}
          projectMetadata={projectMetadata}
          surveyMetadata={surveyMetadata}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          upvoteProjectSurvey={upvoteProjectSurvey}
        />
        <Accordion onChange={this.handleAccordionChange}>
          <AccordionItem expanded={this.state.activeAccordionItemId === 0}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">
                Collaborators (optional)
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column">
                <p>select collaborator(s) to work on your disclosure</p>
                <Select
                  name="upload__collaborator-select"
                  value={collaboratorEmails}
                  multi={true}
                  onChange={this.handleCollaboratorChange}
                  options={collaboratorOptions.map(c => ({
                    label: c.email,
                    value: c.email
                  }))}
                  placeholder="work with..."
                />
                <button
                  onClick={this.next}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 1}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">Comment period</p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column">
                <p>set comment period for audiences</p>
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
                <button
                  onClick={this.next}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 2}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">issues (part 1)</p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column">
                {outstandingIssues.length ? (
                  <div>
                    <p>click to close issues submitted by the community</p>
                    <div className="entity-cards">
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
                ) : (
                  <p>no outstanding issue</p>
                )}
                <button
                  onClick={this.next}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 3}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">issues (part 2)</p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column">
                <p>Issue not listed below? Add your own here.</p>
                <IssueInput addNewIssue={addNewIssue} />
                <div className="mt-3">
                  <div
                    className="entity-cards"
                    style={!newIssues.length ? { border: "none" } : {}}
                  >
                    {newIssues.map((item, i) => (
                      <div
                        className="comment-issue-item"
                        key={`new-issue__${i}`}
                      >
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
                </div>
                <button
                  onClick={this.next}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">
                Disclosure markdown
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p style={{ marginBottom: "0px" }}>
                  import markdown and preview
                </p>
                <button
                  onClick={() => importMarkdown(null)}
                  className="btn btn-outline-primary"
                >
                  reset
                </button>
              </div>
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
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
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
            <div className="sidebar-contents p-5">
              <Steps
                current={this.state.activeAccordionItemId}
                direction="vertical"
              >
                <Step
                  title="collaborators"
                  description="select collaborator(s) to work on your disclosure"
                />
                <Step
                  title="comment periood"
                  description="set comment period for audiences"
                />
                <Step
                  title="issues (part 1)"
                  description="close issues submitted by the community"
                />
                <Step
                  title="issues (part 2)"
                  description="resolve additional issues"
                />
                <Step
                  title="disclosure"
                  description="import markdown and preview"
                  status={
                    !importedMarkdown
                      ? "wait"
                      : this.state.activeAccordionItemId === 4
                        ? "finish"
                        : "wait"
                  }
                />
              </Steps>
              {!!importedMarkdown ? (
                <div className="mb-5 mt-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg btn-block "
                    onClick={uploadMarkdownToServer}
                  >
                    Upload
                  </button>
                </div>
              ) : null}
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
    checkSurveyEditRight: true,
    roleRequired: ["project_editor", "project_admin", "admin"]
  })
);

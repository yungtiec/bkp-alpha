import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import { UploadInterface, IssueInput, OutstandingIssue } from "./components";
import {
  SidebarLayout,
  CustomScrollbar,
  ProjectScorecardInputs
} from "../../../../components";
import { DocumentHeader, VersionToolbar } from "../../components";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import Steps, { Step } from "rc-steps";

class VersionUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0,
      scorecardError: false,
      versionNumberError: false,
      isScorecard: false,
      uploadClicked: false
    };
  }

  handleCommentPeriodUnitChange(selected) {
    this.props.updateCommentPeriodUnit(selected.value);
  }

  handleCommentPeriodValueChange(evt) {
    this.props.updateCommentPeriodValue(evt.target.value);
  }

  handleVersionNumberChange(evt) {
    this.props.updateVersionNumber(evt.target.value);
    if (evt.target.value.trim())
      this.setState(prevState => ({
        ...prevState,
        versionNumberError: false
      }));
  }

  handleAccordionChange(key) {
    if (key > 0)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        versionNumberError: !this.props.versionNumber
      }));
    if (key > 5)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        scorecardError: this.state.isScorecard && !this.props.scorecardCompleted
      }));
    else
      this.setState({
        activeAccordionItemId: key
      });
  }

  handleCollaboratorChange(selected) {
    this.props.updateCollaborators(selected);
  }

  handleIsScorecardChange(evt) {
    this.setState({
      isScorecard: evt.target.checked
    });
  }

  next(currentField) {
    if (currentField === "versionNumber" && !this.props.versionNumber) {
      this.setState(prevState => ({
        ...prevState,
        versionNumberError: !this.props.versionNumber
      }));
    } else if (
      currentField === "scorecard" &&
      this.state.isScorecard &&
      !this.props.scorecardCompleted
    )
      this.setState(prevState => ({
        ...prevState,
        scorecardError: !this.props.scorecardCompleted
      }));
    else
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 7,
        scorecardError: false,
        versionNumberError: !this.props.versionNumber
      }));
  }

  submit() {
    if (
      !!this.props.importedMarkdown &&
      !!this.props.versionNumber &&
      ((this.state.isScorecard && this.props.scorecardCompleted) ||
        !this.state.isScorecard)
    ) {
      this.props.uploadMarkdownToServer();
    } else {
      this.setState({ uploadClicked: true });
    }
  }

  render() {
    const {
      isLoggedIn,
      width,
      documentMetadata,
      versionQnasById,
      versionQnaIds,
      versionMetadata,
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
      newResolvedIssues,
      updateCommentPeriod,
      commentPeriodValue,
      commentPeriodUnit,
      versionNumber,
      sidebarOpen,
      toggleSidebar,
      upvoteDocument,
      downvoteDocument,
      updateProjectScorecard,
      scorecard,
      scorecardCompleted
    } = this.props;

    return (
      <div className="project-document">
        <Accordion onChange={this.handleAccordionChange}>
          <AccordionItem expanded={this.state.activeAccordionItemId === 0}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">Version number</p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column">
                <p>set version number</p>
                <input
                  name="version-number"
                  type="string"
                  value={versionNumber}
                  onChange={this.handleVersionNumberChange}
                />
                {this.state.versionNumberError ? (
                  <p className="text-danger mt-2">version number required</p>
                ) : null}
                <button
                  onClick={() => this.next("versionNumber")}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 1}>
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
          <AccordionItem expanded={this.state.activeAccordionItemId === 2}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">Comment period</p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className="d-flex flex-column upload-accordion__comment-period-control">
                <p>set comment period for audiences</p>
                <div className="d-flex">
                  <input
                    name="comment-period-value"
                    type="number"
                    value={commentPeriodValue}
                    onChange={this.handleCommentPeriodValueChange}
                  />
                  <Select
                    name="comment-period-value"
                    value={commentPeriodUnit}
                    onChange={this.handleCommentPeriodUnitChange}
                    options={[
                      { value: "weeks", label: "week(s)" },
                      { value: "days", label: "day(s)" },
                      { value: "hours", label: "hour(s)" }
                    ]}
                  />
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
          <AccordionItem expanded={this.state.activeAccordionItemId === 3}>
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
          <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
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
                    style={!newResolvedIssues.length ? { border: "none" } : {}}
                  >
                    {newResolvedIssues.map((item, i) => (
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
          <AccordionItem expanded={this.state.activeAccordionItemId === 5}>
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">
                Project score (optional)
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <h6 className="upload-accordion__scorecard-checkbox">
                <input
                  name="isScorecard"
                  type="checkbox"
                  checked={this.state.isScorecard}
                  onChange={this.handleIsScorecardChange}
                />
                Is this document a transparency scorecard?
              </h6>
              {this.state.isScorecard ? (
                <div className="d-flex flex-column">
                  <h6 className="mb-3  mt-5">
                    Fill in score 1 to 10 (10-best, 1-worst)
                  </h6>
                  <ProjectScorecardInputs
                    scorecard={scorecard}
                    updateProjectScorecard={updateProjectScorecard}
                  />
                </div>
              ) : null}
              <div className="d-flex flex-column">
                <button
                  onClick={() => this.next("scorecard")}
                  className="btn btn-primary mt-4 align-self-end"
                >
                  next
                </button>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem expanded={this.state.activeAccordionItemId === 6}>
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
                importedMarkdown={importedMarkdown}
                importMarkdown={importMarkdown}
                isLoggedIn={isLoggedIn}
                versionQnasById={versionQnasById}
                versionQnaIds={versionQnaIds}
                versionMetadata={versionMetadata}
                projectMetadata={documentMetadata.project}
              />
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
        <SidebarLayout
          width={width}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          <CustomScrollbar
            scrollbarContainerWidth={
              width < 767 ? "350px" : width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 70px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <div className="sidebar-contents p-5">
              <Steps
                current={this.state.activeAccordionItemId}
                direction="vertical"
              >
                <Step
                  title="version number"
                  description="set version number for this document"
                  status={
                    this.state.versionNumberError
                      ? "error"
                      : this.state.activeAccordionItemId > 1 ? "finish" : "wait"
                  }
                />
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
                  title="project score"
                  description="fill in project scorecard"
                  status={
                    this.state.isScorecard && this.state.scorecardError
                      ? "error"
                      : this.state.activeAccordionItemId > 4 ? "finish" : "wait"
                  }
                />
                <Step
                  title="disclosure"
                  description="import markdown and preview"
                  status={
                    !importedMarkdown
                      ? "wait"
                      : this.state.activeAccordionItemId === 5
                        ? "finish"
                        : "wait"
                  }
                />
              </Steps>
              <button
                type="button"
                class="btn btn-primary btn-lg btn-block "
                onClick={this.submit}
              >
                Upload
              </button>
              {this.state.uploadClicked &&
              !(
                !!importedMarkdown &&
                ((this.state.isScorecard && scorecardCompleted) ||
                  !this.state.isScorecard)
              ) ? (
                <p className="text-danger">
                  Please go through all the mandatory fields
                </p>
              ) : null}
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(VersionUpload);

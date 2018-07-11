import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import {
  SidebarLayout,
  CustomScrollbar,
  requiresAuthorization,
  ProjectScorecardInputs
} from "../../components";
import UploadInterface from "./components/UploadInterface";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import Steps, { Step } from "rc-steps";
import Formsy from "formsy-react";

class Upload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0,
      projectError: false,
      scorecardError: false,
      isScorecard: false
    };
  }

  handleCommentPeriodChange(selected) {
    this.props.updateCommentPeriod(selected.value);
  }

  handleProjectSelectChange(selected) {
    this.props.updateSelectedProject(
      this.props.projectsBySymbol[selected.value]
    );
    this.setState(prevState => ({
      ...prevState,
      projectError: false
    }));
  }

  handleCollaboratorChange(selected) {
    this.props.updateCollaborators(selected);
  }

  handleIsScorecardChange(evt) {
    this.setState({
      isScorecard: evt.target.checked
    });
  }

  handleAccordionChange(key) {
    if (key > 0)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        projectError: !this.props.selectedProject
      }));
    if (key > 3)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        scorecardError: this.state.isScorecard && !this.props.scorecardCompleted
      }));
    if (key === 0 || key === 3)
      this.setState({
        activeAccordionItemId: key
      });
  }

  next(currentField) {
    if (currentField === "project" && !this.props.selectedProject)
      this.setState(prevState => ({
        ...prevState,
        projectError: !this.props.selectedProject
      }));
    else if (
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
        activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 5,
        scorecardError: false,
        projectError: !this.props.selectedProject
      }));
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
      collaboratorOptions,
      updateCollaborators,
      collaboratorEmails,
      updateCommentPeriod,
      commentPeriodInDay,
      selectedProject,
      updateProjectScorecard,
      sidebarOpen,
      toggleSidebar,
      scorecardCompleted
    } = this.props;

    return (
      <div className="main-container">
        <div
          style={{
            maxWidth: "740px",
            padding: "20px 0px 6rem"
          }}
        >
          <Accordion onChange={this.handleAccordionChange}>
            <AccordionItem expanded={this.state.activeAccordionItemId === 0}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">PROJECT</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <p>pick from projects you manage</p>
                  <Select
                    name="upload__project-select"
                    value={selectedProject.symbol}
                    onChange={this.handleProjectSelectChange}
                    options={projectSymbolArr.map(symbol => ({
                      label: projectsBySymbol[symbol].name.toUpperCase(),
                      value: symbol
                    }))}
                    placeholder="select..."
                  />
                  {this.state.projectError ? (
                    <p className="text-danger mt-2">project required</p>
                  ) : null}
                  <button
                    onClick={() => this.next("project")}
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 3}>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Disclosure markdown
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <p>import markdown and preview</p>
                <UploadInterface
                  importedMarkdown={importedMarkdown}
                  importMarkdown={importMarkdown}
                  uploadMarkdownToServer={uploadMarkdownToServer}
                />
              </AccordionItemBody>
            </AccordionItem>
          </Accordion>
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
                  title="project"
                  description="pick from projects you manage"
                  status={
                    this.state.projectError
                      ? "error"
                      : this.state.activeAccordionItemId > 0 ? "finish" : "wait"
                  }
                />
                <Step
                  title="collaborators"
                  description="select collaborator(s) to work on your disclosure"
                />
                <Step
                  title="comment period"
                  description="set comment period for audiences"
                />
                <Step
                  title="project score"
                  description="fill in project scorecard"
                  status={
                    this.state.scorecardError
                      ? "error"
                      : this.state.activeAccordionItemId > 3 ? "finish" : "wait"
                  }
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
              {!!importedMarkdown && !!selectedProject && scorecardCompleted ? (
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
    Component: Upload,
    roleRequired: ["project_editor", "project_admin", "admin"]
  })
);

// <UploadInterface
//   importedMarkdown={importedMarkdown}
//   importMarkdown={importMarkdown}
//   uploadMarkdownToServer={uploadMarkdownToServer}
// />;

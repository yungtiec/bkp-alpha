import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import {
  SidebarLayout,
  CustomScrollbar,
  requiresAuthorization
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
import ScoreInput from "./components/ScoreInput";

class Upload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0,
      projectError: false
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

  handleAccordionChange(key) {
    this.setState({
      activeAccordionItemId: key
    });
  }

  handleSubmit(model) {
    console.log(model);
  }

  next(field) {
    if (field === "project" && !this.props.selectedProject)
      this.setState(prevState => ({
        ...prevState,
        projectError: true
      }));
    else
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 4
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
                <p className="upload-accordion__item-header">Project score</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <p>fill in project scorecard</p>
                <Formsy
                  className=""
                  onValidSubmit={model => this.handleSubmit(model)}
                  name="project-scorecard__form"
                >
                  <ScoreInput
                    label="Consumer Token Design"
                    name="consumer_token_design"
                    required
                  />
                  <ScoreInput
                    label="Project Governance and Operation"
                    name="project_governance_and_operation"
                    required
                  />
                  <ScoreInput
                    label="Responsible Token Distribution"
                    name="responsible_token_distribution"
                    required
                  />
                  <ScoreInput
                    label="Use of Token Distribution Proceeds"
                    name="use_of_token_distribution_proceeds"
                    required
                  />
                  <ScoreInput
                    label="Token Inventory"
                    name="token_inventory"
                    required
                  />
                  <ScoreInput
                    label="Mitigation of Conflicts and Improper Trading"
                    name="mitigation_of_conflicts_and_improper_trading"
                    required
                  />
                  <ScoreInput
                    label="Token Safety and Security"
                    name="token_safety_and_security"
                    required
                  />
                  <ScoreInput
                    label="Marketing Practices"
                    name="marketing_practices"
                    required
                  />
                  <ScoreInput
                    label="Protecting and Empowering Consumers"
                    name="protecting_and_empowering_consumers"
                    required
                  />
                  <ScoreInput
                    label="Compliance with Applicable Laws"
                    name="compliance_with_application_laws"
                    required
                  />
                </Formsy>
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
                  title="project"
                  description="pick from projects you manage"
                  status={
                    this.state.projectError
                      ? "error"
                      : this.state.activeAccordionItemId === 0
                        ? "wait"
                        : "finish"
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
              {!!importedMarkdown && !!selectedProject ? (
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

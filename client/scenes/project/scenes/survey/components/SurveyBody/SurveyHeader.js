import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../../../../history";
import { ProjectSymbolBlueBox } from "../../../../../../components";

export default class SurveyHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    history.push("/project/" + this.props.project.symbol);
  }

  render() {
    const { survey, project } = this.props;
    const creatorFirstName =
      survey.creator.first_name && survey.creator.first_name.toLowerCase();
    const creatorLastName =
      survey.creator.last_name && survey.creator.last_name.toLowerCase();
    const creator = creatorFirstName
      ? `${creatorFirstName} ${creatorLastName}`
      : creatorLastName;

    return (
      <div className="project-survey__header">
        <p className="project-survey__back-btn" onClick={this.goBack}>
          back to project page
        </p>
        <ProjectSymbolBlueBox name={project.name} />
        <p className="survey-name__box">
          {`${survey.title}`}
        </p>
        <p className="survey-creator-name__box">
          {`survey created by ${creator}`}
        </p>
      </div>
    );
  }
}

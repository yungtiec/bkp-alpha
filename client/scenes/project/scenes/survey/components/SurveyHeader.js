import React, { Component } from "react";
import autoBind from "react-autobind";

export default class SurveyHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
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
        <p className="project-survey__back-btn">back to project page</p>
        <p className="project-name__box">
          {project.name && project.name.toUpperCase()}
        </p>
        <p className="survey-name__box">
          {`${survey.name} - ${survey.description}`}
        </p>
        <p className="survey-creator-name__box">
          {`survey created by ${creator}`}
        </p>
      </div>
    );
  }
}

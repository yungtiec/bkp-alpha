import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../../../../history";
import { ProjectSymbolBlueBox } from "../../../../../../components";
import VersionToolbar from "./VersionToolbar";

export default class SurveyHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    history.push("/project/" + this.props.projectMetadata.symbol);
  }

  render() {
    const {
      surveyMetadata,
      projectMetadata,
      surveyQnasById,
      surveyQnaIds
    } = this.props;
    const creatorFirstName =
      surveyMetadata.creator.first_name &&
      surveyMetadata.creator.first_name.toLowerCase();
    const creatorLastName =
      surveyMetadata.creator.last_name &&
      surveyMetadata.creator.last_name.toLowerCase();
    const creator = creatorFirstName
      ? `${creatorFirstName} ${creatorLastName}`
      : creatorLastName;

    return (
      <div className="project-survey__header">
        <p className="project-survey__back-btn" onClick={this.goBack}>
          back to project page
        </p>
        <ProjectSymbolBlueBox name={projectMetadata.name} />
        <p className="survey-name__box">{`${surveyMetadata.title}`}</p>
        <p className="survey-creator-name__box">
          {`survey created by ${creator}`}
        </p>
        <VersionToolbar
          projectMetadata={projectMetadata}
          surveyMetadata={surveyMetadata}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
        />
      </div>
    );
  }
}

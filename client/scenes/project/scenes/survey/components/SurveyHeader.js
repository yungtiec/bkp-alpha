import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../../../history";
import { ProjectSymbolBlueBox } from "../../../../../components";
import { getFullNameFromUserObject } from "../utils";

export default class SurveyHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    history.push("/project/" + this.props.projectMetadata.symbol);
  }

  render() {
    const { surveyMetadata, projectMetadata } = this.props;
    const creator = getFullNameFromUserObject(surveyMetadata.survey.creator);
    const collaborators = surveyMetadata.survey.collaborators
      .map((c, i) => {
        if (
          i === surveyMetadata.survey.collaborators.length - 1 &&
          surveyMetadata.survey.collaborators.length > 1
        )
          return ` and ${getFullNameFromUserObject(c)}`;
        else if (i === 0) return `with ${getFullNameFromUserObject(c)}`;
        else return `, ${getFullNameFromUserObject(c)}`;
      })
      .join("");

    return (
      <div className="project-survey__header">
        <p className="project-survey__back-btn" onClick={this.goBack}>
          back to project page
        </p>
        <ProjectSymbolBlueBox name={projectMetadata.name} />
        <p className="survey__title">{`${surveyMetadata.survey.title}`}</p>
        <p className="survey__subtitle  mb-4">
          {`disclosure created by ${creator} ${collaborators}`}
          <a href class="survey__request-btn ml-2">
            request editing right
          </a>
        </p>
      </div>
    );
  }
}

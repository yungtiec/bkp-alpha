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
    const creator = surveyMetadata.creator.name;
    const collaborators = surveyMetadata.collaborators
      .map((c, i) => {
        if (
          i === surveyMetadata.collaborators.length - 1 &&
          surveyMetadata.collaborators.length > 1
        )
          return ` and ${c.name}`;
        else if (i === 0) return `with ${c.name}`;
        else return `, ${c.name}`;
      })
      .join("");

    return (
      <div className="project-survey__header">
        <p className="project-survey__back-btn" onClick={this.goBack}>
          back to project page
        </p>
        <ProjectSymbolBlueBox name={projectMetadata.name} />
        <p className="survey__title">{`${surveyMetadata.title}`}</p>
        <p className="survey__subtitle  mb-4">
          {`disclosure created by ${creator} ${collaborators}`}
        </p>
      </div>
    );
  }
}

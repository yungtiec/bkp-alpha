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
    const creator = surveyMetadata.creator.displayName;
    const collaborators = surveyMetadata.collaborators
      .map((c, i) => {
        if (
          i === surveyMetadata.collaborators.length - 1 &&
          surveyMetadata.collaborators.length > 1
        )
          return ` and ${c.displayName}`;
        else if (i === 0) return `with ${c.displayName}`;
        else return `, ${c.displayName}`;
      })
      .join("");

    return (
      <div className="project-survey__header">
        <ProjectSymbolBlueBox name={projectMetadata.name} />
        <p className="survey__title">{`${surveyMetadata.title}`}</p>
        <p className="survey__subtitle  mb-4">
          {`disclosure created by ${creator} ${collaborators}`}
        </p>
      </div>
    );
  }
}

import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../../../../history";
import { ProjectSymbolBlueBox } from "../../../../../../components";
import VersionToolbar from "./VersionToolbar";
import { getFullNameFromUserObject } from "../../utils";

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
      surveyQnaIds,
      uploadMode,
      uploaded,
      resetUpload,
      uploadMarkdownToServer,
      userEmail
    } = this.props;
    const creator = getFullNameFromUserObject(surveyMetadata.creator);
    const collaborators = surveyMetadata.collaborators
      .map((c, i) => {
        if (
          i === surveyMetadata.collaborators.length - 1 &&
          surveyMetadata.collaborators.length > 1
        )
          return `and ${getFullNameFromUserObject(c)}`;
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
        <p className="survey-title">{`${surveyMetadata.title}`}</p>
        <p className="survey-subtitle">
          {`disclosure created by ${creator} ${collaborators}`}
        </p>
        <VersionToolbar
          resetUpload={resetUpload}
          uploadMarkdownToServer={uploadMarkdownToServer}
          uploaded={uploaded}
          uploadMode={uploadMode}
          projectMetadata={projectMetadata}
          surveyMetadata={surveyMetadata}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          userEmail={userEmail}
        />
      </div>
    );
  }
}

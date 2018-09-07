import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../history";
import { ProjectSymbolBlueBox } from "../../../components";

export default class DocumentHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    history.push("/project/" + this.props.projectMetadata.symbol);
  }

  render() {
    const {
      versionMetadata,
      documentMetadata,
      projectMetadata,
      isClosedForComment
    } = this.props;
    const creator = documentMetadata.creator.displayName;
    const collaborators = documentMetadata.collaborators
      .map((c, i) => {
        if (
          i === documentMetadata.collaborators.length - 1 &&
          documentMetadata.collaborators.length > 1
        )
          return ` and ${c.displayName}`;
        else if (i === 0) return `with ${c.displayName}`;
        else return `, ${c.displayName}`;
      })
      .join("");

    return (
      <div className="project-document__header">
        <ProjectSymbolBlueBox
          name={
            !isClosedForComment
              ? "public comment initiative"
              : "public comment (closed) - check back soon for updates"
          }
        />
        <p className="document__title">{`${documentMetadata.title}`}</p>
        <p className="document__subtitle  mb-4">
          {`version ${
            versionMetadata.version_number
          } created by ${creator} ${collaborators}`}
        </p>
      </div>
    );
  }
}

import "./DocumentContainer.scss";
import "./annotator.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  withRouter,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { maxBy } from "lodash";
import PropTypes from "prop-types";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import QueryVersionUpload from "./scenes/VersionUpload/QueryVersionUpload";
import QueryVersion from "./scenes/Version/QueryVersion";
import autoBind from "react-autobind";
import { DocumentHeader, VersionToolbar } from "./components";
import { VersionIssues, VersionProgress } from "./scenes/Version/components";
import history from "../../history";

class DocumentContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();
  }

  componentDidUpdate(prevProps) {
    const prevProjectSymbol = prevProps.match.url.split("/")[2];
    const nextProjectSymbol = this.props.match.url.split("/")[2];
    const prevDocumentId = prevProps.match.params.versionId;
    const nextDocumentId = this.props.match.params.versionId;
    if (
      prevProjectSymbol !== nextProjectSymbol ||
      prevDocumentId !== nextDocumentId
    ) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  render() {
    const {
      documentMetadata,
      latestVersionMetadata,
      versionMetadata,
      isClosedForComment,
      versionQnasById,
      versionQnaIds,
      upvoteDocument,
      downvoteDocument,
      match
    } = this.props;

    return (
      <div className="main-container">
        <DocumentHeader
          versionMetadata={latestVersionMetadata}
          documentMetadata={documentMetadata}
          projectMetadata={documentMetadata.project}
          isClosedForComment={isClosedForComment}
        />
        <VersionToolbar
          projectMetadata={documentMetadata.project}
          versionMetadata={versionMetadata}
          latestVersionMetadata={latestVersionMetadata}
          documentMetadata={documentMetadata}
          versionQnasById={versionQnasById}
          versionQnaIds={versionQnaIds}
          upvoteDocument={upvoteDocument}
          downvoteDocument={downvoteDocument}
        />
        <Switch>
          <Route
            path={`${match.path}/issues`}
            render={props => (
              <VersionIssues
                documentVersions={documentMetadata.versions}
                projectSymbol={documentMetadata.project.symbol}
              />
            )}
          />
          <Route
            path={`${match.path}/progress`}
            render={() => (
              <VersionProgress
                documentMetadata={documentMetadata}
                projectSymbol={documentMetadata.project.symbol}
              />
            )}
          />
          <Route
            path={`${match.path}/version/:versionId/upload`}
            render={props => <QueryVersionUpload />}
          />
          <Route
            path={`${match.path}/version/:versionId`}
            render={props => <QueryVersion />}
          />
          <Redirect to={`${match.path}/progress`} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(DocumentContainer);

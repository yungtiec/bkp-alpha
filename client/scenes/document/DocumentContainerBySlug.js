import "./DocumentContainer.scss";
import "./annotator.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  withRouter,
  route,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { maxBy } from "lodash";
import PropTypes from "prop-types";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import QueryVersionUpload from "./scenes/VersionUpload/QueryVersionUpload";
import QueryVersionBySlug from "./scenes/Version/QueryVersionBySlug";
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
    if (
      prevProps.match.url !== this.props.match.url
    ) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  render() {
    console.log('this.props', this.props);
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
            path={`${match.path}/upload`}
            render={props => <QueryVersionUpload latestVersionMetadata={latestVersionMetadata} />}
          />
          <Route
            path={`${match.path}`}
            render={props => <QueryVersionBySlug latestVersionMetadata={latestVersionMetadata} />}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(DocumentContainer);

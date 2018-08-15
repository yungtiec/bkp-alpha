import "./DocumentContainer.scss";
import "./annotator.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, route, Switch, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import QueryVersionUpload from "./scenes/VersionUpload/QueryVersionUpload";
import QueryVersion from "./scenes/Version/QueryVersion";
import autoBind from "react-autobind";

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

    return (
      <div className="main-container">
        <Switch>
          <Route
            path={`${this.props.match.path}/upload`}
            render={props => <QueryVersionUpload />}
          />
          <Route render={props => <QueryVersion />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(DocumentContainer);

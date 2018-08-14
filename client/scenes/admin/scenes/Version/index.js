import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchComments } from "./data/comments/actions";
import { getComments } from "./data/comments/reducer";

const LoadableVersionAdminView = Loadable({
  loader: () => import("./main"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let VersionAdminView = loaded.default;
    return <VersionAdminView {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchComments(this.props.match.params.versionId);
  }

  render() {
    return <LoadableVersionAdminView {...this.props} />;
  }
}

const mapState = state => {
  const { commentsById, commentIds } = getComments(state);
  return {
    commentsById,
    commentIds
  };
};

const actions = {
  fetchComments
};

export default withRouter(connect(mapState, actions)(MyComponent));

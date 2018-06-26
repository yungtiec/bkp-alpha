import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { batchActions } from "redux-batched-actions";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserComments } from "./data/actions";
import { getUserComments } from "./data/reducer";
import { fetchAllProjects } from "../../../../data/reducer";
import { getAllProjects, getProjectSurveys } from "../../../../data/reducer";

const LoadableUserComments = Loadable({
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
    let UserComments = loaded.default;
    return <UserComments {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const userId = this.props.match.path.split("/")[2];
    batchActions([
      this.props.fetchUserComments(userId),
      this.props.fetchAllProjects()
    ]);
  }

  render() {
    return <LoadableUserComments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { commentsById, commentIds } = getUserComments(state);
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  return {
    commentsById,
    commentIds,
    projectsBySymbol,
    projectSymbolArr,
    userId: ownProps.match.path.split("/")[2]
  };
};

const actions = {
  fetchUserComments,
  fetchAllProjects
};

export default withRouter(connect(mapState, actions)(MyComponent));

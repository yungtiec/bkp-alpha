import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchProjectBySymbol } from "./data/actions";
import { getAllProjectSurveys } from "./data/surveys/reducer";
import { getSelectedProject } from "./data/metadata/reducer";


const LoadableProject = Loadable({
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
    let Project = loaded.default;
    return <Project {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchProjectBySymbol(this.props.match.params.symbol);
  }

  render() {
    return <LoadableProject  {...this.props}/>;
  }
}

const mapState = state => {
  const { surveysById, surveyIds } = getAllProjectSurveys(state);
  return {
    surveysById,
    surveyIds,
    metadata: getSelectedProject(state)
  };
};

const actions = {
  fetchProjectBySymbol
};

export default connect(mapState, actions)(MyComponent);

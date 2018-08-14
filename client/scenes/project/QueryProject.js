import "./Project.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchProjectBySymbol } from "./data/actions";
import { getAllVersions } from "./data/documents/reducer";
import { getSelectedProject } from "./data/metadata/reducer";

const LoadableProject = Loadable.Map({
  loader: {
    project: () => import("./Project")
  },
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Project = loaded.project.default;
    return <Project {...props} loadedDocument={loaded.document} />;
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
    return <LoadableProject {...this.props} />;
  }
}

const mapState = state => {
  const { documentsById, documentIds } = getAllVersions(state);
  return {
    documentsById,
    documentIds,
    metadata: getSelectedProject(state)
  };
};

const actions = {
  fetchProjectBySymbol
};

export default connect(mapState, actions)(MyComponent);

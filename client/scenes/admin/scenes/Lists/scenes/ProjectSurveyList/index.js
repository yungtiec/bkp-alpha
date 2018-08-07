import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchLastestSurveysWithStats } from "../../../../../../data/reducer";
import { getSurveyListing } from "../../../../../../data/reducer";

const LoadableAdminProjectSurveyList = Loadable({
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
    let AdminProjectSurveyList = loaded.default;
    return <AdminProjectSurveyList {...props} />;
  },
  delay: 400
});

class MyComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    return <LoadableAdminProjectSurveyList {...this.props} />;
  }
}

const mapState = state => {
  const { surveysById, surveyIds } = getSurveyListing(state);
  return {
    surveysById,
    surveyIds
  };
};

const actions = dispatch => {
  return {
    loadInitialData() {
      dispatch(fetchLastestSurveysWithStats());
    }
  };
};

export default connect(mapState, actions)(MyComponent);

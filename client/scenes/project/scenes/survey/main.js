import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchQuestionsBySurveyId } from "./data/actions";
import {
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment
} from "./data/annotations/actions";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getSelectedSurvey } from "./data/metadata/reducer";
import { getAllAnnotations } from "./data/annotations/reducer";
import { getSelectedProject } from "../../data/metadata/reducer";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import { Survey } from "./components";
import autoBind from "react-autobind";

class SurveyContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchQuestionsBySurveyId({
      projectSymbol: this.props.match.url.split("/")[2],
      surveyId: this.props.match.params.surveyId
    });
    this.props.fetchAnnotationsBySurvey(
      `http://localhost:8000${this.props.match.url}`
    );
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();
  }

  componentDidUpdate(prevProps) {
    const prevProjectSymbol = prevProps.match.url.split("/")[2];
    const nextProjectSymbol = this.props.match.url.split("/")[2];
    const prevSurveyId = prevProps.match.params.surveyId;
    const nextSurveyId = this.props.match.params.surveyId;
    if (
      prevProjectSymbol !== nextProjectSymbol ||
      prevSurveyId !== nextSurveyId
    ) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  componentWillReceiveProps(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.surveyId;
    const nextSurveyId = nextProps.match.params.surveyId;
    if (
      prevProjectSymbol &&
      prevSurveyId &&
      (prevProjectSymbol !== nextProjectSymbol || prevSurveyId !== nextSurveyId)
    ) {
      this.props.fetchQuestionsBySurveyId({
        projectSymbol: nextProjectSymbol,
        surveyId: nextProps.match.params.surveyId
      });
      this.props.fetchAnnotationsBySurvey(
        `http://localhost:8000${nextProps.match.url}`
      );
    }
  }

  shouldComponentUpdate(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.surveyId;
    const nextSurveyId = nextProps.match.params.surveyId;
    if (
      this.props.width !== nextProps.width || // window resized
      this.props.isLoggedIn !== nextProps.isLoggedIn || // login event
      !this.props.surveyMetadata.id || // on init
      (prevProjectSymbol !== nextProjectSymbol ||
        prevSurveyId !== nextSurveyId) || // project_survey changed
      JSON.stringify(nextProps.annotationsById) !==
        JSON.stringify(this.props.annotationsById) // annotation changed
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (!this.props.surveyQnaIds.length) return "loading";
    return <Survey {...this.props} />;
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  const { annotationsById, annotationIds } = getAllAnnotations(state);
  const { width } = state.data.environment;
  return {
    isLoggedIn: !!state.data.user.id,
    myUserId: state.data.user.id,
    surveyQnasById,
    surveyQnaIds,
    surveyMetadata: getSelectedSurvey(state),
    projectMetadata: getSelectedProject(state),
    annotationsById,
    annotationIds,
    width
  };
};

const actions = {
  fetchQuestionsBySurveyId,
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment
};

export default withRouter(connect(mapState, actions)(SurveyContainer));

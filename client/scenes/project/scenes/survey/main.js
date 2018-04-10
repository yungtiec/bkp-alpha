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
import { toggleSidebar, sortAnnotationBy } from "./reducer";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getSelectedSurvey } from "./data/metadata/reducer";
import { getAllAnnotations } from "./data/annotations/reducer";
import { getSelectedProject } from "../../data/metadata/reducer";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import { Survey } from "./components";
import autoBind from "react-autobind";
import asyncPoll from "react-async-poll";



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

  render() {
    if (!this.props.surveyQnaIds.length) return "loading";
    return <Survey {...this.props} />;
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  const {
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds
  } = getAllAnnotations(state);
  const { width } = state.data.environment;
  const { sidebarOpen, sortBy } = state.scenes.project.scenes.survey;
  return {
    isLoggedIn: !!state.data.user.id,
    myUserId: state.data.user.id,
    surveyQnasById,
    surveyQnaIds,
    surveyMetadata: getSelectedSurvey(state),
    projectMetadata: getSelectedProject(state),
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds,
    width,
    sidebarOpen,
    sortBy
  };
};

const actions = {
  fetchQuestionsBySurveyId,
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment,
  toggleSidebar,
  sortAnnotationBy
};

const onPollInterval = (props, dispatch) => {
  return props.fetchAnnotationsBySurvey(
    `http://localhost:8000${props.match.url}`
  );
};

export default withRouter(
  connect(mapState, actions)(
    asyncPoll(60 * 1000, onPollInterval)(SurveyContainer)
  )
);

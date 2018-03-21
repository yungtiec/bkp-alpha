import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchQuestionsBySurveyId } from "./data/actions";
import { fetchAnnotationsBySurvey } from "./data/annotations/actions";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getSelectedSurvey } from "./data/metadata/reducer";
import { getAllAnnotations } from "./data/annotations/reducer";
import { getSelectedProject } from "../../data/metadata/reducer";
import { ListView, ListRow } from "../../components";
import { Qna, SurveyHeader, AnnotationSidebar, AnnotationItem } from "./components";
import autoBind from "react-autobind";

class Survey extends Component {
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
      `http://localhost:8080${this.props.match.url}`
    );
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
    }
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds
    } = this.props;
    if (!surveyQnaIds.length) return "loading";
    return (
      <div>
        <div className="project-survey">
          <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
          {surveyQnaIds.map(id => <Qna key={`qna-${id}`} qna={surveyQnasById[id]} />)}
        </div>
        <AnnotationSidebar>
           {annotationIds && annotationIds.map(id => <AnnotationItem key={`annotation-${id}`} annotation={annotationsById[id]} />)}
        </AnnotationSidebar>
      </div>
    );
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  const { annotationsById, annotationIds} = getAllAnnotations(state)
  return {
    surveyQnasById,
    surveyQnaIds,
    surveyMetadata: getSelectedSurvey(state),
    projectMetadata: getSelectedProject(state),
    annotationsById,
    annotationIds
  };
};

const actions = {
  fetchQuestionsBySurveyId,
  fetchAnnotationsBySurvey
};

export default withRouter(connect(mapState, actions)(Survey));

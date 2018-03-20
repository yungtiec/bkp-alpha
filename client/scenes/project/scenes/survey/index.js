import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchQuestionsBySurveyId } from "./data/actions";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getSelectedSurvey } from "./data/metadata/reducer";
import { getSelectedProject } from "../../data/metadata/reducer"
import { ListView, ListRow } from "../../components";
import { QnaBox, SurveyHeader } from "./components";
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
    const { surveyQnasById, surveyQnaIds, surveyMetadata, projectMetadata } = this.props;
    if (!surveyQnaIds.length) return "loading";
    return (
      <div className="project-survey">
        <SurveyHeader
          survey={surveyMetadata}
          project={projectMetadata}
        />
        {surveyQnaIds.map(id => <QnaBox key={id} qna={surveyQnasById[id]}/>)}
      </div>
    );
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  return {
    surveyQnasById,
    surveyQnaIds,
    surveyMetadata: getSelectedSurvey(state),
    projectMetadata: getSelectedProject(state)
  };
};

const actions = {
  fetchQuestionsBySurveyId
};

export default withRouter(connect(mapState, actions)(Survey));

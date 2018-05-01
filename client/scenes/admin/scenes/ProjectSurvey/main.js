import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import {
  fetchPendingAnnotations,
  verifyPendingAnnotation
} from "./data/pendingAnnotations/actions";
import { getPendingAnnotations } from "./data/pendingAnnotations/reducer";
import { Sidebar } from "./components";
import {
  requiresAuthorization,
  AnnotationMain,
  AnnotationReply
} from "../../../../components";
import history from "../../../../history";
import asyncPoll from "react-async-poll";

const onPollInterval = (props, dispatch) => {
  return props.fetchPendingAnnotations(props.match.params.projectSurveyId);
};

class AdminProjectSurveyPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  labelAsNotSpam(annotationId) {
    this.props.verifyPendingAnnotation(annotationId, "verified");
  }

  labelAsSpam(annotationId) {
    this.props.verifyPendingAnnotation(annotationId, "spam");
  }

  renderActions(annotation, path) {
    return (
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => this.labelAsSpam(annotation.id)}
        >
          spam
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => this.labelAsNotSpam(annotation.id)}
        >
          verify
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            history.push(
              `${path}/question/${annotation.survey_question_id}/annotation/${
                annotation.id
              }`
            )
          }
        >
          see in context
        </button>
      </div>
    );
  }

  render() {
    const { annotationsById, annotationIds } = this.props;

    return (
      <div className="admin-project-survey-panel">
        <Sidebar />
        <div class="admin-project-survey-panel__item-container">
          {annotationIds.map(aid => {
            const path = annotationsById[aid].uri.replace(
              window.location.origin,
              ""
            );
            return annotationsById[aid].parentId ? (
              <AnnotationReply
                key={`admin__annotation-reply--${aid}`}
                annotation={annotationsById[aid]}
                path={path}
              >
                {this.renderActions(annotationsById[aid], path)}
              </AnnotationReply>
            ) : (
              <AnnotationMain
                key={`admin__annotation-main--${aid}`}
                annotation={annotationsById[aid]}
                path={path}
              >
                {this.renderActions(annotationsById[aid], path)}
              </AnnotationMain>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { annotationsById, annotationIds } = ownProps;
  return {
    annotationsById,
    annotationIds
  };
};

const actions = {
  fetchPendingAnnotations,
  verifyPendingAnnotation
};

export default withRouter(
  connect(mapState, actions)(
    asyncPoll(60 * 1000, onPollInterval)(
      requiresAuthorization(AdminProjectSurveyPanel, "admin")
    )
  )
);

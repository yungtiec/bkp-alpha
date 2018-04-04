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
import {
  requiresAuthorization,
  AnnotationMain,
  AnnotationReply
} from "../../components";
import history from "../../history";

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchPendingAnnotations();
  }

  labelAsNotSpam(annotationId) {
    this.props.verifyPendingAnnotation(annotationId, "not_spam");
  }

  labelAsSpam(annotationId) {
    this.props.verifyPendingAnnotation(annotationId, "spam");
  }

  renderActions(annotation, path) {
    return (
      <div class="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          class="btn btn-outline-danger"
          onClick={() => this.labelAsSpam(annotation.id)}
        >
          spam
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={() => this.labelAsNotSpam(annotation.id)}
        >
          verify
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
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
      <div className="admin-subroute">
        {annotationIds.map(aid => {
          const path = annotationsById[aid].uri.replace(
            window.location.origin,
            ""
          );
          return annotationsById[aid].parentId ? (
            <AnnotationReply annotation={annotationsById[aid]} path={path}>
              {this.renderActions(annotationsById[aid], path)}
            </AnnotationReply>
          ) : (
            <AnnotationMain annotation={annotationsById[aid]} path={path}>
              {this.renderActions(annotationsById[aid], path)}
            </AnnotationMain>
          );
        })}
      </div>
    );
  }
}

const mapState = state => {
  const { annotationsById, annotationIds } = getPendingAnnotations(state);
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
  connect(mapState, actions)(requiresAuthorization(AdminPanel, "admin"))
);

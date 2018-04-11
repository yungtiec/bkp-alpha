import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import Question from "./Question";
import Answers from "./Answers";

class QnaBox extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    const { qna, match, isLoggedIn, pollData } = this.props;
    if (!this.annotation) {
      this.annotation = $(this[`qna-${qna.id}`]).annotator();
      this.annotation.annotator("addPlugin", "Store", {
        prefix: "/api/annotator",
        loadFromSearch: {
          uri: `http://localhost:8000${match.url}`,
          survey_question_id: qna.id
        },
        annotationData: {
          uri: `http://localhost:8000${match.url}`,
          survey_question_id: qna.id
        },
        urls: {
          create: "/store",
          update: "/update/:id",
          destroy: "/delete/:id",
          search: "/search/"
        }
      });
      this.annotation.annotator("addPlugin", "Tags");
    }
    $(`div[name="qna-${qna.id}"] .annotator-controls .annotator-save`).on(
      "click",
      event => {
        setTimeout(() => pollData(), 500);
      }
    );
    $(`div[name="qna-${qna.id}"] .annotator-item textarea`).on(
      "keydown",
      event => {
        if (event.which === 13) {
          setTimeout(() => {
            pollData();
          }, 500);
        }
      }
    );
  }

  componentDidUpdate() {
    /**
     * guest user cannot annotate
     * let's hide the annotatorjs widget
     */
    if (!this.props.isLoggedIn) {
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
      $(".annotator-adder").css("height", "0px");
    } else {
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
      $(".annotator-adder").css("height", "inherit");
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.surveyId;
    const nextSurveyId = nextProps.match.params.surveyId;
    const prevNumAnnotations = this.props.numAnnotations;
    const nextNumAnnotations = nextProps.numAnnotations;
    if (
      (prevProjectSymbol &&
        prevSurveyId &&
        (prevProjectSymbol !== nextProjectSymbol ||
          prevSurveyId !== nextSurveyId)) ||
      prevNumAnnotations !== nextNumAnnotations
    ) {
      this.annotation = $(this[`qna-${this.props.qna.id}`]).annotator();
    }
  }

  render() {
    const { qna } = this.props;

    return (
      <div className="qna__container" ref={el => (this[`qna-${qna.id}`] = el)}>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(QnaBox);

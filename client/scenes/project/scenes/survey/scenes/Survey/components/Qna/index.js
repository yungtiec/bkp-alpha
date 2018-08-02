import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import Question from "./Question";
import Answers from "./Answers";
import annotator from "annotator";
import { draw, undraw } from "../../../../../../../../annotator/highlight";
import history from "../../../../../../../../history";
import { isEmpty } from "lodash";

class QnaBox extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      temporaryHighlight: {}
    };
  }

  componentDidMount() {
    const self = this;
    if (!this.annotation) {
      const {
        qna,
        match,
        isLoggedIn,
        tagFilter,
        projectSurveyId
      } = this.props;
      var app = new annotator.App();
      var pageUri = function() {
        return {
          beforeAnnotationCreated: function(ann) {
            var temporaryHighlight = draw(self[`qna-${qna.id}`], ann);
            self.setState({
              temporaryHighlight
            });
            ann.uri = `${window.location.origin}${match.url}`;
            ann.survey_question_id = qna.id;
            ann.project_survey_id = projectSurveyId;
          },
          annotationCreated: function(ann) {
            undraw(self.state.temporaryHighlight);
            self.props.addNewCommentSentFromServer(ann);
          }
        };
      };
      app
        .include(annotator.ui.main, {
          element: this[`qna-${qna.id}`],
          editorExtensions: [
            annotator.ui.issue.editorExtension,
            annotator.ui.tags.editorExtension.bind(null, {
              class: "annotator__tag-container"
            })
          ]
        })
        .include(annotator.storage.http, {
          prefix: `${
            window.location.origin
          }/api/projects/-/surveys/${projectSurveyId}/annotator`,
          urls: {
            create: "/",
            update: "/update/:id",
            destroy: "/delete/:id",
            search: "/"
          }
        })
        .include(pageUri);
      app.start().then(function() {
        app.annotations.load({
          uri: `${window.location.origin}${match.url}`,
          project_survey_id: projectSurveyId,
          survey_question_id: qna.id
        });
      });
      this.annotator = app;
      $(".annotator__tag-container").tagsInput({
        autocomplete_url: "/api/tags/autocomplete",
        defaultText: "add tag(s)",
        height: "70px",
        width: "100%",
        interactive: true,
        delimiter: [" "]
      });
      $(".annotator-cancel").click(evt => {
        if (!isEmpty(self.state.temporaryHighlight))
          undraw(self.state.temporaryHighlight);
      });
    }
    if (!this.props.isLoggedIn || this.props.isClosedForComment) {
      $(".annotator-adder").css("display", "none");
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
      $(".annotator-adder").css("height", "0px");
    } else {
      $(".annotator-adder").css("display", "block");
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
      $(".annotator-adder").css("height", "inherit");
    }
  }

  componentDidUpdate() {
    /**
     * guest user cannot annotate
     * let's hide the annotatorjs widget
     */
    if (!this.props.isLoggedIn || this.props.isClosedForComment) {
      $(".annotator-adder").css("display", "none");
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
      $(".annotator-adder").css("height", "0px");
    } else {
      $(".annotator-adder").css("display", "block");
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
      $(".annotator-adder").css("height", "inherit");
    }
  }

  render() {
    const { qna } = this.props;

    return (
      <div
        className={qna.isDividerTitle ? "" : "mb-4"}
        ref={el => (this[`qna-${qna.id}`] = el)}
      >
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(QnaBox);

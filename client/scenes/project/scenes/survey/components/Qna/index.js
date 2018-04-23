import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import Question from "./Question";
import Answers from "./Answers";
import annotator from "annotator";
import { draw, undraw } from "../../../../../../annotator/highlight";
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
    var autocompleteTags = {};
    this.props.tags.forEach(t => (autocompleteTags[t.name] = t.name));
    if (!this.annotation) {
      const { qna, match, isLoggedIn, pollData, tagFilter } = this.props;
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
          },
          annotationCreated: function(ann) {
            undraw(self.state.temporaryHighlight);
            self.props.addNewAnnotationSentFromServer(ann);
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
          prefix: `${window.location.origin}/api/annotator`,
          urls: {
            create: "/store",
            update: "/update/:id",
            destroy: "/delete/:id",
            search: "/search/"
          }
        })
        .include(pageUri);
      app.start().then(function() {
        app.annotations.load({
          uri: `${window.location.origin}${match.url}`,
          survey_question_id: qna.id
        });
      });
      this.annotator = app;
      $(".annotator__tag-container").tagsInput({
        autocomplete_url: `/api/tag/autocomplete`,
        defaultText: "add tag(s)",
        height: "70px",
        width: "100%",
        interactive: true,
        'delimiter': [' '],
      });
      $(".annotator-cancel").click(evt => {
        if (!isEmpty(self.state.temporaryHighlight))
          undraw(self.state.temporaryHighlight);
      });
    }
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
    const nextTags = nextProps.tagFilter.map(tag => tag.value);
    const prevTags = this.props.tagFilter.map(tag => tag.value);
    if (
      (prevProjectSymbol &&
        prevSurveyId &&
        (prevProjectSymbol !== nextProjectSymbol ||
          prevSurveyId !== nextSurveyId)) ||
      prevNumAnnotations !== nextNumAnnotations
    ) {
      // this.annotation = $(this[`qna-${this.props.qna.id}`]).annotator();
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

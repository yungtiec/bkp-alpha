import React, { Component } from "react";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";
import { SquareLoader } from "halogenium";
import { Link, Switch, Route } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
  scroller
} from "react-scroll";
import { connect } from "react-redux";
import { SurveyContent, SurveyProgress } from "./components";
import {
  SidebarLayout,
  SidebarAnnotations,
  SidebarPageComments,
  SidebarHeader,
  SurveyHeader
} from "../../components";
import { findAnnotationsInQnaByText } from "../../utils";
import { CustomScrollbar } from "../../../../../../components";

class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount(nextProps) {
    this.focusOnContext();
  }

  focusOnContext() {
    const givenAnnotationContext =
      window.location.pathname.indexOf("/annotation/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    var annotationId, qnaId, pos, annotations;
    if (givenAnnotationContext && !this.props.sidebarContext.focusOnce) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      if (givenQnaContext) {
        pos = window.location.pathname.indexOf("/question/");
        qnaId = window.location.pathname.substring(pos).split("/")[2];
        scroller.scrollTo(`qna-${qnaId}`);
      }
      if (this.props.annotationsById[Number(annotationId)]) {
        this.props.updateSidebarContext({
          selectedAnnotationId: Number(annotationId),
          focusOnce: true
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.projectSurveyId;
    const nextSurveyId = nextProps.match.params.projectSurveyId;
    if (
      prevProjectSymbol &&
      prevSurveyId &&
      (prevProjectSymbol !== nextProjectSymbol || prevSurveyId !== nextSurveyId)
    ) {
      this.resetSidebarContext();
    }
  }

  componentWillUnmount() {
    this.resetSidebarContext();
  }

  resetSidebarContext() {
    this.props.updateSidebarContext({
      selectedText: "",
      selectedAnnotations: null,
      focusOnce: false,
      selectedAnnotationId: null
    });
  }

  annotationOnClick(evt, qnaId, answerId) {
    const selectedTextByUser = window.getSelection
      ? "" + window.getSelection()
      : document.selection.createRange().text;
    if (selectedTextByUser) return;
    if (!qnaId && !answerId) return;
    const selectedText = evt.target.innerHTML;
    const annotations = findAnnotationsInQnaByText({
      annotationIds: this.props.unfilteredAnnotationIds,
      annotationsById: this.props.annotationsById,
      text: selectedText,
      qnaId
    });
    if (!this.props.sidebarOpen && annotations && annotations.length) {
      this.props.toggleSidebar();
    }
    if (annotations && annotations.length) {
      this.props.updateSidebarContext({
        focusQnaId: qnaId,
        selectedText
      });
    }
  }

  getSelectedAnnotations() {
    const {
      sidebarContext,
      unfilteredAnnotationIds,
      annotationsById
    } = this.props;
    if (sidebarContext.selectedText)
      return findAnnotationsInQnaByText({
        annotationIds: unfilteredAnnotationIds,
        annotationsById: annotationsById,
        text: sidebarContext.selectedText,
        qnaId: sidebarContext.focusQnaId
      });
    else if (
      sidebarContext.selectedAnnotationId &&
      annotationsById[sidebarContext.selectedAnnotationId]
    )
      return [annotationsById[sidebarContext.selectedAnnotationId]];
    else return [];
  }

  resetContext() {
    this.props.updateSidebarContext({
      selectedText: "",
      focusQnaId: "",
      selectedAnnotationId: ""
    });
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds,
      unfilteredAnnotationIds,
      isLoggedIn,
      userEmail,
      match,
      width,
      annotationSortBy,
      sortAnnotationBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      addNewAnnotationSentFromServer,
      sidebarContext,
      annotationIssueFilter,
      updateIssueFilter,
      addNewComment
    } = this.props;

    const selectedAnnotations = this.getSelectedAnnotations();

    return (
      <div>
        <SurveyHeader
          userEmail={userEmail}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <Switch>
          <Route
            path={`${this.props.match.path}/progress`}
            render={() => <SurveyProgress surveyMetadata={surveyMetadata} />}
          />
          <Route
            render={() => (
              <SurveyContent
                parent={this}
                isLoggedIn={isLoggedIn}
                surveyQnasById={surveyQnasById}
                surveyQnaIds={surveyQnaIds}
                numAnnotations={annotationIds.length}
                surveyMetadata={surveyMetadata}
                tags={tags}
                tagFilter={tagFilter}
                annotationOnClick={this.annotationOnClick}
                addNewAnnotationSentFromServer={addNewAnnotationSentFromServer}
              />
            )}
          />
        </Switch>
        <SidebarLayout width={width} selectedAnnotations={selectedAnnotations}>
          <CustomScrollbar
            scrollbarContainerWidth={
              this.props.width < 767
                ? "350px"
                : this.props.width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 120px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <Element
              name="sidebar-contents"
              id="sidebar-contents"
              className="sidebar-contents"
            >
              <SidebarHeader
                annotationSortBy={annotationSortBy}
                sortAnnotationBy={sortAnnotationBy}
                annotationIds={annotationIds}
                selectedAnnotations={selectedAnnotations}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                isLoggedIn={isLoggedIn}
                resetSelection={this.resetContext}
                annotationIssueFilter={annotationIssueFilter}
                updateIssueFilter={updateIssueFilter}
                tags={tags}
                surveyMetadata={surveyMetadata}
                addNewComment={addNewComment}
              />
              <SidebarAnnotations
                annotationIds={annotationIds}
                annotationsById={annotationsById}
                selectedText={sidebarContext.selectedText}
                selectedAnnotations={selectedAnnotations}
                tags={tags}
                parent={this}
              />
            </Element>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(Survey);

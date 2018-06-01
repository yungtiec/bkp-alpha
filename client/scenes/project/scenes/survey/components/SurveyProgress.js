import "./annotator.scss";
import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { assignIn, pick, omit } from "lodash";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
  scroller
} from "react-scroll";
import {
  Qna,
  SurveyContent,
  AnnotationItem,
  Question,
  Answers,
  SidebarLayout,
  SidebarAnnotations,
  SidebarPageComments,
  SidebarHeader,
  SurveyHeader
} from "./index";
import { findAnnotationsInQnaByText } from "../utils";
import { CustomScrollbar } from "../../../../../components";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { getFullNameFromUserObject } from "./utils";
import { seeAnnotationContext } from "../../../../../utils";

export default class SurveyProgress extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      surveyMetadata,
      projectMetadata,
      surveyQnasById,
      surveyQnaIds,
      annotationsById,
      annotationIds,
      unfilteredAnnotationIds,
      isLoggedIn,
      match,
      width,
      annotationSortBy,
      engagementTab,
      sortAnnotationBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      updateEngagementTabInView,
      commentSortBy,
      sortCommentBy,
      commentIds,
      commentsById,
      projectSurveyId,
      sidebarContext,
      annotationIssueFilter,
      commentIssueFilter,
      updateIssueFilter
    } = this.props;

    return (
      <div>
        <div className="project-survey" id="project-survey">
          <SurveyHeader
            surveyQnasById={surveyQnasById}
            surveyQnaIds={surveyQnaIds}
            surveyMetadata={surveyMetadata}
            projectMetadata={projectMetadata}
          />
          <Timeline style={{ margin: 0, fontWeight: 400, fontSize: "14px" }}>
            {surveyMetadata.versions.map(verison => {
              const creator = getFullNameFromUserObject(verison.creator);
              const collaborators = verison.collaborators
                .map((c, i) => {
                  if (
                    i === verison.collaborators.length - 1 &&
                    verison.collaborators.length > 1
                  )
                    return `and ${getFullNameFromUserObject(c)}`;
                  else if (i === 0) return `${getFullNameFromUserObject(c)}`;
                  else return `, ${getFullNameFromUserObject(c)}`;
                })
                .join("");
              return (
                <TimelineEvent
                  title={`${creator} ${
                    verison.hierarchyLevel === 1 ? "created" : "updated"
                  } the disclosure${
                    collaborators.length
                      ? ` in collaboration with ${collaborators}.`
                      : "."
                  }`}
                  createdAt={moment(verison.createdAt).format("MMM DD, YYYY")}
                  icon={<i />}
                  iconColor="#2540CE"
                  container="card"
                  style={{
                    boxShadow: "none",
                    padding: 0
                  }}
                  cardHeaderStyle={{
                    backgroundColor: "transparent",
                    color: "inherit"
                  }}
                >
                  {verison.resolvedIssues.length ? (
                    <p>This version resolves the following issues:</p>
                  ) : null}
                  {verison.resolvedIssues.length ? (
                    <div className="entity-cards">
                      {verison.resolvedIssues.map(issue => {
                        const engagementItem =
                          issue.annotation || issue.project_survey_comment;
                        return (
                          <div
                            className="entity-card__container p-3"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              seeAnnotationContext(
                                assignIn(
                                  {
                                    project_survey: {
                                      id: surveyMetadata.id,
                                      project: {
                                        symbol: projectMetadata.symbol
                                      }
                                    }
                                  },
                                  engagementItem
                                )
                              )
                            }
                          >
                            {engagementItem.quote ? (
                              <div
                                style={{ borderLeft: "3px solid grey" }}
                                className="pl-3 mb-2"
                              >
                                {engagementItem.quote}
                              </div>
                            ) : null}
                            <div>{engagementItem.comment}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </TimelineEvent>
              );
            })}
          </Timeline>
        </div>
        <SidebarLayout width={width} selectedAnnotations={[]}>
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
                engagementTab={engagementTab}
                updateEngagementTabInView={updateEngagementTabInView}
                annotationSortBy={annotationSortBy}
                sortAnnotationBy={sortAnnotationBy}
                annotationIds={annotationIds}
                selectedAnnotations={[]}
                commentSortBy={commentSortBy}
                sortCommentBy={sortCommentBy}
                commentIds={commentIds}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                isLoggedIn={isLoggedIn}
                resetSelection={this.resetContext}
                selectedComment={""}
                annotationIssueFilter={annotationIssueFilter}
                commentIssueFilter={commentIssueFilter}
                updateIssueFilter={updateIssueFilter}
              />
              {engagementTab === "annotations" && (
                <SidebarAnnotations
                  engagementTab={engagementTab}
                  annotationIds={annotationIds}
                  annotationsById={annotationsById}
                  selectedText={""}
                  selectedAnnotations={[]}
                  parent={this}
                />
              )}
              {engagementTab === "comments" && (
                <SidebarPageComments
                  projectSurveyId={projectSurveyId}
                  engagementTab={engagementTab}
                  commentIds={commentIds}
                  commentsById={commentsById}
                  selectedComment={""}
                  parent={this}
                  tags={tags}
                />
              )}
            </Element>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

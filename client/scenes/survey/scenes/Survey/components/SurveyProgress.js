import React, { Component } from "react";
import moment from "moment";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { seeCommentContext } from "../../../../../utils";
import { assignIn } from "lodash";

export default ({ surveyMetadata, projectSymbol }) => (
  <div className="project-survey" id="project-survey">
    <Timeline style={{ margin: 0, fontWeight: 400, fontSize: "14px" }}>
      {surveyMetadata.versions.map(version => {
        const creator = version.creator.name;
        var collaborators = surveyMetadata.survey.collaborators.filter(
          sc =>
            sc.survey_collaborator.project_survey_version <=
              version.hierarchyLevel && sc.email !== version.creator.email
        );
        if (version.creator.email !== surveyMetadata.survey.creator.email)
          collaborators = collaborators.concat(surveyMetadata.survey.creator);
        collaborators = collaborators
          .map((c, i) => {
            if (i === collaborators.length - 1 && collaborators.length > 1)
              return ` and ${c.name}`;
            else if (i === 0) return `${c.name}`;
            else return `, ${c.name}`;
          })
          .join("");
        return (
          <TimelineEvent
            key={`timeline-event__${version.id}`}
            title={`${creator} ${
              version.hierarchyLevel === 1 ? "created" : "updated"
            } the disclosure${
              collaborators.length
                ? ` in collaboration with ${collaborators}.`
                : "."
            }`}
            createdAt={moment(version.createdAt).format("MMM DD, YYYY")}
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
            {version.resolvedIssues.length ? (
              <p>This version resolves the following issues:</p>
            ) : null}
            {version.resolvedIssues.length ? (
              <div className="entity-cards">
                {version.resolvedIssues.map(issue => {
                  const comment = issue.comment;
                  return (
                    <div
                      key={`resolved-issue__${issue.id}`}
                      className="entity-card__container p-3"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        seeCommentContext(
                          assignIn(
                            {
                              project_survey: {
                                id: comment.project_survey_id,
                                project: {
                                  symbol: projectSymbol
                                }
                              }
                            },
                            comment
                          )
                        )
                      }
                    >
                      {comment.quote ? (
                        <div
                          style={{ borderLeft: "3px solid grey" }}
                          className="pl-3 mb-2"
                        >
                          {comment.quote}
                        </div>
                      ) : null}
                      <div>{comment.comment}</div>
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
);

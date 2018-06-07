import React, { Component } from "react";
import moment from "moment";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { seeCommentContext } from "../../../../../../../utils";
import { getFullNameFromUserObject } from "../../../utils";

export default ({ surveyMetadata }) => (
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
                const comment = issue.comment;
                return (
                  <div
                    className="entity-card__container p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      seeCommentContext(
                        assignIn(
                          {
                            project_survey: {
                              id: surveyMetadata.id,
                              project: {
                                symbol: projectMetadata.symbol
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
);

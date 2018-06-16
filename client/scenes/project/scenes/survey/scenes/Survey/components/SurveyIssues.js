import React, { Component } from "react";
import moment from "moment";
import { seeCommentContext } from "../../../../../../../utils";
import { getFullNameFromUserObject } from "../../../utils";
import { assignIn } from "lodash";

export default ({ surveyVersions, projectSymbol }) => {
  return (
    <div className="project-survey" id="project-survey">
      {surveyVersions.map((v, i) => {
        const commentsWithIssue = v.comments.filter(
          c => c.issue && c.issue.open
        );
        return (
          <div key={`survey-issues__version-${i}`}>
            <p>
              Version {i + 1} - {v.survey.title}
            </p>
            {commentsWithIssue.length ? (
              <div className="entity-cards mb-4">
                {commentsWithIssue.map(c => (
                  <div
                    key={`outstanding-issue__${c.issue.id}`}
                    className="entity-card__container p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      seeCommentContext(
                        assignIn(
                          {
                            project_survey: {
                              id: v.id,
                              project: {
                                symbol: projectSymbol
                              }
                            }
                          },
                          c
                        )
                      )
                    }
                  >
                    {c.quote ? (
                      <div
                        style={{ borderLeft: "3px solid grey" }}
                        className="pl-3 mb-2"
                      >
                        {c.quote}
                      </div>
                    ) : null}
                    <div>{c.comment}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No outstanding issue</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

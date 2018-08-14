import React, { Component } from "react";
import moment from "moment";
import { seeCommentContext } from "../../../../../utils";
import { assignIn } from "lodash";

export default ({ documentVersions, projectSymbol }) => {
  return (
    <div className="project-document" id="project-document">
      {documentVersions.map((v, i) => {
        const commentsWithIssue = v.comments.filter(
          c => c.issue && c.issue.open
        );
        return (
          <div key={`document-issues__version-${i}`}>
            <p>
              Version {i + 1} - {v.document.title}
            </p>
            {commentsWithIssue.length ? (
              <div className="entity-cards mb-4">
                {commentsWithIssue.filter(c => c.reviewed !== "spam").map(c => (
                  <div
                    key={`outstanding-issue__${c.issue.id}`}
                    className="entity-card p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      seeCommentContext(
                        assignIn(
                          {
                            version: {
                              id: v.id,
                              document: {
                                project: {
                                  symbol: projectSymbol
                                }
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

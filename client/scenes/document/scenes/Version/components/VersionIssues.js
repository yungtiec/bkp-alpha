import React, { Component } from "react";
import moment from "moment";
import { seeCommentContext } from "../../../../../utils";
import { assignIn } from "lodash";

export default ({ documentVersions, projectSymbol }) => {
  return (
    <div className="project-document" id="project-document">
      {documentVersions.map(v => {
        const commentsWithIssue = v.comments.filter(
          c => c.issue && c.issue.open
        );
        return (
          <div key={`document-issues__version-${v.version_number}`}>
            <p>
              Version {v.version_number} - {v.document.title}
            </p>
            {commentsWithIssue.filter(c => c.reviewed !== "spam").length ? (
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
                                id: v.document.id,
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

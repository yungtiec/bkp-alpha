import React from "react";
import { ListRow } from "../../../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

export default (issueCommentId, issue) => {
  return (
    <ListRow className="entity-card" rowId={issueCommentId} onClick>
      <Link
        to={`/project/${issue.project_survey.project.symbol}/survey/${
          issue.project_survey.survey.id
        }/comment/${issue.id}`}
      >
        <div className="entity__block">
          <div className="entity__header">
            <div className="entity__title">
              <span>{issue.comment}</span>
            </div>
            <p className="entity__date">{`by ${issue.owner.name}`}</p>
          </div>
          <div className="entity__action--bottom">
            <div className="entity__metadata">
              <span>
                in{" "}
                {`${issue.project_survey.project.symbol} - ${
                  issue.project_survey.survey.title
                }`}
              </span>
            </div>
            <div className="entity__metadata">
              <span>{moment(issue.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      </Link>
    </ListRow>
  );
};

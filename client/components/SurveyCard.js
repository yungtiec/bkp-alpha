import React from "react";
import { ListRow } from "../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

export default (surveyId, survey) => {
  return (
    <ListRow className="entity-card" rowId={surveyId} onClick>
      <Link
        to={`/project/${survey.project_symbol ||
          (survey.project && survey.project.symbol)}/survey/${surveyId}`}
      >
        <div className="entity-custom">
          <div className="entity__block">
            <div className="entity__header">
              <div className="entity__title">
                <span>
                  {survey.project && survey.project.symbol
                    ? `${survey.project.name} - ${survey.title}`
                    : survey.title}
                </span>
                <span className="entity__ticker">
                  ({`v${survey.hierarchyLevel} `}
                  {`by ${survey.creator.first_name} ${
                    survey.creator.last_name
                  }`})
                </span>
              </div>
              <p className="entity__date">
                {moment(
                  survey.hierarchyLevel === 1
                    ? survey.createdAt
                    : survey.updatedAt
                ).format("MMM DD YYYY")}
              </p>
            </div>
            <div className="entity__description">{survey.description}</div>
            <div className="entity__action--bottom">
              <div className="entity__metrics-stat">
                <span>annotations ({survey.num_total_annotations || 0})</span>
              </div>
              <div className="entity__metrics-stat">
                <span>comments ({survey.num_total_page_comments || 0})</span>
              </div>
              <div className="entity__metrics-stat">
                <span>issues ({survey.num_issues || 0})</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ListRow>
  );
};

import React from "react";
import { ListRow } from "../../../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

export default (url, surveyId, survey) => {
  return (
    <ListRow className="entity-card" rowId={surveyId} onClick>
      <Link to={`${url}/survey/${surveyId}`}>
        <div className="entity-custom">
          <div className="entity__block">
            <div className="entity__header">
              <div  className="entity__title">
                <span>{survey.title}</span>
                <span className="entity__ticker">
                  ({`by ${survey.creator.first_name} ${
                    survey.creator.last_name
                  }`})
                </span>
              </div>
              <p className="entity__date">{moment(survey.createAt).format("MMM DD YYYY")}</p>
            </div>
            <div className="entity__description">{survey.description}</div>
            <div className="entity__action--bottom">
              <div className="entity__metrics-stat">
                <span>annotations ({survey.num_annotations})</span>
              </div>
              <div className="entity__metrics-stat">
                <span>comments ({survey.num_page_comments})</span>
              </div>
              <div className="entity__metrics-stat">
                <span>issues ({survey.num_issues})</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ListRow>
  );
};

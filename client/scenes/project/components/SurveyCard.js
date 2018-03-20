import React from "react";
import { ListRow } from "../../../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";

export default (url, surveyId, survey) => {
  return (
    <ListRow className="survey-container" rowId={surveyId} onClick>
      <div className="survey-custom">
        <div className="survey__block">
          <div className="survey__action--upper">
            <i className="fas fa-star" />
          </div>
          <div className="survey__header">
            <p>{survey.name}</p>
            <p className="survey__ticker">
              ({`created by ${survey.creator.first_name} ${
                survey.creator.last_name
              }`})
            </p>
          </div>
          <div className="survey__description">{survey.description}</div>
          <div className="survey__action--bottom">
            <Link to={`${url}/survey/${surveyId}`}>
              <div className="survey__more">
                read disclosures
                <i className="fas fa-long-arrow-alt-right" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ListRow>
  );
};

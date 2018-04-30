import React from "react";
import { ListRow } from "../../../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

export default (url, surveyId, survey) => {
  return (
    <ListRow className="survey-card" rowId={surveyId} onClick>
      <Link to={`${url}/survey/${surveyId}`}>
        <div className="survey-custom">
          <div className="survey__block">
            <div className="survey__header">
              <div>
                <span>{survey.title}</span>
                <span className="survey__ticker">
                  ({`by ${survey.creator.first_name} ${
                    survey.creator.last_name
                  }`})
                </span>
              </div>
              <p>{moment(survey.createAt).format("MMM DD YYYY")}</p>
            </div>
            <div className="survey__description">{survey.description}</div>
            <div className="survey__action--bottom">
              <div className="survey__metrics-stat">
                <span>annotation {survey.num_annotations}</span>
              </div>
              <div className="survey__metrics-stat">
                <span>comment {survey.num_page_comments}</span>
              </div>
              <div className="survey__metrics-stat">
                <span>issue {survey.num_issues}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ListRow>
  );
};

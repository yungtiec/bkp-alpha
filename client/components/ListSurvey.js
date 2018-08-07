import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItem } from "./index";

export default ({ surveyIds, surveysById }) => {
  return surveyIds.length ? (
    <div className="row entity-cards">
      {surveyIds.map(id => (
        <ListItem
          cardKey={id}
          cardHref={`/project/${surveysById[id].project_symbol ||
            (surveysById[id].project &&
              surveysById[id].project.symbol)}/survey/${
            surveysById[id].latest_project_survey
              ? surveysById[id].latest_project_survey.id
              : surveysById[id].project_surveys[0].id
          }`}
          mainTitle={
            surveysById[id].project && surveysById[id].project.symbol
              ? `${surveysById[id].project.name} - ${surveysById[id].title}`
              : surveysById[id].title
          }
          subtitle={`by ${surveysById[id].creator.name}`}
          textUpperRight={moment(
            surveysById[id].latest_project_survey
              ? surveysById[id].latest_project_survey.createdAt
              : surveysById[id].project_surveys[0].createdAt
          ).format("MMM DD YYYY")}
          mainText={surveysById[id].description || " "}
          tagArray={[
            `comments (${surveysById[id].num_total_comments || 0})`,
            `upvotes (${surveysById[id].num_upvotes || 0})`,
            `downvotes (${surveysById[id].num_downvotes || 0})`
          ]}
        />
      ))}
    </div>
  ) : null;
};

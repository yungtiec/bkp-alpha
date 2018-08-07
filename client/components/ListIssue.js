import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItem } from "./index";

export default ({ issueCommentIds, issuesByCommentId }) => {
  return issueCommentIds.length ? (
    <div className="row entity-cards">
      {issueCommentIds.map(id => (
        <ListItem
          cardKey={id}
          cardHref={`/project/${
            issuesByCommentId[id].project_survey.survey.project.symbol
          }/survey/${issuesByCommentId[id].project_survey.id}/comment/${
            issuesByCommentId[id].id
          }`}
          mainTitle={issuesByCommentId[id].comment}
          subtitle={""}
          textUpperRight={`by ${issuesByCommentId[id].owner.displayName}`}
          mainText={""}
          metadataArray={[
            `in ${
              issuesByCommentId[id].project_survey.survey.project.symbol
            } - ${issuesByCommentId[id].project_survey.survey.title}`,
            moment(issuesByCommentId[id].createdAt).fromNow()
          ]}
        />
      ))}
    </div>
  ) : null;
};

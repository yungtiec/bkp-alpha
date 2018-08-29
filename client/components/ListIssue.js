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
            issuesByCommentId[id].version.document.project.symbol
          }/document/-/version/${issuesByCommentId[id].version.id}/comment/${
            issuesByCommentId[id].id
          }`}
          quote={issuesByCommentId[id].quote}
          mainTitle={issuesByCommentId[id].comment}
          subtitle={""}
          textUpperRight={`by ${issuesByCommentId[id].owner.displayName}`}
          mainText={""}
          metadataArray={[
            `in ${issuesByCommentId[id].version.document.project.symbol} - ${
              issuesByCommentId[id].version.document.title
            }`,
            moment(issuesByCommentId[id].createdAt).fromNow()
          ]}
        />
      ))}
    </div>
  ) : null;
};

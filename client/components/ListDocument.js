import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItem } from "./index";

export default ({ documentIds, documentsById }) => {
  return documentIds.length ? (
    <div className="row entity-cards">
      {documentIds.map(id => (
        <ListItem
          key={id}
          cardHref={`/project/${documentsById[id].project_symbol ||
            (documentsById[id].project &&
              documentsById[id].project.symbol)}/document/${id}/version/${
            documentsById[id].latest_version
              ? documentsById[id].latest_version.id
              : documentsById[id].versions[0].id
          }`}
          mainTitle={
            documentsById[id].project && documentsById[id].project.symbol
              ? `${documentsById[id].project.name} - ${documentsById[id].title}`
              : documentsById[id].title
          }
          subtitle={`by ${documentsById[id].creator.name}`}
          textUpperRight={moment(
            documentsById[id].latest_version
              ? documentsById[id].latest_version.createdAt
              : documentsById[id].versions[0].createdAt
          ).format("MMM DD YYYY")}
          mainText={documentsById[id].description || " "}
          tagArray={[
            `comments (${documentsById[id].num_total_comments || 0})`,
            `upvotes (${documentsById[id].num_upvotes || 0})`,
            `downvotes (${documentsById[id].num_downvotes || 0})`
          ]}
        />
      ))}
    </div>
  ) : null;
};

import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItemGrid } from "./index";

const getLatestVersionDate = documentById => {
  if (documentById.latest_version) {
    const latestVersion = documentById.latest_version;
    documentById.versions.forEach(version => {
      if (version.id === latestVersion) return version.createdAt;
    });
  }
  return documentById.versions[0].createdAt;
};

const getLatestVersion = documentById => {
  if (documentById.latest_version) {
    return documentById.latest_version;
  }
  return documentById.versions;
};

export default ({ documentIds, documentsById }) => {
  return documentIds.length ? (
    <div className="row">
      {documentIds.map(id => {
        const document = documentsById[id];
        const latestVersion = getLatestVersion(document);
        const date = moment(getLatestVersionDate(document)).format(
          "MMM DD YYYY"
        );
        const creatorRole =
          document.creator &&
          document.creator.roles[0] &&
          document.creator.roles[0].name;
        var tagArray = [
          `comments (${document.num_total_comments || 0})`,
          `upvotes (${document.num_upvotes || 0})`,
          `downvotes (${document.num_downvotes || 0})`
        ];
        if (
          !creatorRole ||
          (creatorRole !== "admin" && creatorRole !== "project_admin")
        )
          tagArray.push(`community contribution`);

        return (
          <ListItemGrid
            key={id}
            cardHref={`/s/${document.versions[0].version_slug}`}
            mainTitle={document.title}
            subtitle={`by ${document.creator.name}`}
            textUpperRight={date}
            mainText={document.description || " "}
            tagArray={tagArray}
          />
        );
      })}
    </div>
  ) : null;
};

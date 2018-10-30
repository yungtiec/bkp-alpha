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
        console.log('doc', document);
        return (
          <ListItemGrid
            key={id}
            cardHref={`/project/${
              document.project.symbol
            }/document/${id}/version/${document.versions[0].id}
          `}
            mainTitle={
              document.project && document.project.symbol
                ? `${document.project.name} - ${document.title}`
                : document.title
            }
            subtitle={`by ${document.creator.name}`}
            textUpperRight={date}
            mainText={document.description || " "}
            tagArray={[
              `comments (${document.num_total_comments || 0})`,
              `upvotes (${document.num_upvotes || 0})`,
              `downvotes (${document.num_downvotes || 0})`
            ]}
          />
        );
      })}
    </div>
  ) : null;
};

import React, { Component, Fragment } from "react";
import { ListItem } from "../../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

const ListMyDocuments = ({ myDocumentIds, myDocumentsById }) =>
  myDocumentIds.length ? (
    <Fragment>
      {myDocumentIds.map(id => (
        <ListItem
          cardKey={id}
          cardHref=""
          mainTitle={myDocumentsById[id].title}
          subtitle={""}
          textUpperRight={moment(myDocumentsById[id].createdAt).fromNow()}
          mainText={""}
        />
      ))}
    </Fragment>
  ) : null;

export default ({ myDocumentsById, myDocumentIds, canLoadMore }) => (
  <div class="dashboard__recent-my-documents">
    {!myDocumentIds || !myDocumentsById ? (
      <div className="component__loader-container d-flex">
        <ScaleLoader
          className="component__loader"
          color="#2d4dd1"
          size="16px"
          margin="4px"
        />
      </div>
    ) : myDocumentIds && !myDocumentIds.length ? (
      <div className="component__loader-container d-flex">
        currently has no myDocument available
      </div>
    ) : (
      <ListMyDocuments
        myDocumentIds={myDocumentIds}
        myDocumentsById={myDocumentsById}
      />
    )}
    {canLoadMore ? (
      <a className="dashboard__show-more" onClick={fetchOwnDrafts}>
        <p>show more</p>
      </a>
    ) : null}
  </div>
);

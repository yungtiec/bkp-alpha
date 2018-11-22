import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnPublishedDocuments, canLoadMore } from "./data/reducer";
import { fetchOwnPublishedDocuments } from "./data/actions";
import { MyDocumentsList } from "../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

class PublishedDocuments extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchOwnPublishedDocuments();
  }

  render() {
    return (
      <MyDocumentsList
        myDocumentIds={this.props.publishedDocumentIds}
        myDocumentsById={this.props.publishedDocumentsById}
        canLoadMore={this.props.canLoadMore}
      />
    );
  }
}

const mapState = state => {
  const {
    publishedDocumentsById,
    publishedDocumentIds
  } = getOwnPublishedDocuments(state);
  return {
    publishedDocumentsById,
    publishedDocumentIds,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchOwnPublishedDocuments };

export default connect(
  mapState,
  actions
)(PublishedDocuments);

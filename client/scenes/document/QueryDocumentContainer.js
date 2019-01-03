import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { batchActions } from "redux-batched-actions";
import { getVersionMetadata } from "./data/versionMetadata/reducer";
import {
  getDocumentMetadata,
  getDocumentLatestVersion,
  isClosedForComment
} from "./data/documentMetadata/reducer";
import {
  fetchMetadataByDocumentId,
  upvoteDocument,
  downvoteDocument
} from "./data/documentMetadata/actions";
import { getAllDocumentQuestions } from "./data/versionQnas/reducer";
import { fetchLatestQuestionsByDocumentId } from "./data/versionQnas/actions";
import DocumentContainer from "./DocumentContainer";
import history from "../../history";

class QueryDocumentContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    batchActions([
      this.props.fetchMetadataByDocumentId(this.props.match.params.documentId),
      this.props.fetchLatestQuestionsByDocumentId(
        this.props.match.params.documentId
      )
    ]);
  }

  componentDidUpdate(prevProps) {
    const prevProjectSymbol = prevProps.match.params.symbol;
    const nextProjectSymbol = this.props.match.params.symbol;
    const prevDocumentId = prevProps.match.params.documentId;
    const nextDocumentId = this.props.match.params.documentId;
    if (
      prevProjectSymbol !== nextProjectSymbol ||
      prevDocumentId !== nextDocumentId
    ) {
      this.props.fetchMetadataByDocumentId(nextDocumentId);
    }
  }

  render() {
    console.log(this.props);
    if (!this.props.documentMetadata.id || !this.props.versionQnaIds)
      return null;
    return <DocumentContainer {...this.props} />;
  }
}

const mapState = state => {
  const { versionQnasById, versionQnaIds } = getAllDocumentQuestions(state);
  const { versionMetadata, versionMetadataLoading } = getVersionMetadata(state);
  return {
    versionQnasById,
    versionQnaIds,
    documentMetadata: getDocumentMetadata(state),
    latestVersionMetadata: getDocumentLatestVersion(state),
    versionMetadata,
    isClosedForComment: isClosedForComment(state)
  };
};

const actions = {
  fetchMetadataByDocumentId,
  fetchLatestQuestionsByDocumentId,
  upvoteDocument,
  downvoteDocument
};

export default withRouter(connect(mapState, actions)(QueryDocumentContainer));

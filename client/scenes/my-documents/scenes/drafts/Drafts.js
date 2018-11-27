import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnDrafts, canLoadMore } from "./data/reducer";
import { fetchOwnDrafts } from "./data/actions";
import { MyDocumentsList } from "../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

class Drafts extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchOwnDrafts();
  }

  render() {
    return (
      <MyDocumentsList
        myDocumentIds={this.props.draftIds}
        myDocumentsById={this.props.draftsById}
        canLoadMore={this.props.canLoadMore}
      />
    );
  }
}

const mapState = state => {
  const { draftsById, draftIds } = getOwnDrafts(state);
  return {
    draftsById,
    draftIds,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchOwnDrafts };

export default connect(
  mapState,
  actions
)(Drafts);

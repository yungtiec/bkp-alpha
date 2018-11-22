import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnDrafts, canLoadMore } from "./data/reducer";
import { fetchOwnDrafts } from "./data/actions";
import { ListItem } from "../../../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

const ListDraft = ({ draftIds, draftsById }) =>
  draftIds.length ? (
    <Fragment>
      {draftIds.map(id => (
        <ListItem
          cardKey={id}
          cardHref=""
          mainTitle={draftsById[id].title}
          subtitle={""}
          textUpperRight={moment(draftsById[id].createdAt).fromNow()}
          mainText={""}
        />
      ))}
    </Fragment>
  ) : null;

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
      <div class="dashboard__recent-drafts">
        {!this.props.draftIds || !this.props.draftsById ? (
          <div className="component__loader-container d-flex">
            <ScaleLoader
              className="component__loader"
              color="#2d4dd1"
              size="16px"
              margin="4px"
            />
          </div>
        ) : this.props.draftIds && !this.props.draftIds.length ? (
          <div className="component__loader-container d-flex">
            currently has no draft available
          </div>
        ) : (
          <ListDraft
            draftIds={this.props.draftIds}
            draftsById={this.props.draftsById}
          />
        )}
        {this.props.canLoadMore ? (
          <a
            className="dashboard__show-more"
            onClick={this.props.fetchOwnDrafts}
          >
            <p>show more</p>
          </a>
        ) : null}
      </div>
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

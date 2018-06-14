import React from "react";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";
import { connect } from "react-redux";

const ActionBar = ({
  user,
  projectMetadata,
  item,
  initReplyToThis,
  openModal,
  hasUpvoted,
  upvoteItem,
  labelAsSpam,
  labelAsNotSpam
}) => (
  <div className="comment-item__action--bottom">
    <PunditContainer policies={policies} user={user}>
      <PunditTypeSet type="Comment">
        <VisibleIf
          action="Verify"
          model={{ project: projectMetadata, comment: item }}
        >
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={labelAsSpam}
            >
              spam
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={labelAsNotSpam}
            >
              verify
            </button>
          </div>
        </VisibleIf>
        <VisibleIf
          action="Reviewed"
          model={{ project: projectMetadata, comment: item }}
        >
          <div className={`comment-item__verified-message`}>
            {item.reviewed}
          </div>
        </VisibleIf>
        <div>
          <VisibleIf
            action="Edit"
            model={{ project: projectMetadata, comment: item }}
          >
            <i className="fas fa-edit" onClick={openModal} />
          </VisibleIf>
          <i className="fas fa-reply" onClick={initReplyToThis} />
          <span className={`${hasUpvoted ? "upvoted" : ""}`}>
            <i className="fas fa-thumbs-up" onClick={upvoteItem} />
            {item.upvotesFrom ? item.upvotesFrom.length : 0}
          </span>
        </div>
      </PunditTypeSet>
    </PunditContainer>
  </div>
);

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  projectMetadata: state.scenes.project.data.metadata
});

export default connect(mapState, {})(ActionBar);

import React from "react";

export default ({
  item,
  thisUserEmail,
  initReplyToThis,
  openModal,
  hasUpvoted,
  upvoteItem,
  isAdmin,
  labelAsSpam,
  labelAsNotSpam
}) => (
  <div className="engagement-item__action--bottom">
    {isAdmin && item.reviewed === "pending" ? (
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
    ) : (
      <div className={`engagement-item__verified-message`}>
        {item.reviewed}
      </div>
    )}
    <div>
      {item.owner.email === thisUserEmail && (
        <i className="fas fa-edit" onClick={openModal} />
      )}
      <i className="fas fa-reply" onClick={initReplyToThis} />
      <span className={`${hasUpvoted ? "upvoted" : ""}`}>
        <i className="fas fa-thumbs-up" onClick={upvoteItem} />
        {item.upvotesFrom ? item.upvotesFrom.length : 0}
      </span>
    </div>
  </div>
);

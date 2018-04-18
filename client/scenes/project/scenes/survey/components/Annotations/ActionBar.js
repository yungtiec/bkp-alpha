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
  <div className="annotation-item__action--bottom">
    {isAdmin && item.reviewed === "pending" ? (
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => labelAsSpam(item.id)}
        >
          spam
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => labelAsNotSpam(item.id)}
        >
          verify
        </button>
      </div>
    ) : (
      <div className={`annotation-item__verified-message ${item.reviewed}`}>
        {item.reviewed === "verified" ? item.reviewed : ""}
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

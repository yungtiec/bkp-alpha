import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, VersionScorecard } from "./index";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { getSelectedDocument } from "../../../data/metadata/reducer";

const VersionContent = ({
  user,
  isLoggedIn,
  isClosedForComment,
  documentQnasById,
  documentQnaIds,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer,
  documentMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => (
  <div className="project-document" id="project-document">
    {documentMetadata.scorecard && !isEmpty(documentMetadata.scorecard) ? (
      <VersionScorecard
        scorecard={documentMetadata.scorecard}
        parent={parent}
        versionId={documentMetadata.id}
        isLoggedIn={isLoggedIn}
        isClosedForComment={isClosedForComment}
        addNewCommentSentFromServer={addNewCommentSentFromServer}
      />
    ) : null}
    {documentQnaIds.map((id, i) => {
      return (
        <Element
          name={`qna-${id}`}
          ref={el => (parent[`qna-${id}`] = el)}
          key={`qna-${documentQnasById[id].order_in_version}`}
        >
          <Qna
            key={`qna-${documentQnasById[id].order_in_version}`}
            qna={documentQnasById[id]}
            versionId={documentMetadata.id}
            isLoggedIn={isLoggedIn}
            isClosedForComment={isClosedForComment}
            tags={tags}
            tagFilter={tagFilter}
            addNewCommentSentFromServer={addNewCommentSentFromServer}
          >
            <Question
              key={`qna-${documentQnasById[id].order_in_version}__question`}
              qnaId={id}
              question={documentQnasById[id]}
              editQuestion={editQuestion}
              revertToPrevQuestion={revertToPrevQuestion}
              user={user}
              documentMetadata={documentMetadata}
              isDividerTitle={documentQnasById[id].isDividerTitle}
              handleCommentOnClick={commentOnClick}
            />
            <Answers
              key={`qna-${id}__answers`}
              qnaId={id}
              answer={documentQnasById[id].version_answers[0]}
              revertToPrevAnswer={revertToPrevAnswer}
              user={user}
              documentMetadata={documentMetadata}
              editAnswer={editAnswer}
              handleCommentOnClick={commentOnClick}
            />
          </Qna>
        </Element>
      );
    })}
  </div>
);

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user
});

export default connect(mapState, {})(VersionContent);

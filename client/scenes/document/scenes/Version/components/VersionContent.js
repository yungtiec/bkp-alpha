import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, VersionScorecard } from "./index";
import { isEmpty } from "lodash";
import { connect } from "react-redux";

const VersionContent = ({
  user,
  isLoggedIn,
  isClosedForComment,
  documentMetadata,
  documentQnasById,
  documentQnaIds,
  editScorecard,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer,
  versionMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => (
  <div className="project-document" id="project-document">
    {versionMetadata.scorecard && !isEmpty(versionMetadata.scorecard) ? (
      <VersionScorecard
        documentMetadata={documentMetadata}
        scorecard={versionMetadata.scorecard}
        editScorecard={editScorecard}
        parent={parent}
        versionId={versionMetadata.id}
        isLoggedIn={isLoggedIn}
        isClosedForComment={isClosedForComment}
        versionMetadata={versionMetadata}
        user={user}
      />
    ) : null}
    {documentQnaIds.map((id, i) => {
      return (
        <Element
          name={`qna-${id}`}
          ref={el => (parent[`qna-${id}`] = el)}
          key={`qna-${id}--${documentQnasById[id].order_in_version}`}
        >
          <Qna
            key={`qna-${id}--${documentQnasById[id].order_in_version}`}
            qna={documentQnasById[id]}
            versionId={versionMetadata.id}
            isLoggedIn={isLoggedIn}
            isClosedForComment={isClosedForComment}
            tags={tags}
            tagFilter={tagFilter}
            addNewCommentSentFromServer={addNewCommentSentFromServer}
          >
            <Question
              key={`qna-${documentQnasById[id].order_in_version}__question`}
              documentMetadata={documentMetadata}
              qnaId={id}
              question={documentQnasById[id]}
              editQuestion={editQuestion}
              revertToPrevQuestion={revertToPrevQuestion}
              user={user}
              versionMetadata={versionMetadata}
              isDividerTitle={documentQnasById[id].isDividerTitle}
              handleCommentOnClick={commentOnClick}
            />
            <Answers
              key={`qna-${id}__answers`}
              documentMetadata={documentMetadata}
              qnaId={id}
              answer={documentQnasById[id].version_answers[0]}
              revertToPrevAnswer={revertToPrevAnswer}
              user={user}
              versionMetadata={versionMetadata}
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

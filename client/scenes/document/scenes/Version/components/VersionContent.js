import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, VersionScorecard } from "./index";
import { isEmpty } from "lodash";

export default ({
  isLoggedIn,
  isClosedForComment,
  documentQnasById,
  documentQnaIds,
  editQuestion,
  editAnswer,
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
    {documentQnaIds.map(id => {
      return (
        <Element
          name={`qna-${id}`}
          ref={el => (parent[`qna-${id}`] = el)}
          key={`qna-${id}`}
        >
          <Qna
            key={`qna-${id}`}
            qna={documentQnasById[id]}
            versionId={documentMetadata.id}
            isLoggedIn={isLoggedIn}
            isClosedForComment={isClosedForComment}
            tags={tags}
            tagFilter={tagFilter}
            addNewCommentSentFromServer={addNewCommentSentFromServer}
          >
            <Question
              key={`qna-${id}__question`}
              qnaId={id}
              question={documentQnasById[id]}
              editQuestion={editQuestion}
              isDividerTitle={documentQnasById[id].isDividerTitle}
              handleCommentOnClick={commentOnClick}
            />
            <Answers
              key={`qna-${id}__answers`}
              qnaId={id}
              answer={documentQnasById[id].version_answers[0]}
              editAnswer={editAnswer}
              handleCommentOnClick={commentOnClick}
            />
          </Qna>
        </Element>
      );
    })}
  </div>
);

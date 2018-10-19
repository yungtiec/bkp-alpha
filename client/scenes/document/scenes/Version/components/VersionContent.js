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
  versionQnasById,
  versionQnaIds,
  editScorecard,
  editQuestion,
  editAnswer,
  toggleQuestionEditor,
  toggleAnswerEditor,
  revertToPrevQuestion,
  revertToPrevAnswer,
  versionMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => {
  return (
    <div className="project-document" id="project-document">
      {versionQnaIds.map((id, i) => {
        return (
          <Element
            name={`qna-${id}`}
            ref={el => (parent[`qna-${id}`] = el)}
            key={`qna-${versionQnasById[id].order_in_version}`}
          >
            <Qna
              key={`qna-${versionQnasById[id].order_in_version}`}
              qna={versionQnasById[id]}
              versionId={versionMetadata.id}
              isLoggedIn={isLoggedIn}
              isClosedForComment={isClosedForComment}
              tags={tags}
              tagFilter={tagFilter}
              addNewCommentSentFromServer={addNewCommentSentFromServer}
            >
              <Question
                key={`qna-${id}__question`}
                documentMetadata={documentMetadata}
                qnaId={id}
                question={versionQnasById[id]}
                editQuestion={editQuestion}
                toggleQuestionEditor={toggleQuestionEditor}
                revertToPrevQuestion={revertToPrevQuestion}
                user={user}
                versionMetadata={versionMetadata}
                isDividerTitle={versionQnasById[id].isDividerTitle}
                isBeingEdited={versionQnasById[id].isBeingEdited}
                handleCommentOnClick={commentOnClick}
              />
              {versionQnasById[id].markdown ===
              "### Consumer Token Framework Scorecard" &&
              versionMetadata.scorecard &&
              !isEmpty(versionMetadata.scorecard) ? (
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
              <Answers
                key={`qna-${versionQnasById[id].version_answers[0].id}__answers`}
                documentMetadata={documentMetadata}
                qnaId={id}
                answer={versionQnasById[id].version_answers[0]}
                revertToPrevAnswer={revertToPrevAnswer}
                user={user}
                versionMetadata={versionMetadata}
                editAnswer={editAnswer}
                toggleAnswerEditor={toggleAnswerEditor}
                isBeingEdited={versionQnasById[id].version_answers[0].isBeingEdited}
                handleCommentOnClick={commentOnClick}
              />
            </Qna>
          </Element>
        );
      })}
    </div>
  );
}

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user
});

export default connect(
  mapState,
  {}
)(VersionContent);

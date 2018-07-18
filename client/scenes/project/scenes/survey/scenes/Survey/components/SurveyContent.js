import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, SurveyScorecard } from "./index";

export default ({
  isLoggedIn,
  isClosedForComment,
  surveyQnasById,
  surveyQnaIds,
  numComments,
  surveyMetadata,
  commentOnClick,
  handlePollData,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => (
  <div className="project-survey" id="project-survey">
    <SurveyScorecard scorecard={surveyMetadata.scorecard} parent={parent} />
    {surveyQnaIds.map(id => {
      return (
        <Element
          name={`qna-${id}`}
          ref={el => (parent[`qna-${id}`] = el)}
          key={`qna-${id}`}
        >
          <Qna
            key={`qna-${id}`}
            qna={surveyQnasById[id]}
            projectSurveyId={surveyMetadata.id}
            isLoggedIn={isLoggedIn}
            isClosedForComment={isClosedForComment}
            pollData={handlePollData}
            numComments={numComments}
            tags={tags}
            tagFilter={tagFilter}
            addNewCommentSentFromServer={addNewCommentSentFromServer}
          >
            <Question
              key={`qna-${id}__question`}
              qnaId={id}
              question={surveyQnasById[id].question}
              handleCommentOnClick={commentOnClick}
            />
            <Answers
              key={`qna-${id}__answers`}
              qnaId={id}
              answers={surveyQnasById[id].project_survey_answers}
              handleCommentOnClick={commentOnClick}
            />
          </Qna>
        </Element>
      );
    })}
  </div>
);

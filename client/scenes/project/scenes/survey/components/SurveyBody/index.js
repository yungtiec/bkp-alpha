import React, { Component } from "react";
import { Element } from "react-scroll";
import autoBind from "react-autobind";
import { Qna, Question, Answers } from "../index";
import SurveyHeader from "./SurveyHeader";

export default ({
  isLoggedIn,
  surveyQnasById,
  surveyQnaIds,
  numAnnotations,
  surveyMetadata,
  projectMetadata,
  annotationOnClick,
  handlePollData,
  parent,
  tags,
  tagFilter,
  addNewAnnotationSentFromServer
}) => (
  <div className="project-survey" id="project-survey">
    <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
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
            isLoggedIn={isLoggedIn}
            pollData={handlePollData}
            numAnnotations={numAnnotations}
            tags={tags}
            tagFilter={tagFilter}
            addNewAnnotationSentFromServer={addNewAnnotationSentFromServer}
          >
            <Question
              key={`qna-${id}__question`}
              qnaId={id}
              question={surveyQnasById[id].question}
              handleAnnotationOnClick={annotationOnClick}
            />
            <Answers
              key={`qna-${id}__answers`}
              qnaId={id}
              answers={surveyQnasById[id].project_survey_answers}
              handleAnnotationOnClick={annotationOnClick}
            />
          </Qna>
        </Element>
      );
    })}
  </div>
);

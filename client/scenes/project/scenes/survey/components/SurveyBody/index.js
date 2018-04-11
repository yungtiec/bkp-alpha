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
  tagFilter
}) => (
  <div className="project-survey" id="project-survey">
    <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
    {surveyQnaIds.map(id => {
      return (
        <Element name={`qna-${id}`} ref={el => (parent[`qna-${id}`] = el)}>
          <Qna
            key={`qna-${id}`}
            qna={surveyQnasById[id]}
            isLoggedIn={isLoggedIn}
            pollData={handlePollData}
            numAnnotations={numAnnotations}
            tagFilter={tagFilter}
          >
            <Question
              qnaId={id}
              question={surveyQnasById[id].question}
              handleAnnotationOnClick={annotationOnClick}
            />
            <Answers
              qnaId={id}
              answers={surveyQnasById[id].survey_answers}
              handleAnnotationOnClick={annotationOnClick}
            />
          </Qna>
        </Element>
      );
    })}
  </div>
);

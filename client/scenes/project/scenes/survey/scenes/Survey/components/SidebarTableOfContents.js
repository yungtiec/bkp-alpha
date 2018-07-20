import React, { Component } from "react";
import { Link as ScrollLink, Element } from "react-scroll";

export default ({ surveyQnasById, surveyQnaIds }) => (
  <div className="d-flex flex-direction sidebar-contents">
    <p>Table of Contents</p>
    {surveyQnaIds.map(id => (
      <ScrollLink
        key={`table-of-content__scrolllink-${id}`}
        className={
          surveyQnasById[id].isDividerTitle
            ? "table-of-content__divider-title"
            : "table-of-content__section-title"
        }
        activeClass="active"
        to={`qna-${id}`}
        smooth="easeInOutCubic"
        duration={300}
        spy={true}
      >
        {surveyQnasById[id].question.markdown.replace("### ", "")}
      </ScrollLink>
    ))}
  </div>
);

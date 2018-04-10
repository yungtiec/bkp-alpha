import React, { Component } from "react";
import autoBind from "react-autobind";
import AnnotationItem from "./AnnotationItem"
import {
  Link as ScrollLink,
  Element
} from "react-scroll";

export default ({
  annotationIds,
  annotationsById,
  selectedText,
  selectedAnnotations,
  parent
}) => {
  if (
    annotationIds &&
    selectedText &&
    selectedAnnotations &&
    selectedAnnotations.length
  ) {
    return renderSidebarWithSelectedText(selectedAnnotations);
  }
  if (
    (annotationIds && !selectedText) ||
    (annotationIds &&
      selectedText &&
      (!selectedAnnotations ||
        (selectedAnnotations && !selectedAnnotations.length)))
  ) {
    return renderSidebarWithAllAnnotations({
      annotationIds,
      annotationsById,
      selectedText,
      parent
    });
  }
};

function renderSidebarWithSelectedText(annotations) {
  return (
    <div>
      {annotations.map(annotation => (
        <AnnotationItem
          key={`annotation-${annotation.id}`}
          annotation={annotation}
        />
      ))}
    </div>
  );
}

function renderSidebarWithAllAnnotations({
  annotationIds,
  annotationsById,
  selectedText,
  parent
}) {
  return annotationIds.map(id => (
    <Element name={`annotation-${id}`}>
      <ScrollLink
        className={`annotation-${id}`}
        activeClass="active"
        to={`qna-${annotationsById[id].survey_question_id}`}
        smooth="easeInOutCubic"
        duration={300}
        spy={true}
      >
        <AnnotationItem
          key={`annotation-${id}`}
          annotation={annotationsById[id]}
          ref={el => (parent[`annotation-${id}`] = el)}
        />
      </ScrollLink>
    </Element>
  ));
}

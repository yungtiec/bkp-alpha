import React, { Component } from "react";
import autoBind from "react-autobind";
import { CustomScrollbar } from "../../../../../components";
import { AnnotationItem, SidebarLayout, UploadInterface } from "./index";

class SurveyUpload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds,
      unfilteredAnnotationIds,
      isLoggedIn,
      match,
      width,
      commentIds,
      commentsById,
      projectSurveyId
    } = this.props;

    return (
      <div>
        <UploadInterface
          isLoggedIn={isLoggedIn}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <SidebarLayout width={width} hideEngagementTabs={true}>
          <CustomScrollbar
            scrollbarContainerWidth={
              width < 767 ? "350px" : width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 120px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            hi
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default SurveyUpload;

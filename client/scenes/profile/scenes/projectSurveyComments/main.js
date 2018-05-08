import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { groupBy, keys, isEmpty } from "lodash";
import moment from "moment";
import Select from "react-select";
import { ProfileSidebar, ProfileEngagementItems } from "../../components";
import {
  updatePageLimit,
  updatePageOffset,
  updatePageProjectFilter,
  updatePageSurveyFilter,
  checkSidebarFilter
} from "./data/actions";
import { ProjectSymbolBlueBox } from "../../../../components";
import history from "../../../../history";

class ProfileProjectSurveyComments extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleProjectSelectChange(selected) {
    this.props.updatePageProjectFilter(this.props.userId, selected);
  }

  handlePageClick(page) {
    this.props.updatePageOffset(this.props.userId, page.selected);
  }

  render() {
    const {
      projectSurveyCommentsById,
      projectSurveyCommentIds,
      projectsBySymbol,
      projectSymbolArr,
      projectSurveysById,
      projectSurveyIds,
      pageCount,
      pageLimit,
      pageOffset,
      pageProjectFilter,
      pageSurveyFilter,
      checked,
      checkSidebarFilter,
      userId
    } = this.props;

    const checkSidebarFilterBound = checkSidebarFilter.bind(null, userId);

    return (
      <div className="profile-engagement-items__container main-container">
        <ProfileSidebar
          checked={checked}
          checkSidebarFilter={checkSidebarFilterBound}
          nodes={[
            {
              value: "status",
              label: "STATUS",
              children: [
                { value: "verified", label: "Verified" },
                { value: "spam", label: "Spam" },
                { value: "pending", label: "Pending" }
              ]
            },
            {
              value: "issue",
              label: "ISSUE",
              children: [
                { value: "open", label: "Open" },
                { value: "close", label: "Close" }
              ]
            }
          ]}
        >
          <span>FILTER BY PROJECT(S)</span>
          <Select
            name="profile-project-survey-comment__project-select"
            multi={true}
            value={pageProjectFilter}
            onChange={this.handleProjectSelectChange}
            options={projectSymbolArr.map(symbol => ({
              label: projectsBySymbol[symbol].name.toUpperCase(),
              value: projectsBySymbol[symbol].id
            }))}
          />
        </ProfileSidebar>
        <div className="d-flex flex-column profile-enagement-items">
          <ProfileEngagementItems
            engagementItemsById={projectSurveyCommentsById}
            engagementItemIds={projectSurveyCommentIds}
          />
          {projectSurveyCommentIds.length && pageCount > 1 ? (
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={<a href="">...</a>}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    pageLimit,
    pageOffset,
    pageCount,
    pageProjectFilter,
    pageSurveyFilter,
    checked
  } = state.scenes.profile.scenes.projectSurveyComments.data;
  return {
    ...ownProps,
    pageLimit,
    pageOffset,
    pageCount,
    pageProjectFilter,
    pageSurveyFilter,
    checked
  };
};

const actions = {
  checkSidebarFilter,
  updatePageProjectFilter,
  updatePageOffset
};

export default connect(mapState, actions)(ProfileProjectSurveyComments);

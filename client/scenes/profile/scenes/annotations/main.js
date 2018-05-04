import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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

class ProfileAnnotations extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleProjectSelectChange(selected) {
    this.props.updatePageProjectFilter(selected);
  }

  render() {
    const {
      annotationsById,
      annotationIds,
      projectsBySymbol,
      projectSymbolArr,
      projectSurveysById,
      projectSurveyIds,
      pageLimit,
      pageOffset,
      pageProjectFilter,
      pageSurveyFilter,
      checked,
      checkSidebarFilter
    } = this.props;

    return (
      <div className="profile-engagement-items__container main-container">
        <ProfileSidebar
          checked={checked}
          checkSidebarFilter={checkSidebarFilter}
          nodes={[
            {
              value: "status",
              label: "STATUS",
              children: [
                { value: "verified", label: "Verified" },
                { value: "spam", label: "Spam" },
                { value: "pending", label: "Pending" }
              ]
            }
          ]}
        >
          <span>FILTER BY PROJECT(S)</span>
          <Select
            name="profile-annotations__project-select"
            multi={true}
            value={pageProjectFilter}
            onChange={this.handleProjectSelectChange}
            options={projectSymbolArr.map(symbol => ({
              label: projectsBySymbol[symbol].name.toUpperCase(),
              value: projectsBySymbol[symbol].id
            }))}
          />
        </ProfileSidebar>
        <ProfileEngagementItems
          engagementItemsById={annotationsById}
          engagementItemIds={annotationIds}
        />
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    pageLimit,
    pageOffset,
    pageProjectFilter,
    pageSurveyFilter,
    checked
  } = state.scenes.profile.scenes.annotations.data;
  return {
    ...ownProps,
    pageLimit,
    pageOffset,
    pageProjectFilter,
    pageSurveyFilter,
    checked
  };
};

const actions = {
  checkSidebarFilter,
  updatePageProjectFilter
};

export default connect(mapState, actions)(ProfileAnnotations);

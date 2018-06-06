import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ProfileBanner, ProfileNavbar, ProfileReplies } from "./components";
import ProfileAbout from "./scenes/about";
import ProfileAnnotations from "./scenes/annotations";
import Notifications from "./scenes/notifications";
import autoBind from "react-autobind";
import moment from "moment";
import history from "../../history";
import {
  fetchUserBasicInfo,
  changeAccessStatus
} from "./scenes/about/data/actions";
import { getUserBasicInfo } from "./scenes/about/data/reducer";
import { currentUserIsAdmin } from "../../data/reducer";

class Profile extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      this.props.fetchUserBasicInfo(nextProps.match.params.userId);
    }
  }

  restrictAccess() {
    this.props.changeAccessStatus({
      userId: this.props.match.params.userId,
      accessStatus: "restricted"
    });
  }

  restoreAccess() {
    this.props.changeAccessStatus({
      userId: this.props.match.params.userId,
      accessStatus: "restore"
    });
  }

  render() {
    const { basicInfo, match, isAdmin, myUserId } = this.props;
    const activeTab = window.location.pathname.split("/")[3];
    const isMyProfile =
      match.params.userId === "profile" || match.params.userId === myUserId;

    return (
      <div className="profile-container">
        <ProfileBanner
          name={`${basicInfo.first_name} ${basicInfo.last_name}`}
          isAdmin={isAdmin}
          restrictedAccess={basicInfo.restricted_access}
          numAnnotations={basicInfo.num_annotations}
          numProjectSurveyComments={basicInfo.num_project_survey_comments}
          numIssues={basicInfo.num_issues}
          joinDate={moment(basicInfo.createdAt).format("MMM YYYY")}
          restrictAccess={this.restrictAccess}
          restoreAccess={this.restoreAccess}
        />
        <ProfileNavbar
          activeTab={activeTab}
          url={match.url}
          isMyProfile={isMyProfile}
        />
        <Switch>
          <Route
            path={`${match.url}/about`}
            render={props => <ProfileAbout {...basicInfo} {...props} />}
          />
          <Route
            path={`${match.url}/annotations`}
            component={ProfileAnnotations}
          />
          {isMyProfile && (
            <Route
              path={`${match.url}/notifications`}
              component={Notifications}
            />
          )}
          <Redirect from="/" exact to="/about" />
        </Switch>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { basicInfo } = ownProps;
  const isAdmin = currentUserIsAdmin(state);
  return {
    basicInfo,
    isAdmin,
    myUserId: state.data.user && state.data.user.id
  };
};

const actions = {
  fetchUserBasicInfo,
  changeAccessStatus
};

export default withRouter(connect(mapState, actions)(Profile));

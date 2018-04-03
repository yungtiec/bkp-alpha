import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { Projects, Project, Profile } from "./scenes";
import {
  Login,
  Signup,
  Layout,
  LayoutWithNav,
  RouteWithLayout
} from "./components";
import { me, initEnvironment } from "./data/reducer";
import Loadable from "react-loadable";
import path from "path";

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <RouteWithLayout layout={Layout} path="/login" component={Login} />
          <RouteWithLayout layout={Layout} path="/signup" component={Signup} />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/projects"
            component={Projects}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/project/:symbol"
            component={Project}
          />
          {isLoggedIn && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <RouteWithLayout
                layout={LayoutWithNav}
                path="/profile"
                component={Profile}
              />
            </Switch>
          )}
          {/* Displays our Login component as a fallback */}
          <Route component={Login} />
        </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  const { height, isMobile, width } = state.data.environment;
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.data.user.id,
    height,
    isMobile,
    width
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
      dispatch(initEnvironment());
    }
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

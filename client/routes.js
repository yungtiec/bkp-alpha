import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { Projects, Project, Profile, Admin, Unauthorized } from "./scenes";
import {
  Login,
  Signup,
  Layout,
  LayoutWithNav,
  RouteWithLayout
} from "./components";
import { me, initEnvironment } from "./data/reducer";

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
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/unauthorized"
            component={Unauthorized}
          />
          {/* Displays our Login component as a fallback */}
          <Route exact path="/" component={Login} />
          <Route component={Login} />
          {isLoggedIn && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <RouteWithLayout
                layout={LayoutWithNav}
                path="/profile"
                component={Profile}
              />
              <RouteWithLayout
                layout={LayoutWithNav}
                path="/admin"
                component={Admin}
              />
            </Switch>
          )}

        </Switch>
      </div>
    );
  }
}

const mapState = state => {
  const { height, isMobile, width } = state.data.environment;
  return {
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

export default withRouter(connect(mapState, mapDispatch)(Routes));

Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  initEnvironment: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

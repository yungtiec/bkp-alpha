import React, { Component } from "react";
import { Navbar, ModalContainer, Scrollbar } from "./components";
import Routes from "./routes";
import NotificationsSystem from "reapop";
import theme from "reapop-theme-wybo";
import history from "./history";
import ReactGA from "react-ga";
const isProduction = process.env.NODE_ENV === "production";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isProduction) {
      ReactGA.initialize("UA-119328185-1", {
        titleCase: false
      });
      history.listen((location, action) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
      });
    }
  }

  render() {
    return (
      <div>
        <Routes />
        <ModalContainer />
        <NotificationsSystem theme={theme} />
      </div>
    );
  }
}

export default App;

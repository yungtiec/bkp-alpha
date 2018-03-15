import $ from "jquery";
import "normalize.css";
import "bootstrap/dist/css/bootstrap.css";
import "Tether";
import "bootstrap/dist/js/bootstrap.min.js";
import './annotator/annotator.min.css'
import './annotator/annotator-full.min.js'
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./history";
import store from "./store";
import App from "./app";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);

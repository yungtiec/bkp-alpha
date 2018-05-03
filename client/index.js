import $ from "jquery";
import "jquery-ui/ui/widgets/autocomplete.js"
import "jquery-ui/themes/base/all.css";
import "./annotator/jquery.tagsinput.min.js";
import "./annotator/jquery.tagsinput.min.css";
import "normalize.css";
import "react-select/dist/react-select.css";
import "bootstrap/dist/css/bootstrap.css";
import "Tether";
import "bootstrap/dist/js/bootstrap.min.js";
import "./react-checkbox-tree.scss";
import "./index.scss";
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

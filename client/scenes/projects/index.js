import React, { Component } from "react";
import Loadable from "react-loadable";
import { LoadingScreen } from "../../components";

const LoadableProjects = Loadable({
  loader: () => import("./main"),
  loading: LoadingScreen,
  serverSideRequirePath: "/"
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableProjects/>;
  }
}

import React, { Component } from "react";
import Loadable from "react-loadable";
import { LoadingScreen } from "../../components";

const LoadableProject = Loadable({
  loader: () => import("./main"),
  loading: LoadingScreen,
  serverSideRequirePath: "/"
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableProject/>;
  }
}

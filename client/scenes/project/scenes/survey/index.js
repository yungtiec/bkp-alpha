import React, { Component } from "react";
import Loadable from "react-loadable";
import { LoadingScreen } from "../../../../components";

const LoadableSurvey = Loadable({
  loader: () => import("./main"),
  loading: LoadingScreen,
  delay: 1000
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableSurvey />;
  }
}

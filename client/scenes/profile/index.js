import React, { Component } from "react";
import Loadable from "react-loadable";

function MyLoadingComponent() {
  return <div>Loading...</div>;
}

const LoadableProfile = Loadable({
  loader: () => import("./main"),
  loading: MyLoadingComponent,
  serverSideRequirePath: "/"
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableProfile/>;
  }
}

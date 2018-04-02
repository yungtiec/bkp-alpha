import React, { Component } from "react";
import Loadable from "react-loadable";

function MyLoadingComponent() {
  return <div>Loading...</div>;
}

const LoadableProjects = Loadable({
  loader: () => import("./main"),
  loading: MyLoadingComponent,
  serverSideRequirePath: "/"
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableProjects/>;
  }
}

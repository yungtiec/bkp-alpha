import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

export default class TestArticle extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    const annotation = $(this.article).annotator();
    annotation.annotator("addPlugin", "Store", {
      prefix: "/api/annotation",
      loadFromSearch: {
        uri: "http://localhost:8080/home",
        limit: 20,
      },
      annotationData: {
        uri: "http://localhost:8080/home",
        item_id: "1"
      },
      urls: {
        create: "/store",
        update: "/update/:id",
        destroy: "/delete/:id",
        search: "/search/1"
      }
    });
  }

  render() {
    return (
      <div ref={el => (this.article = el)}>
        <h1 className="bd-title" id="content">
          Overview
        </h1>
        <p>
          Containers are the most basic layout element in Bootstrap and are
          required when using our default grid system. Choose from a responsive,
          fixed-width container (meaning its max-width changes at each
          breakpoint) or fluid-width (meaning it’s 100% wide all the time).
        </p>
        <p className="bd-lead">
          Components and options for laying out your Bootstrap project,
          including wrapping containers, a powerful grid system, a flexible
          media object, and responsive utility classes.
        </p>
        <h2 id="containers">
          <div>Containers</div>
        </h2>
        <p>
          Containers are the most basic layout element in Bootstrap and are
          required when using our default grid system. Choose from a responsive,
          fixed-width container (meaning its max-width changes at each
          breakpoint) or fluid-width (meaning it’s 100% wide all the time).
        </p>
        <p>
          While containers <em>can</em> be nested, most layouts do not require a
          nested container.
        </p>
        <p>
          Use <code className="highlighter-rouge">.container-fluid</code> for a
          full width container, spanning the entire width of the viewport.
        </p>
      </div>
    );
  }
}

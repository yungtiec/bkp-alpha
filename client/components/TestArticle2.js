import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";

export default class TestArticle2 extends Component {
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
        item_id: "2"
      },
      annotationData: {
        uri: "http://localhost:8080/home",
        item_id: "2"
      },
      urls: {
        create: "/store",
        update: "/update/:id",
        destroy: "/delete/:id",
        search: "/search/"
      }
    });
  }

  render() {
    return (
      <div ref={el => (this.article = el)}>
        <h1 className="bd-title" id="content">
          I am facing issue on getting value of tagid from my url. localhost:8888/p?tagid=1234
        </h1>
        <p>
          help me out to correct my controller code. I am not able to get the tagid value.
        </p>
        <p className="bd-lead">
          Components and options for laying out your Bootstrap project,
          including wrapping containers, a powerful grid system, a flexible
          media object, and responsive utility classes.
        </p>

      </div>
    );
  }
}

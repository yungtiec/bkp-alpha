import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default class Scrollbar extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.renderThumb = this.renderThumb.bind(this);
  }

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: this.props.thumbColor
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  }

  render() {
    return (
      <Scrollbars
        style={{ width: this.props.containerWidth, height: this.props.containerHeight }}
        autoHide={this.props.autoHide}
        autoHideTimeout={1000}
        renderThumbVertical={this.renderThumb}
        {...this.props}
      >
        {this.props.children}
      </Scrollbars>
    );
  }
}

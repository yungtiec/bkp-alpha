import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default class CustomScrollbar extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.renderThumb = this.renderThumb.bind(this);
  }

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: this.props.scrollbarThumbColor
    };
    const {
      scrollbarThumbColor,
      scrollbarContainerWidth,
      scrollbarContainerHeight,
      ...filteredProps
    } = props;
    return <div style={{ ...style, ...thumbStyle }} {...filteredProps} />;
  }

  render() {
    const {
      scrollbarThumbColor,
      scrollbarContainerWidth,
      scrollbarContainerHeight,
      ...filteredProps
    } = this.props;
    return (
      <Scrollbars
        style={{
          width: this.props.scrollbarContainerWidth,
          height: this.props.scrollbarContainerHeight
        }}
        autoHide={this.props.autoHide}
        autoHideTimeout={1000}
        renderThumbVertical={this.renderThumb}
        {...this.filteredProps}
      >
        {this.props.children}
      </Scrollbars>
    );
  }
}

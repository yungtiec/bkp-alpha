import _ from 'lodash';
import React, { Component } from 'react';
import autoBind from 'react-autobind';

export default class ListView extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (

      <div className={this.props.viewClassName}>
        {_.map(this.props.rowsIdArray, this.renderRowById)}
      </div>

    );
  }

  renderRowById(rowId) {
    return (
      <div
        className={this.props.rowClassName}
        key={rowId}>
        {this.renderRowThroughProps(rowId)}
      </div>
    );
  }

  renderRowThroughProps(rowId) {
    if (typeof this.props.renderRow === 'function') {
      return this.props.renderRow(rowId, _.get(this.props.rowsById, rowId));
    }
  }

}

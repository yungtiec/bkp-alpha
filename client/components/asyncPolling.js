import React, { Component } from "react";
import Promise from "promise";

export default function asyncPolling(
  Component,
  intervalDuration = 60 * 1000,
  onInterval
) {
  class PollingComponent extends Component {

    componentDidMount() {
      this.startPolling();
    }

    componentWillUnmount() {
      this.stopPolling();
    }

    startPolling() {
      if (this.interval) return;
      this.keepPolling = true;
      this.asyncInterval(intervalDuration, onInterval);
    }

    stopPolling() {
      this.keepPolling = false;
      if (this.interval) clearTimeout(this.interval);
    }

    asyncInterval(intervalDuration, fn) {
      const promise = fn(this.getProps(), this.props.dispatch);
      const asyncTimeout = () =>
        setTimeout(() => {
          this.asyncInterval(intervalDuration, fn);
        }, intervalDuration);
      const assignNextInterval = () => {
        if (!this.keepPolling) {
          this.stopPolling();
          return;
        }
        this.interval = asyncTimeout();
      };

      Promise.resolve(promise)
        .then(assignNextInterval)
        .catch(assignNextInterval);
    }

    getProps() {
      return {
        ...this.props,
        startPolling: this.startPolling,
        stopPolling: this.stopPolling,
        isPolling: Boolean(this.interval)
      };
    }

    render() {
      const props = this.getProps();
      console.log(this.props)
      return <Component {...this.props} />;
    }
  }

  return PollingComponent
}

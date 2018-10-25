import React, { Fragment } from "react";

export default props => (
  <Fragment>
    <div className="my-4" dangerouslySetInnerHTML={{ __html: props.content }} />
    {!props.isNotStep && (
      <div className="d-flex justify-content-end mt-5">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={props.cancel.handler}
        >
          {props.cancel.label}
        </button>
        <button
          type="button"
          className="btn btn-primary ml-2"
          onClick={props.submit.handler}
        >
          {props.submit.label}
        </button>
      </div>
    )}
  </Fragment>
);

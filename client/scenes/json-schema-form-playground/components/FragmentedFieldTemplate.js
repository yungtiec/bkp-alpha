import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { templates } from "@react-schema-form/bootstrap";

export const REQUIRED_FIELD_SYMBOL = '*';

function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <label className="col-form-label" htmlFor={id}>
      {label}
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </label>
  );
}

function Help(props) {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  if (typeof help === "string") {
    return (
      <p className="text-muted" data-testid="help-text">
        <small>{help}</small>
      </p>
    );
  }
  return (
    <div className="form-text" data-testid="help-block">
      {help}
    </div>
  );
}

function ErrorList(props) {
  const { errors = [] } = props;
  if (errors.length === 0) {
    return <div />;
  }
  return (
    <Fragment>
      {errors.map((error, index) => {
        return (
          <div
            className="invalid-feedback d-block"
            key={index}
            data-testid="error-detail__item"
          >
            {error}
          </div>
        );
      })}
    </Fragment>
  );
}

function TableInputFieldTemplate(props) {
  const {
    id,
    testId,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    classNames
  } = props;
  if (hidden) {
    return children;
  }

  return (
    <Fragment>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
      {children}
      <ErrorList errors={errors} />
      <Help help={help} />
      <div data-testid={testId} />
    </Fragment>
  );
}

if (process.env.NODE_ENV !== "production") {
  TableInputFieldTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object
  };
}

TableInputFieldTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true
};

export default TableInputFieldTemplate;

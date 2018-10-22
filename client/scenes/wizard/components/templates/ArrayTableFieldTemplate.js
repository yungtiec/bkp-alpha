import React, { Fragment } from "react";
import "./ArrayTableFieldTemplate.scss";

import ArrowUp from "@react-schema-form/bootstrap/lib/components/icons/ArrowUp";
import ArrowDown from "@react-schema-form/bootstrap/lib/components/icons/ArrowDown";

import templates from "./index";

function ArrayFieldTitle({ TitleTemplate, idSchema, title, required }) {
  if (!title) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleTemplate id={id} title={title} required={required} />;
}

function ArrayFieldDescription({ DescriptionTemplate, idSchema, description }) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionTemplate id={id} description={description} />;
}

function IconBtn(props) {
  const { type = "secondary", icon: Icon, className, ...otherProps } = props;
  return (
    <button
      type="button"
      className={`btn btn-${type} ${className}`}
      {...otherProps}
    >
      <Icon />
    </button>
  );
}

function ArrayItem(props, arrayLength) {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  };
  const classNames = [props.className, "row"].join(" ").trim();

  return (
    <Fragment>
      {props.children}

      {props.hasToolbar && (
        <th className="array-item-toolbox">
          <div
            className="btn-group"
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconBtn
                icon={ArrowUp}
                className="array-item-move-up"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly || !props.hasMoveUp}
                onClick={props.onReorderClick(props.index, props.index - 1)}
              />
            )}

            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconBtn
                icon={ArrowDown}
                className="array-item-move-down"
                tabIndex="-1"
                style={btnStyle}
                disabled={
                  props.disabled || props.readonly || !props.hasMoveDown
                }
                onClick={props.onReorderClick(props.index, props.index + 1)}
              />
            )}

            {props.hasRemove && (
              <button
                tabIndex="-1"
                disabled={props.disabled || props.readonly || arrayLength === 1}
                onClick={props.onDropIndexClick(props.index)}
                data-testid="remove-array-item"
                style={{
                  "-webkit-appearance": "none",
                  "-moz-appearance": "none",
                  border: "none",
                  fontSize: "25px"
                }}
              >
                <i class="fas fa-times text-danger" />
              </button>
            )}
          </div>
        </th>
      )}
    </Fragment>
  );
}

function AddButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="btn btn-outline-primary mb-3"
      tabIndex="0"
      onClick={onClick}
      disabled={disabled}
      data-testid="add-array-item"
    >
      Add source
    </button>
  );
}

function ArrayTableFieldTemplate(props) {
  return (
    <div>
      <table class="" style={{ width: "100%", marginBottom: "15px" }}>
        <thead>
          <tr className="array-table__header-row">
            {props.uiSchema["ui:template:tableColumnHeader"] &&
              props.uiSchema["ui:template:tableColumnHeader"].map(
                (title, i) => (
                  <th
                    scope="col"
                    style={
                      props.uiSchema["ui:template:tableColumnWidth"]
                        ? {
                            width:
                              props.uiSchema["ui:template:tableColumnWidth"][i]
                          }
                        : {}
                    }
                  >
                    {title}
                  </th>
                )
              )}
            {props.canAdd && (
              <th style={{ width: "110px" }}>
                <button
                  style={{ width: "100%" }}
                  type="button"
                  className="btn btn-outline-primary mb-3"
                  tabIndex="0"
                  onClick={props.onAddClick}
                  disabled={props.disabled || props.readonly}
                  data-testid="add-array-item"
                >
                  Add source
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.items &&
            props.items.map(p => <tr>{ArrayItem(p, props.items.length)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

/**
 * TODO: PropTypes
 */

export default ArrayTableFieldTemplate;

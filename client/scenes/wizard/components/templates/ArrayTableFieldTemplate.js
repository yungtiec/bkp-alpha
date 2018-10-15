import React, { Fragment } from "react";

import ArrowUp from "@react-schema-form/bootstrap/lib/components/icons/ArrowUp";
import ArrowDown from "@react-schema-form/bootstrap/lib/components/icons/ArrowDown";
import Cross from "@react-schema-form/bootstrap/lib/components/icons/Cross";
import Plus from "@react-schema-form/bootstrap/lib/components/icons/Plus";

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

function ArrayItem(props) {
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
              justifyContent: "space-around"
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
              <IconBtn
                type="danger"
                icon={Cross}
                className="array-item-remove"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly}
                onClick={props.onDropIndexClick(props.index)}
                data-testid="remove-array-item"
              />
            )}
          </div>
        </th>
      )}
    </Fragment>
  );
}

function AddButton({ onClick, disabled }) {
  return (
    <div className="row">
      <p className="col-md-3 col-md-offset-9 array-item-add text-right">
        <IconBtn
          type="info"
          icon={Plus}
          className="btn-add col-md-12"
          tabIndex="0"
          onClick={onClick}
          disabled={disabled}
          data-testid="add-array-item"
        />
      </p>
    </div>
  );
}

function ArrayTableFieldTemplate(props) {
  console.log(props);
  return (
    <div>
      <table class="" style={{ width: "100%" }}>
        <thead>
          <tr>
            {props.uiSchema["ui:template:tableInputTitles"] &&
              props.uiSchema["ui:template:tableInputTitles"].map(title => (
                <th scope="col">{title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.items && props.items.map(p => <tr>{ArrayItem(p)}</tr>)}
        </tbody>
      </table>
      {props.canAdd && (
        <AddButton
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )}
    </div>
  );
}

/**
 * TODO: PropTypes
 */

export default ArrayTableFieldTemplate;

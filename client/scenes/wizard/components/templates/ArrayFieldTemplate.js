import React from "react";
import templates from "./index";
import givenTemplates from "@react-schema-form/bootstrap/lib/components/templates";

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
  const { type = "secondary", label, className, ...otherProps } = props;
  return (
    <button
      type="button"
      className={`btn btn-${type} ${className}`}
      {...otherProps}
    >
      {label}
    </button>
  );
}

function ArrayItem(props) {
  console.log(props)

  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  };
  const classNames = [props.className, "row"].join(" ").trim();

  return (
    <div key={props.index} className={classNames}>
      <div className={props.hasToolbar ? "col-md-9" : "col-md-12"}>
        {props.children}
      </div>

      {props.hasToolbar && (
        <div className="col-md-3 array-item-toolbox">
          <div
            className="btn-group"
            style={{
              display: "flex",
              justifyContent: "space-around"
            }}
          >
            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconBtn
                label="up"
                className="array-item-move-up"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly || !props.hasMoveUp}
                onClick={props.onReorderClick(props.index, props.index - 1)}
              />
            )}

            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconBtn
                label="down"
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
                label="x"
                className="array-item-remove"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly}
                onClick={props.onDropIndexClick(props.index)}
                data-testid="remove-array-item"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddButton({ onClick, disabled }) {
  return (
    <div className="row">
      <p className="col-md-3 col-md-offset-9 array-item-add text-right">
        <IconBtn
          type="info"
          label="+"
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

function DefaultArrayFieldTemplate(props) {
  console.log(props);
  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleTemplate={props.TitleTemplate}
        idSchema={props.idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
      />

      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionTemplate={props.DescriptionTemplate}
          idSchema={props.idSchema}
          description={
            props.uiSchema["ui:description"] || props.schema.description
          }
        />
      )}

      <div
        className="array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}
      >
        {props.items && props.items.map(p => ArrayItem(p))}
      </div>

      {props.canAdd && (
        <AddButton
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )}
    </fieldset>
  );
}

function ArrayFieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "ArrayTable":
      return <templates.ArrayTableFieldTemplate {...props} />;
    default:
      return <DefaultArrayFieldTemplate {...props} />;
  }
}

export default ArrayFieldTemplate;

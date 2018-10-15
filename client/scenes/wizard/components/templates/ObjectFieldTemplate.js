import React from "react";
import templates from "./index";

function DefaultObjectFieldTemplate(props) {
  const { TitleTemplate, DescriptionTemplate } = props;

  return (
    <fieldset>
      {props.uiSchema["ui:title"] && props.uiSchema["ui:title"].hideTitle
        ? null
        : (props.uiSchema["ui:title"] || props.title) && (
            <TitleTemplate
              id={`${props.idSchema.$id}__title`}
              title={props.title || props.uiSchema["ui:title"]}
              required={props.required}
              formContext={props.formContext}
            />
          )}
      {props.uiSchema["ui:description"] &&
      props.uiSchema["ui:description"].hideDescription
        ? null
        : props.description && (
            <DescriptionTemplate
              id={`${props.idSchema.$id}__description`}
              description={props.description}
              formContext={props.formContext}
            />
          )}
      {props.properties.map(prop => prop.content)}
    </fieldset>
  );
}

function ObjectFieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "TableRow":
      return <templates.TableRowFieldTemplate {...props} />;
    default:
      return <DefaultObjectFieldTemplate {...props} />;
  }
}

export default ObjectFieldTemplate;

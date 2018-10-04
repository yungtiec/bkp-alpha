Create a component that automatically generates a React form based on a JSON Schema and the consumer token framework.

## Reason

1.  We may publish a newer version of the framework anytime in the future. Since the scorecard is based on the framework, we have to take the future update into consideration.
2.  It's possible we open source another document format, other than the scorecard.

## Wireframe

[https://www.figma.com/file/BmpGRTYwaZfyMiJ4t6m0Na3K/Scorecard-Wizard?node-id=0%3A1](https://www.figma.com/file/BmpGRTYwaZfyMiJ4t6m0Na3K/Scorecard-Wizard?node-id=0%3A1)

## Make use existing form generator out there

[react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) maintained by modzilla services

## Plan of attack

Based on the first draft of the [scorecard template](https://docs.google.com/document/d/1dWA3_FJuiGd2QsrXS9Wuv4iF7NziMurseJ9nt4N5PR8/edit#), a step by step wizard we're looking to build consists of four types of components

#### 1. Step

Per [wireframe](https://www.figma.com/file/BmpGRTYwaZfyMiJ4t6m0Na3K/Scorecard-Wizard?node-id=0%3A1), each step in the wizard is a web page (or a scene according to our project directory structure). We can define a step component for react router to render. This component is going to be a container with title, description and specific child component for each step.

`<Step />` has the following input properties:

- id
  - id for the current step
  - for getting/computing form validation status based on form data stored in redux
- title
- description

Potential child components of `<Step />` includes:

#### 2. Instruction

In the scorecard template, there are paragraphs of instruction with external links and lists. These are better displayed by html markup. Instruction component can take in either markdown or static html.

#### 3. Dedicated Form

Consider building a form that's not rendered by react-json-schema-form. This is for getting necessary metadata, like token project, reference framework, author...etc. The metadata can't just be stored in a json column. We need this kind of metadata to make associations in the database.

The logic has to be self-contained so that we can use it in different scenario.

#### 4. JSON Schema Form

For flexibility


## Array and JSON representation for a step by step wizard

Refer to json files in this folder

#### 1.  step-array

This is an array of object. Each object contains the props for the `<Step />` component described above.

- id
- title
- description
- childComponent

#### 2. step-schemas

This is a JSON object with step id as key and an object with schema, uiSchema and defaultFormData as object.

```
{
  "STEP_ID": {
    schema: {},
    uiSchema: {},
    defaultFormData: {}
  }
}
```

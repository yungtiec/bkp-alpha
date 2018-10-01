Create a component that automatically generates a React form based on a JSON Schema and the consumer token framework.

## Reason
1. We may publish a newer version of the framework anytime in the future. Since the scorecard is based on the framework, we have to take the future update into consideration.
2. It's possible we open source another document format, other than the scorecard.

## Option 1: Use existing form generator out there

[react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) maintain by modzilla services

#### Scorecard JSON Schema
- Single data store for the structure of the scorecard form
- Including validataion rule

#### Framework v1 JSON
- Single data store for the framework

#### Scorecard Form Data
- User's response

## Option 2: Build our own


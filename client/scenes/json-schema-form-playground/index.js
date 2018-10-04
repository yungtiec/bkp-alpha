import React, { Component } from "react";
import { render } from "react-dom";

import Form from "@react-schema-form/bootstrap";

const schema = {
  definitions: {
    Source: {
      type: "object",
      properties: {
        title: {
          type: "string"
        },
        link: {
          type: "string"
        },
        dateAccess: {
          type: "string",
          format: "date"
        }
      }
    },
    DisclosureStatus: {
      type: "object",
      properties: {
        disclosure: {
          title: "disclosure",
          type: "string" // from framework.json
        },
        status: {
          title: "status",
          type: "string",
          enum: ["N/A", "x", "1/2", "checked"],
          enum: ["N/A", "x", "1/2", "checked"]
        },
        sources: {
          title: "sources",
          type: "array",
          items: {
            $ref: "#/definitions/Source"
          }
        }
      }
    }
  },
  type: "object",
  properties: {
    disclosureTable: {
      type: "array",
      title: "Disclosure Status",
      items: {
        $ref: "#/definitions/DisclosureStatus"
      }
    },
    analysis: {
      title: "Analysis",
      type: "string"
    }
  }
};

const uiSchema = {
  disclosureTable: {
    "ui:options": {
      addable: false,
      orderable: false,
      removable: false
    },
    items: {
      disclosure: { "ui:disabled": true }
    }
  },
  analysis: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 5
    }
  }
};

const formData = {
  disclosureTable: [
    {
      disclosure: "Description of token’s intrinsic features and operation"
    },
    {
      disclosure: "The Brooklyn Project Token Taxonomy classification"
    }
  ]
};

const log = type => console.log.bind(console, type);

export default () => (
  <div className="main-container">
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")}
    />
  </div>
);

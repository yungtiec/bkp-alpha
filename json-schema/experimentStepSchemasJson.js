const fs = require("fs");

module.exports = function generateStepSchemasJson() {
  stepSchemasJson.analysisOfDisclosures = {
    accordionInstructions: transparencyScoreInstruction,
    accordionOrder: accordionOrder
  };
  for (var key in principles) {
    stepSchemasJson.analysisOfDisclosures[key] = {
      schema: principleFormDefinition(principles[key].title),
      uiSchema: principleUiSchema,
      defaultFormData: {
        disclosures: principles[key].disclosures,
      },
      viewerSchema: principleViewerSchema(principles[key])
    };
  }
  return stepSchemasJson;
};

var stepSchemasJson = {
  sourcesEvaluated: {
    schema: {
      definitions: {
        Source: {
          type: "object",
          required: ["title", "link"],
          properties: {
            title: {
              type: "string"
            },
            link: {
              type: "string"
            }
          }
        }
      },
      title: "",
      type: "array",
      minItems: 1,
      items: {
        $ref: "#/definitions/Source"
      }
    },
    uiSchema: {
      "ui:title": {
        hideTitle: true
      },
      "ui:template": "ArrayTable",
      "ui:template:tableColumnHeader": ["Description", "Link", ""],
      "ui:options": {
        orderable: false
      },
      items: {
        "ui:template": "TableRow",
        title: {
          "ui:template": "TableTh",
          "ui:placeholder": "e.g. project page"
        },
        link: {
          "ui:template": "TableTh",
          "ui:placeholder": "http://..."
        }
      }
    },
    defaultFormData: [
      {
        title: null,
        link: null
      }
    ],
    viewerSchema: {
      title: "List Disclosures Evaluated: ",
      "viewer:widget": "CollectionTable"
    }
  },
  generalCommentary: {
    schema: {
      title: "",
      type: "string"
    },
    uiSchema: { "ui:widget": "DependentTextEditorWidget" },
    defaultFormData: "",
    viewerSchema: {
      title: ""
    }
  }
};

const transparencyScoreInstruction = fs.readFileSync(
  "json-schema/transparency-score-instruction.html",
  "utf8"
);

const disclosureStatusDefinition = {
  type: "object",
  properties: {
    test: {
      title: "analysis",
      type: "string"
    },
    analysis: {
      title: "analysis",
      type: "string"
    }
  }
};

const principleFormDefinition = title => ({
  title: title,
  type: "object",
  required: ["transparencyScore"],
  properties: {
    transparencyScore: {
      type: "number",
      title: "a. Transparency score out of 10 (e.g. “5”)",
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    disclosures: {
      type: "array",
      title: "b. List of available disclosures",
      items: disclosureStatusDefinition
    }
  }
});

const principleUiSchema = {
  "ui:title": {
    hideTitle: true
  },
  transparencyScore: {
    "ui:widget": "ScoreWidget",
    "ui:options": {
      inline: true
    }
  },
  disclosures: {
    "ui:options": {
      addable: false,
      orderable: false,
      removable: false
    },
    items: {
      test: {
        "ui:widget": "DependentTextEditorWidget"
      },
      analysis: {
        "ui:widget": "DependentTextEditorWidget"
      }
    }
  }
};

const principleViewerSchema = principle => ({
  title: principle.title,
  transparencyScore: {
    "viewer:widget": "TitleWithInlineData",
    title: "transparency score: %formData%",
    placeholder: "no data"
  },
  disclosures: {
    "viewer:widget": "CollectionTable",
    headers: ["disclosure", "status", "sources"]
  },
  analysis: {
    title: "analysis",
    "viewer:widget": "HtmlBlock"
  }
});

const accordionOrder = [
  "principle1",
  "principle2",
  "principle3",
  "principle4",
  "principle5",
  "principle6",
  "principle7",
  "principle8",
  "principle9",
  "principle10"
];

const principles = {
  principle1: {
    title: "Principle 1: Consumer Token Design",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle2: {
    title: "Principle 2: Project Governance and Operation",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle3: {
    title: "Principle 2: Project Governance and Operation",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle4: {
    title: "Principle 4: Purpose of Token Distribution",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle5: {
    title: "Principle 5: Token Supply",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle6: {
    title: "Principle 6: Mitigation of Conflicts and Improper Trading",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle7: {
    title: "Principle 7: Token Safety and Security",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle8: {
    title: "Principle 8: Marketing Practices",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle9: {
    title: "Principle 9: Protecting and Empowering Consumers",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  },
  principle10: {
    title: "Principle 10: Compliance with Applicable Laws",
    disclosures: [
      {
        test: "",
        analysis: ""
      },
      {
        test: "",
        analysis: ""
      }
    ]
  }
};

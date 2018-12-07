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
        disclosureTable: principles[key].disclosureTable,
        analysis: ""
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
  required: ["status", "sources"],
  properties: {
    disclosure: {
      title: "Disclosure",
      type: "string"
    },
    status: {
      title: "Status",
      type: "string",
      enum: ["N/A", "x", "1/2", "✓"],
      enumNames: ["N/A", "x", "1/2", "✓"]
    },
    sources: {
      title: "Source(s)",
      type: "array",
      uniqueItems: true,
      items: {
        type: "object",
        enum: [{}]
      },
      "enum:defaultOptions": [
        {
          label: "Add another source",
          value: "LOAD_SELECT_CREATABLE_MODAL"
        }
      ],
      "enum:optionDependencyPath": "sourcesEvaluated",
      "enum:optionDependencyLabelKey": "title"
    },
    analysis: {
      title: "Analysis",
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
    disclosureTable: {
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
  disclosureTable: {
    "ui:options": {
      addable: false,
      orderable: false,
      removable: false
    },
    items: {
      classNames: "row",
      disclosure: {
        classNames: "col-4",
        "ui:widget": "NonEditableTextWidget"
      },
      sources: {
        classNames: "col-4",
        "ui:widget": "DependentSelectWidget"
      },
      status: {
        classNames: "col-4"
      },
      analysis: {
        classNames: "col-12",
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
  disclosureTable: {
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
    disclosureTable: [
      {
        disclosure: "Description of token’s intrinsic features and operation"
      },
      {
        disclosure: "The Brooklyn Project Token Taxonomy classification"
      }
    ]
  },
  principle2: {
    title: "Principle 2: Project Governance and Operation",
    disclosureTable: [
      {
        disclosure: "How and by whom the project will be governed"
      },
      {
        disclosure: "Relevant holding or operating company and jurisdiction"
      },
      {
        disclosure: "Backgrounds of key people"
      },
      {
        disclosure:
          "Description of what part of the project is decentralized, centralized, open-sourced, or “forkable”"
      },
      {
        disclosure:
          "Project roadmap, including key technical and project milestones"
      },
      {
        disclosure: "Updates on milestone progress and funds"
      }
    ]
  },
  principle3: {
    title: "Principle 3: Responsible Token Distribution",
    disclosureTable: [
      {
        disclosure: "Purpose of any token distributions"
      },
      {
        disclosure: "Legal entity that distributed tokens"
      },
      {
        disclosure: "Conditions a buyer must meet to receive tokens"
      },
      {
        disclosure: "Terms of token distributions (lockups, vesting)"
      },
      {
        disclosure: "Project status at time of token distribution"
      },
      {
        disclosure:
          "Steps to limit sale to individuals who do not intend to consume token"
      },
      {
        disclosure: "Clarification of duties to increase token price"
      },
      {
        disclosure: "Restrictions and plans for secondary trading"
      }
    ]
  },
  principle4: {
    title: "Principle 4: Purpose of Token Distribution",
    disclosureTable: [
      {
        disclosure: "Planned and actual use of proceeds by function line"
      },
      {
        disclosure: "Token sale proceeds"
      },
      {
        disclosure: "Updates on the project’s progress and funds"
      },
      {
        disclosure:
          "The aggregate amount of tokens reserved for the remuneration of team members"
      }
    ]
  },
  principle5: {
    title: "Principle 5: Token Supply",
    disclosureTable: [
      {
        disclosure: "Initial token supply and eventual supply changes"
      },
      {
        disclosure: "Differences between token supply and tokens in circulation"
      },
      {
        disclosure:
          "Auditability of the token supply governance in production code"
      }
    ]
  },
  principle6: {
    title: "Principle 6: Mitigation of Conflicts and Improper Trading",
    disclosureTable: [
      {
        disclosure: "Steps to identify, manage, mitigate conflicts"
      },
      {
        disclosure: "Prevention of improper trading of tokens"
      }
    ]
  },
  principle7: {
    title: "Principle 7: Token Safety and Security",
    disclosureTable: [
      {
        disclosure: "Report of technological audit"
      },
      {
        disclosure: "Mechanisms for notifying users of security risks"
      },
      {
        disclosure: "Links to project github repositories"
      }
    ]
  },
  principle8: {
    title: "Principle 8: Marketing Practices",
    disclosureTable: [
      {
        disclosure:
          "Steps taken to comply with the marketing principles outlined in this document"
      },
      {
        disclosure:
          "Explanations of the relationship between promises made in marketing materials about a token’s governance provisions and a project’s actual smart contracts (e.g. related to token supply, insider vesting schedules, modifiability of the governance rules)"
      },
      {
        disclosure: "Links to project website(s) and accounts"
      },
      {
        disclosure: "Mechanisms to identify issues"
      }
    ]
  },
  principle9: {
    title: "Principle 9: Protecting and Empowering Consumers",
    disclosureTable: [
      {
        disclosure: "Rights and obligations of tokenholders"
      },
      {
        disclosure: "Refund measures if the project is scaled down"
      },
      {
        disclosure: "Scenarios that may trigger token sale reversal"
      },
      {
        disclosure: "Privacy policy"
      }
    ]
  },
  principle10: {
    title: "Principle 10: Compliance with Applicable Laws",
    disclosureTable: [
      {
        disclosure:
          "Statement of Good Faith affirming compliance with applicable laws and regulations"
      },
      {
        disclosure: "Legal and professional advice on Statement of Good Faith"
      }
    ]
  }
};

const fs = require("fs");

module.exports = function generateStepArrays() {
  return {
    wizardSteps: wizardSteps,
    viewerSteps: viewerSteps
  };
};

var wizardSteps = [
  {
    id: "overview",
    title: "Overview",
    childComponentType: "INSTRUCTIONS",
    content: "put overview here"
  },
  {
    id: "tokenInformation",
    title: "Fill out the token information summary",
    childComponentType: "TOKEN_INFORMATION_FORM"
  },
  {
    id: "listDisclosuresEvaluated",
    title: "List Disclosures Evaluated",
    childComponentType: "JSON_SCHEMA_FORM"
  },
  {
    id: "analysisOfDisclosures",
    title: "Provide Analysis of Disclosures",
    childComponentType: "JSON_SCHEMA_FORMS_ACCORDION"
  },
  {
    id: "generalCommentary",
    title: "Add general commentary",
    childComponentType: "JSON_SCHEMA_FORM"
  },
  {
    id: "reviewAndSubmit",
    title: "Review & Submit",
    childComponentType: "INSTRUCTIONS",
    content: "render scorecard here"
  }
];

var viewerSteps = [
  {
    id: "legalNotice",
    template: "TEXT_BLOCK_TEMPLATE",
    content: fs.readFileSync("json-schema/scorecard-legal-notice.html", "utf8")
  },
  {
    id: "scorecardTable",
    template: "SCORECARD_TABLE_TEMPLATE",
    formDataPath: "analysisOfDisclosures",
    formDataOrder: "accordionOrder",
    formDataKey: "transparencyScore"
  },
  {
    id: "assessmentCriteria",
    template: "TEXT_BLOCK_TEMPLATE",
    content: fs.readFileSync(
      "json-schema/scorecard-assessment-criteria.html",
      "utf8"
    )
  },
  {
    id: "listDisclosuresEvaluated",
    title: "List Disclosures Evaluated",
    template: "JSON_SCHEMA_FORM_DATA_TEMPLATE"
  },
  {
    id: "analysisOfDisclosures",
    title: "Provide Analysis of Disclosures",
    template: "JSON_SCHEMA_ACCORDION_DATA_TEMPLATE"
  },
  {
    id: "generalCommentary",
    title: "Add general commentary",
    template: "JSON_SCHEMA_FORM_DATA_TEMPLATE"
  }
];

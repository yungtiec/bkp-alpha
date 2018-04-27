const { expect } = require("chai");
const db = require("../index");
const Annotation = db.model("annotation");

var parent, child, grandChild;

describe("Annotation thread", () => {
  before(async () => {
    await db.sync({ force: true });
    parent = await Annotation.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      survey_question_id: "12",
      project_survey_id: "3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "parent"
    });
    child = await Annotation.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      survey_question_id: "12",
      project_survey_id: "3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "child"
    });
    grandChild = await Annotation.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      survey_question_id: "12",
      project_survey_id: "3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "grand child"
    });
    await parent.addChild(child.id);
    await child.addChild(grandChild.id);
  });

  it("creates correct hierarchy", async () => {
    var rootAnnotation = await Annotation.find({
      where: {
        uri: "http://localhost:8080/project/DG/survey/3",
        survey_question_id: "12",
        quote:
          "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
        hierarchyLevel: 1
      },
      include: {
        model: Annotation,
        as: "descendents",
        hierarchy: true
      }
    });

    var parent = rootAnnotation.toJSON()
    var child = rootAnnotation.toJSON().children[0].toJSON()
    var grandChild = rootAnnotation.toJSON().children[0].toJSON().children[0].toJSON()
    expect(parent.id).to.be.equal(child.parentId)
    expect(child.id).to.be.equal(grandChild.parentId)
  });
});

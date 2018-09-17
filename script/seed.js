Promise = require("bluebird");
const db = require("../server/db/models");
const {
  User,
  Permission,
  Role,
  Project,
  Version,
  VersionAnswer,
  Question,
  QuestionCategory,
  Document,
  VersionQuestion
} = require("../server/db/models");
const _ = require("lodash");
const MarkdownParsor = require("./markdown-parser");
const fs = require("fs");
const cheerio = require("cheerio");
const showdown = require("showdown");
const converter = new showdown.Converter();
const csv_parse = require("csv-parse");
const parse = Promise.promisify(csv_parse);

async function seed() {
  await db.sequelize.sync({ force: true });
  console.log("db synced!");
  var projects = await seedProject();
  await seedPermission();
  await seedUser(projects);
  var document2 = await seedDocumentFromMarkdown({
    project: projects[0],
    documentCreatorId: 1,
    filepath: "./data/vpp-2.md"
  });
  var document1 = await seedDocumentFromMarkdown({
    project: projects[0],
    documentCreatorId: 1,
    filepath: "./data/vpp-1.md"
  });
}

async function seedUser(projects) {
  const userCsv = fs.readFileSync("./data/users.csv", "utf8");
  const adminRole = await Role.findOne({ where: { name: "admin" } });
  await parse(userCsv, {
    columns: true,
    auto_parse: true
  }).then(rows => {
    return Promise.map(
      rows,
      entry => {
        for (let k in entry) {
          if (entry[k] == "") entry[k] = null;
        }

        return User.create(_.omit(entry, ["id"]))
          .then(async user => {
            if (user.last_name === "Admin")
              return await user.addRole(adminRole.id);
            else return user;
          })
          .catch(err => {
            console.log(err);
          });
      },
      { concurrency: 1000 }
    );
  });
}

async function seedPermission() {
  const role = await Promise.map(
    [{ name: "admin" }, { name: "project_admin" }, { name: "editor" }],
    entry => Role.create(entry)
  );
}

async function seedProject() {
  return Promise.map(
    [
      {
        name: "Virtue Poker",
        symbol: "VPP",
        description:
          "Virtue Poker is a privately held company headquartered in Gibraltar. It was founded in 2016, and is a Consensys backed startup.",
        website: "https://virtue.poker/",
        logo_url: "https://virtue.poker/css/img/logo.png"
      },
      {
        name: "digital gold",
        symbol: "DG"
      }
    ],
    project => Project.create(project)
  );
}

async function seedDocument({ project, document, questions }) {
  var document = await Document.create(document);
  var version = await Version.create({
    project_id: project.id,
    document_id: document.id
  });
  var questions = await Promise.map(questions, (question, i) =>
    Question.create(question).then(async question => {
      await VersionQuestion.create({
        version_id: version.id,
        question_id: question.id,
        order_in_version: i
      });
      return question;
    })
  );
  return document;
}

async function seedDocumentFromMarkdown({
  project,
  document,
  documentCreatorId,
  filepath
}) {
  var markdownParsor = new MarkdownParsor({ filepath });
  var document = await Document.create({
    title: markdownParsor.title,
    description: markdownParsor.description,
    project_id: project.id,
    creator_id: 1
  });
  var version = await Version.create({
    document_id: document.id,
    creator_id: documentCreatorId
  });
  var questionInstances = await Promise.map(
    markdownParsor.questions,
    async questionObject => {
      var answer = markdownParsor.findAnswerToQuestion(
        questionObject.order_in_version
      );
      var versionQuestion = await VersionQuestion.create({
        version_id: version.id,
        order_in_version: questionObject.order_in_version,
        markdown: `### ${questionObject.question}`,
        latest: true
      });
      await VersionAnswer.create({
        markdown: answer,
        version_question_id: versionQuestion.id,
        version_id: version.id,
        latest: true
      });
    }
  );
}

seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("closing db connection");
    db.sequelize.close();
    console.log("db connection closed");
  });

console.log("seeding...");

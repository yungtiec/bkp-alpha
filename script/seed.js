Promise = require("bluebird");
const db = require("../server/db");
const {
  User,
  Permission,
  Role,
  Project,
  ProjectSurvey,
  ProjectSurveyAnswer,
  Question,
  QuestionCategory,
  Survey,
  SurveyQuestion
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
  await db.sync({ force: true });
  console.log("db synced!");
  var projects = await seedProject();
  await seedPermission();
  await seedUser(projects);
  var survey2 = await seedSurveyFromMarkdown({
    project: projects[0],
    surveyCreatorId: 1,
    filepath: "./data/vpp-2.md"
  });
  var survey1 = await seedSurveyFromMarkdown({
    project: projects[0],
    surveyCreatorId: 1,
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

async function seedSurvey({ project, survey, questions }) {
  var survey = await Survey.create(survey);
  var projectSurvey = await ProjectSurvey.create({
    project_id: project.id,
    survey_id: survey.id
  });
  var questions = await Promise.map(questions, (question, i) =>
    Question.create(question).then(async question => {
      await SurveyQuestion.create({
        survey_id: survey.id,
        question_id: question.id,
        order_in_survey: i
      });
      return question;
    })
  );
  return survey;
}

async function seedSurveyFromMarkdown({
  project,
  survey,
  surveyCreatorId,
  filepath
}) {
  var markdownParsor = new MarkdownParsor({ filepath });
  var survey = await Survey.create({
    title: markdownParsor.title,
    description: markdownParsor.description,
    project_id: project.id,
    creator_id: 1
  });
  var projectSurvey = await ProjectSurvey.create({
    survey_id: survey.id,
    creator_id: surveyCreatorId
  });
  var questionInstances = await Promise.map(
    markdownParsor.questions,
    questionObject =>
      Question.create({
        markdown: `### ${questionObject.question}`
      }).then(async question => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_survey
        );
        var surveyQuestion = await SurveyQuestion.create({
          project_survey_id: survey.id,
          question_id: question.id,
          order_in_survey: questionObject.order_in_survey
        });
        await ProjectSurveyAnswer.create({
          markdown: answer,
          survey_question_id: surveyQuestion.id,
          project_survey_id: projectSurvey.id
        });
        return question;
      })
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
    db.close();
    console.log("db connection closed");
  });

console.log("seeding...");

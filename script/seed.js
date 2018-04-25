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
Promise = require("bluebird");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");
  var projects = await seedProject();
  await seedPermission();
  await seedUser(projects);
  var survey2 = await seedSurvey({
    project: projects[0],
    survey: {
      title: "Third-party assessment",
      creator_id: 1
    },
    questions: [
      {
        question: "Project strengths"
      },
      {
        question: "Project risks"
      },
      {
        question: "Outstanding questions"
      }
    ]
  });
  var survey1 = await seedSurveyFromMarkdown({
    project: projects[0],
    survey: {
      title: "Consumer Token Disclosure (v1)",
      creator_id: 1
    },
    filepath: "./data/vpp.md"
  });
}

async function seedUser(projects) {
  const users = await Promise.all([
    User.create({ email: "tctammychu@gmail.com", password: "12345678" }),
    User.create({ email: "cody@email.com", password: "123" }),
    User.create({ email: "murphy@email.com", password: "123" })
  ]);
  await users[0].addProject(projects[0].id);
  await users[1].addProject(projects[1].id);

  const adminRole = await Role.findOne({ where: { name: "admin" } });
  await users[0].addRole(adminRole.id);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

async function seedPermission() {
  const permissions = await Promise.map(
    [
      { name: "upvote" },
      { name: "annotate" },
      { name: "answer_survey" },
      { name: "create_survey" },
      { name: "approve_survey_answers" },
      { name: "approve_annotation" }
    ],
    entry => Permission.create(entry)
  );
  const role = await Promise.map(
    [
      { name: "admin" },
      { name: "open_source_user" },
      { name: "business_user" }
    ],
    entry => Role.create(entry)
  );
  await Promise.map(permissions, permission => {
    return role[0].addPermission(permission.id);
  });
  await Promise.map(permissions.slice(0, 2), permission => {
    return role[1].addPermission(permission.id);
  });
  await Promise.map(permissions.slice(0, 4), permission => {
    return role[2].addPermission(permission.id);
  });
}

async function seedProject() {
  return Promise.map(
    [
      {
        name: "Virtue Poker",
        symbol: "VPP"
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

async function seedSurveyFromMarkdown({ project, survey, filepath }) {
  var survey = await Survey.create(survey);
  var projectSurvey = await ProjectSurvey.create({
    project_id: project.id,
    survey_id: survey.id
  });
  var markdownParsor = new MarkdownParsor({ filepath });
  var questionInstances = await Promise.map(
    markdownParsor.questions,
    questionObject =>
      Question.create({
        question: `# ${questionObject.question}`
      }).then(async question => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_survey
        );
        var surveyQuestion = await SurveyQuestion.create({
          survey_id: survey.id,
          question_id: question.id,
          order_in_survey: questionObject.order_in_survey
        });
        await ProjectSurveyAnswer.create({
          answer: answer.trim(),
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

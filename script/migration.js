require("../secrets");
Promise = require("bluebird");
const upgradedDb = require("../server/db");
const deprecatedDb = require("../migration/db");

async function migrate() {
  try {
    await Promise.all([deprecatedDb.sync(), upgradedDb.sync({ force: true })]);
    await Promise.all([migrateProjects(), migrateUsers()]);
    Promise.all([deprecatedDb.close(), upgradedDb.close()]);
  } catch (error) {
    console.log(error);
    Promise.all([deprecatedDb.close(), upgradedDb.close()]);
  }
}

const migrateUsers = async () => {
  const users = await deprecatedDb.model("user").findAll({ raw: true });
  await upgradedDb.model("user").bulkCreate(users);
};

const migrateProjects = async () => {
  const projects = await deprecatedDb.model("project").findAll({ raw: true });
  await upgradedDb.model("project").bulkCreate(projects);
};

const migrateDocuments = async () => {
  const projectSurveys = await deprecatedDb.model("project_survey");

  // ProjectSurvey => Document, creator

  // ProjectSurvey => Document, collaborators

  // ProjectSurvey => Document, upvotes and downvotes

  // ProjectSurvey => Version, project_survey_answer

  // Survey => Version , survey_question

  // ProjectSurvey => Version, comment

  // ProjectSurvey => Verison, issue
};

migrate();

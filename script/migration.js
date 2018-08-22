require("../secrets");
Promise = require("bluebird");
const upgradedDb = require("../server/db");
const deprecatedDb = require("../migration/db");
const _ = require("lodash");

async function migrate() {
  try {
    await Promise.all([deprecatedDb.sync(), upgradedDb.sync({ force: true })]);
    await Promise.all([
      migrateProjects(),
      migrateUsers()
        .then(migrateRoles)
        .then(migrateUserRoles)
        .then(migrateNotifications),
      migrateDocuments()
    ]);
    await setSequenceManually();
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

const migrateNotifications = async () => {
  const notifications = await deprecatedDb
    .model("notification")
    .findAll({ raw: true });
  var updatedNotifications = await upgradedDb
    .model("notification")
    .bulkCreate(notifications);
  return Promise.all(
    updatedNotifications.map(notification => {
      var updatedUri = notification.uri.replace(
        "/survey/3",
        "/document/1/version/1"
      );
      return notification.update({ uri: updatedUri });
    })
  );
};

const migrateRoles = async () => {
  const roles = await deprecatedDb.model("role").findAll({ raw: true });
  await upgradedDb.model("role").bulkCreate(roles);
};

const migrateUserRoles = async () => {
  const userRoles = await deprecatedDb
    .model("user_role")
    .findAll({ raw: true });
  await upgradedDb.model("user_role").bulkCreate(userRoles);
};

const migrateProjects = async () => {
  const projects = await deprecatedDb.model("project").findAll({ raw: true });
  await upgradedDb.model("project").bulkCreate(projects);
};

const migrateDocuments = async () => {
  const projectSurveys = await deprecatedDb.model("project_survey").findAll({
    include: [
      {
        model: deprecatedDb.model("survey"),
        include: [
          {
            model: deprecatedDb.model("survey_question"),
            include: [
              {
                model: deprecatedDb.model("question")
              },
              {
                model: deprecatedDb.model("project_survey_answer")
              }
            ]
          }
        ]
      },

      {
        model: deprecatedDb.model("project")
      },
      {
        model: deprecatedDb.model("user"),
        as: "creator"
      },
      {
        model: deprecatedDb.model("user"),
        as: "collaborators",
        required: false
      },
      {
        model: deprecatedDb.model("issue"),
        as: "resolvedIssues",
        required: false,
        include: [
          {
            model: deprecatedDb.model("comment"),
            required: false
          }
        ]
      },
      {
        model: deprecatedDb.model("comment"),
        required: false,
        include: [
          {
            model: deprecatedDb.model("issue"),
            required: false,
            where: { open: true }
          },
          {
            model: deprecatedDb.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "name", "email", "id"]
          }
        ]
      },
      {
        model: deprecatedDb.model("user"),
        as: "upvotesFrom",
        attributes: ["id", "name", "first_name", "last_name", "email"]
      },
      {
        model: deprecatedDb.model("user"),
        as: "downvotesFrom",
        attributes: ["id", "name", "first_name", "last_name", "email"]
      }
    ]
  });

  return Promise.map(projectSurveys, async projectSurvey => {
    var document = await upgradedDb.model("document").create({
      title: projectSurvey.survey.title,
      description: projectSurvey.survey.description,
      creator_id: projectSurvey.creator_id,
      project_id: projectSurvey.project.id
    });
    var documentCollaborators = await Promise.all(
      projectSurvey.collaborators.map(c =>
        upgradedDb.model("document_collaborator").create({
          user_id: c.id,
          document_id: document.id
        })
      )
    );
    var documentUpvotes = await Promise.all(
      projectSurvey.upvotesFrom.map(u =>
        upgradedDb.model("document_upvote").create({
          user_id: u.id,
          document_id: document.id
        })
      )
    );
    var documentDownvotes = await Promise.all(
      projectSurvey.downvotesFrom.map(d =>
        upgradedDb.model("document_downvote").create({
          user_id: d.id,
          document_id: document.id
        })
      )
    );
    var version = await upgradedDb.model("version").create({
      document_id: document.id,
      comment_until_unix: projectSurvey.comment_until_unix,
      scorecard: projectSurvey.scorecard,
      parentId: projectSurvey.parentId,
      hierarchyLevel: projectSurvey.hierarchyLevel,
      creator_id: projectSurvey.creator_id
    });
    var versionQuestions = await Promise.all(
      projectSurvey.survey.survey_questions.map(async sq => {
        var question = await upgradedDb.model("question").create({
          id: sq.question.id,
          markdown: sq.question.markdown
        });
        var versionQuestion = await upgradedDb
          .model("version_question")
          .create({
            id: sq.id,
            question_id: question.id,
            order_in_version: sq.order_in_survey,
            version_id: version.id
          });
        var versionAnswers = await Promise.all(
          sq.project_survey_answers.map(psq => {
            upgradedDb.model("version_answer").create({
              id: psq.id,
              version_id: version.id,
              version_question_id: versionQuestion.id,
              json: psq.json,
              markdown: psq.markdown
            });
          })
        );
        return versionQuestion;
      })
    );
    var comments = Promise.each(
      _.sortBy(projectSurvey.comments, ["id"]),
      async c => {
        var comment = await upgradedDb.model("comment").create({
          id: c.id,
          uri: c.uri,
          version_question_id: c.survey_question_id
            ? c.survey_question_id
            : null,
          quote: c.quote,
          comment: c.comment,
          ranges: c.ranges,
          reviewed: c.reviewed,
          hierarchyLevel: c.hierarchyLevel,
          parentId: c.parentId ? c.parentId : null,
          owner_id: c.owner_id,
          version_id: version.id
        });
        var upvotesFrom = await Promise.all(
          c.upvotesFrom.map(u =>
            upgradedDb.model("comment_upvote").create({
              comment_id: c.id,
              user_id: u.id
            })
          )
        );
      }
    );
    var issues = await deprecatedDb
      .model("issue")
      .findAll()
      .then(issues =>
        Promise.map(issues, issue =>
          upgradedDb.model("issue").create({
            open: issue.open,
            comment_id: issue.comment_id ? issue.comment_id : null
          })
        )
      );
  });
};

const setSequenceManually = async () => {
  await upgradedDb.query(`ALTER SEQUENCE "users_id_seq" RESTART WITH ${46};`);
  await upgradedDb.query(
    `ALTER SEQUENCE "comments_id_seq" RESTART WITH ${46};`
  );
  await upgradedDb.query(
    `ALTER SEQUENCE "documents_id_seq" RESTART WITH ${2};`
  );
  await upgradedDb.query(`ALTER SEQUENCE "issues_id_seq" RESTART WITH ${33};`);
  await upgradedDb.query(
    `ALTER SEQUENCE "notifications_id_seq" RESTART WITH ${25};`
  );
  await upgradedDb.query(`ALTER SEQUENCE "projects_id_seq" RESTART WITH ${2};`);
  await upgradedDb.query(
    `ALTER SEQUENCE "questions_id_seq" RESTART WITH ${46};`
  );
  await upgradedDb.query(`ALTER SEQUENCE "roles_id_seq" RESTART WITH ${4};`);
  await upgradedDb.query(
    `ALTER SEQUENCE "version_answers_id_seq" RESTART WITH ${46};`
  );
  await upgradedDb.query(
    `ALTER SEQUENCE "version_questions_id_seq" RESTART WITH ${46};`
  );
  await upgradedDb.query(`ALTER SEQUENCE "versions_id_seq" RESTART WITH ${2};`);
};

migrate();

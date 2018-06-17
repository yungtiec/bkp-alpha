const Sequelize = require("sequelize");
const db = require("../db");
const _ = require("lodash");

const Project = db.define(
  "project",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    symbol: {
      type: Sequelize.STRING,
      unique: true
    },
    description: {
      type: Sequelize.TEXT
    },
    logo_url: {
      type: Sequelize.TEXT
    },
    website: {
      type: Sequelize.TEXT
    }
  },
  {
    scopes: {
      withStats: function(projectSymbol) {
        var query = {
          include: [
            {
              model: db.model("user"),
              through: db.model("project_admin"),
              as: "admins"
            },
            {
              model: db.model("user"),
              through: db.model("project_editor"),
              as: "editors"
            },
            {
              model: db.model("project_survey"),
              where: { hierarchyLevel: 1 },
              required: false,
              include: [
                { model: db.model("user"), as: "creator" },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  required: false
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["first_name", "last_name", "email"]
                },
                {
                  model: db.model("project_survey"),
                  as: "forkFrom",
                  include: [{ model: db.model("user"), as: "creator" }]
                },
                { model: db.model("project_survey"), as: "descendents" },
                {
                  model: db.model("comment"),
                  required: false,
                  attributes: ["id", "reviewed", "hierarchyLevel"],
                  where: {
                    reviewed: {
                      [Sequelize.Op.or]: [
                        { [Sequelize.Op.eq]: "pending" },
                        { [Sequelize.Op.eq]: "verified" }
                      ]
                    },
                    hierarchyLevel: 1
                  },
                  include: [
                    {
                      model: db.model("issue"),
                      required: false
                    },
                    {
                      model: db.model("user"),
                      as: "upvotesFrom",
                      attributes: ["id"],
                      required: false
                    },
                    { model: db.model("comment"), as: "descendents" }
                  ],
                  order: [
                    [
                      { model: db.model("comment"), as: "descendents" },
                      "hierarchyLevel"
                    ]
                  ]
                },
                {
                  model: db.model("survey")
                }
              ],
              order: [
                ["createdAt", "DESC"],
                [
                  { model: db.model("project_survey"), as: "descendents" },
                  "hierarchyLevel"
                ]
              ]
            }
          ]
        };
        if (projectSymbol) {
          query.where = { symbol: projectSymbol };
        }
        return query;
      }
    }
  }
);

Project.getProjectWithStats = async function(projectSymbol) {
  const projectInstance = await Project.scope({
    method: ["withStats", projectSymbol]
  }).findOne();
  return getProjectStats(projectInstance, true);
};

Project.getProjects = async function() {
  const projectInstances = await Project.scope("withStats").findAll();
  return Promise.map(projectInstances, i => getProjectStats(i, false));
};

module.exports = Project;

/**
 *
 * helpers
 *
 */

async function getProjectStats(projectInstance, includeProjectSurveys) {
  var project = projectInstance.toJSON();
  var projectSurveys = await Promise.map(
    project.project_surveys,
    async rawProjectSurvey => {
      if (rawProjectSurvey.descendents.length) {
        projectSurvey = await db.model("project_survey").findOne({
          where: { id: rawProjectSurvey.descendents.slice(-1)[0].id },
          include: [
            {
              model: db.model("user"),
              as: "collaborators",
              required: false
            },
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("comment"),
              required: false,
              attributes: ["id", "reviewed", "hierarchyLevel"],
              where: {
                reviewed: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "pending" },
                    { [Sequelize.Op.eq]: "verified" }
                  ]
                },
                hierarchyLevel: 1
              },
              include: [
                {
                  model: db.model("issue"),
                  required: false
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["id"],
                  required: false
                },
                { model: db.model("comment"), as: "descendents" }
              ],
              order: [
                [
                  { model: db.model("comment"), as: "descendents" },
                  "hierarchyLevel"
                ]
              ]
            },
            {
              model: db.model("survey")
            }
          ]
        });
        return _.assignIn(
          _.pick(rawProjectSurvey, ["creator", "project"]),
          projectSurvey.toJSON()
        );
      } else {
        return rawProjectSurvey;
      }
    }
  );
  const numSurveys = projectSurveys.length;
  const numComments = projectSurveys.reduce((count, projectSurvey) => {
    const numTotalComments = projectSurvey.comments.filter(
      c => c.reviewed !== "spam"
    ).length;
    const numTotalReplies = projectSurvey.comments.reduce(
      (count, comment) =>
        comment.descendents && comment.descendents.length
          ? comment.descendents.filter(d => d.reviewed !== "spam").length +
            count
          : count,
      0
    );
    return numTotalComments + numTotalReplies + count;
  }, 0);
  const numCommentIssues = projectSurveys.reduce(
    (count, projectSurvey) =>
      projectSurvey.comments.filter(a => !!a.issue).length + count,
    0
  );
  const projectSurveysWithStats =
    projectSurveys && projectSurveys.length
      ? projectSurveys.map(s => {
          const numTotalComments = s.comments.filter(c => c.reviewed !== "spam")
            .length;
          const numTotalReplies = s.comments.reduce(
            (count, comment) =>
              comment.descendents && comment.descendents.length
                ? comment.descendents.filter(d => d.reviewed !== "spam")
                    .length + count
                : count,
            0
          );
          const numCommentIssues = s.comments.filter(a => !!a.issue).length;

          return _.assignIn(
            _.pick(s.survey, ["creator", "title", "description"]),
            _.omit(
              _.assignIn(s, {
                num_total_comments: numTotalComments + numTotalReplies,
                num_issues: numCommentIssues,
                project_symbol: project.symbol
              }),
              ["survey"]
            )
          );
        })
      : [];
  var assignees = {
    num_surveys: numSurveys,
    num_total_comments: numComments,
    num_issues: numCommentIssues
  };
  if (includeProjectSurveys)
    assignees.project_surveys = projectSurveysWithStats;
  return _.assignIn(_.omit(project, ["project_surveys"]), assignees);
}

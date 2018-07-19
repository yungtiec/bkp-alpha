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
              model: db.model("survey"),
              include: [
                { model: db.model("user"), as: "creator" },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  through: {
                    model: db.model("survey_collaborator"),
                    where: { revoked_access: { [Sequelize.Op.not]: true } }
                  },
                  required: false
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["name", "first_name", "last_name", "email"]
                },
                {
                  model: db.model("survey"),
                  as: "forkFrom"
                },
                {
                  model: db.model("project_survey"),
                  required: false,
                  include: [
                    { model: db.model("user"), as: "creator" },
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
                    }
                  ],
                  order: [
                    ["createdAt", "DESC"],
                    [
                      { model: db.model("project_survey"), as: "descendents" },
                      "hierarchyLevel",
                      "DESC"
                    ]
                  ]
                }
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

async function getProjectStats(projectInstance, includeSurveys) {
  var project = projectInstance.toJSON();
  var surveys = project.surveys;
  const numSurveys = surveys.length;
  const numComments = surveys.reduce((count, survey) => {
    const numTotalComments = survey.project_surveys
      .slice(-1)[0]
      .comments.filter(c => c.reviewed !== "spam").length;
    const numTotalReplies = survey.project_surveys
      .slice(-1)[0]
      .comments.reduce(
        (count, comment) =>
          comment.descendents && comment.descendents.length
            ? comment.descendents.filter(d => d.reviewed !== "spam").length +
              count
            : count,
        0
      );
    return numTotalComments + numTotalReplies + count;
  }, 0);
  const numCommentIssues = surveys.reduce(
    (count, survey) =>
      survey.project_surveys.slice(-1)[0].comments.filter(a => !!a.issue)
        .length + count,
    0
  );
  const surveysWithStats =
    surveys && surveys.length
      ? surveys.map(s => {
          const numTotalComments = s.project_surveys
            .slice(-1)[0]
            .comments.filter(c => c.reviewed !== "spam").length;
          const numTotalReplies = s.project_surveys
            .slice(-1)[0]
            .comments.reduce(
              (count, comment) =>
                comment.descendents && comment.descendents.length
                  ? comment.descendents.filter(d => d.reviewed !== "spam")
                      .length + count
                  : count,
              0
            );
          const numCommentIssues = s.project_surveys
            .slice(-1)[0]
            .comments.filter(a => !!a.issue).length;

          return _.assignIn(s, {
            num_total_comments: numTotalComments + numTotalReplies,
            num_issues: numCommentIssues,
            num_versions: s.project_surveys.length,
            project_symbol: project.symbol
          });
        })
      : [];
  var assignees = {
    num_surveys: numSurveys,
    num_total_comments: numComments,
    num_issues: numCommentIssues
  };
  if (includeSurveys) assignees.surveys = surveysWithStats;
  return _.assignIn(_.omit(project, ["surveys"]), assignees);
}

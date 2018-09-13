"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Project = db.define(
    "project",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      symbol: {
        type: DataTypes.STRING,
        unique: true
      },
      description: {
        type: DataTypes.TEXT
      },
      logo_url: {
        type: DataTypes.TEXT
      },
      website: {
        type: DataTypes.TEXT
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
                model: db.model("document"),
                include: [
                  { model: db.model("user"), as: "creator" },
                  {
                    model: db.model("user"),
                    as: "collaborators",
                    through: {
                      model: db.model("document_collaborator"),
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
                    model: db.model("document"),
                    as: "forkFrom"
                  },
                  {
                    model: db.model("version"),
                    required: false,
                    include: [
                      { model: db.model("user"), as: "creator" },
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
                    ]
                  }
                ],
                order: [
                  ["createdAt", "DESC"],
                  [{ model: db.model("version") }, "hierarchyLevel", "DESC"]
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
  Project.associate = function(models) {
    Project.belongsToMany(models.User, {
      through: "project_admin",
      as: "admins",
      foreignKey: "project_id"
    });
    Project.belongsToMany(models.User, {
      through: "project_editor",
      as: "editors",
      foreignKey: "project_id"
    });
    Project.hasMany(models.Document, {
      foreignKey: "project_id"
    });
  };
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
  return Project;
};

/**
 *
 * helpers
 *
 */

async function getProjectStats(projectInstance, includeDocuments) {
  var project = projectInstance.toJSON();
  var documents = project.documents;
  const numSurveys = documents.length;
  const numComments = documents.reduce((count, document) => {
    const numTotalComments = document.versions
      .slice(-1)[0]
      .comments.filter(c => c.reviewed !== "spam").length;
    const numTotalReplies = document.versions
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
  const numCommentIssues = documents.reduce(
    (count, document) =>
      document.versions.slice(-1)[0].comments.filter(a => !!a.issue).length +
      count,
    0
  );
  const documentsWithStats =
    documents && documents.length
      ? documents.map(s => {
          const numTotalComments = s.versions
            .slice(-1)[0]
            .comments.filter(c => c.reviewed !== "spam").length;
          const numTotalReplies = s.versions
            .slice(-1)[0]
            .comments.reduce(
              (count, comment) =>
                comment.descendents && comment.descendents.length
                  ? comment.descendents.filter(d => d.reviewed !== "spam")
                      .length + count
                  : count,
              0
            );
          const numCommentIssues = s.versions
            .slice(-1)[0]
            .comments.filter(a => !!a.issue).length;

          return _.assignIn(s, {
            num_total_comments: numTotalComments + numTotalReplies,
            num_issues: numCommentIssues,
            num_versions: s.versions.length,
            project_symbol: project.symbol
          });
        })
      : [];
  var assignees = {
    num_documents: numSurveys,
    num_total_comments: numComments,
    num_issues: numCommentIssues
  };
  if (includeDocuments) assignees.documents = documentsWithStats;
  return _.assignIn(_.omit(project, ["documents"]), assignees);
}

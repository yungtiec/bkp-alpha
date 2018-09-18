"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Project = db.define("project", {
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
  });
  Project.associate = function(models) {
    Project.belongsToMany(models.user, {
      through: "project_admins",
      as: "admins",
      foreignKey: "project_id"
    });
    Project.belongsToMany(models.user, {
      through: "project_editors",
      as: "editors",
      foreignKey: "project_id"
    });
    Project.hasMany(models.document, {
      foreignKey: "project_id"
    });
  };

  Project.loadScopes = function(models) {
    Project.addScope("withStats", function(projectSymbol) {
      var query = {
        include: [
          {
            model: models.user,
            through: "project_admins",
            as: "admins"
          },
          {
            model: models.user,
            through: "project_editors",
            as: "editors"
          },
          {
            model: models.document,
            include: [
              { model: models.user, as: "creator" },
              {
                model: models.user,
                as: "collaborators",
                through: {
                  model: models.document_collaborator,
                  where: { revoked_access: { [Sequelize.Op.not]: true } }
                },
                required: false
              },
              {
                model: models.user,
                as: "upvotesFrom",
                attributes: ["name", "first_name", "last_name", "email"]
              },
              {
                model: models.document,
                as: "forkFrom"
              },
              {
                model: models.version,
                required: false,
                include: [
                  { model: models.user, as: "creator" },
                  {
                    model: models.comment,
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
                        model: models.issue,
                        required: false
                      },
                      {
                        model: models.user,
                        as: "upvotesFrom",
                        attributes: ["id"],
                        required: false
                      },
                      { model: models.comment, as: "descendents" }
                    ],
                    order: [
                      [
                        { model: models.comment, as: "descendents" },
                        "hierarchyLevel"
                      ]
                    ]
                  }
                ]
              }
            ],
            order: [
              ["createdAt", "DESC"],
              [{ model: models.version }, "hierarchyLevel", "DESC"]
            ]
          }
        ]
      };
      if (projectSymbol) {
        query.where = { symbol: projectSymbol };
      }
      return query;
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

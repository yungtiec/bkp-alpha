"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Version = db.define("version", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    comment_until_unix: {
      type: DataTypes.BIGINT
    },
    scorecard: {
      type: DataTypes.JSONB
    },
    version_number: {
      type: DataTypes.TEXT
    }
  });

  Version.isHierarchy();
  Version.associate = function(models) {
    Version.hasMany(models.issue, {
      foreignKey: "resolving_version_id",
      as: "resolvedIssues"
    });
    Version.hasMany(models.comment, {
      foreignKey: "version_id"
    });
    Version.belongsTo(models.document, {
      foreignKey: "document_id"
    });
    Version.hasMany(models.version_question, {
      foreignKey: "version_id"
    });
    Version.belongsTo(models.user, {
      foreignKey: "creator_id",
      as: "creator"
    });
    Version.hasOne(models.wizard, {
      through: "wizard_schema_id",
      foreignKey: "id"
    });
  };
  Version.loadScopes = function(models) {
    Version.addScope("basic", function(versionId) {
      return {
        where: { id: versionId },
        include: [
          {
            model: models.user,
            as: "creator"
          }
        ]
      };
    });
    Version.addScope("byIdWithMetadata", function(versionId) {
      return {
        where: { id: versionId },
        include: [
          {
            model: models.user,
            as: "creator"
          },
          {
            model: models.document,
            include: [
              {
                model: models.project,
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
                  }
                ]
              },
              {
                model: models.version,
                attributes: [
                  "id",
                  "hierarchyLevel",
                  "version_number",
                  "creator_id",
                  "createdAt"
                ],
                include: [
                  { model: models.document },
                  {
                    model: models.user,
                    as: "creator"
                  },
                  {
                    model: models.issue,
                    as: "resolvedIssues", // use in SurveyProgress
                    required: false,
                    include: [
                      {
                        model: models.comment,
                        required: false
                      }
                    ]
                  },
                  {
                    model: models.comment, // use in SurveyIssues
                    required: false,
                    include: [
                      {
                        model: models.issue,
                        required: false,
                        where: { open: true }
                      }
                    ]
                  }
                ],
                order: [[{ model: models.version }, "hierarchyLevel"]]
              },
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
                as: "creator"
              },
              {
                model: models.user,
                as: "upvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              },
              {
                model: models.user,
                as: "downvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              }
            ]
          }
        ]
      };
    });
    Version.addScope("byIdWithVersionQuestions", function(versionId) {
      return {
        where: { id: Number(versionId) },
        include: [
          {
            model: models.version_question,
            where: { latest: true },
            include: [
              {
                model: models.version_answer,
                where: { latest: true },
                include: [
                  {
                    model: models.version_answer,
                    as: "ancestors",
                    attributes: ["id", "createdAt"],
                    required: false
                  },
                  {
                    model: models.version_answer,
                    as: "descendents",
                    attributes: ["id", "createdAt"],
                    required: false
                  }
                ],
                order: [
                  [
                    {
                      model: models.version_answer,
                      as: "descendents"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ],
                  [
                    {
                      model: models.version_answer,
                      as: "ancestors"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ]
                ]
              },
              {
                model: models.version_question,
                as: "ancestors",
                attributes: ["id", "createdAt"],
                required: false
              },
              {
                model: models.version_question,
                as: "descendents",
                attributes: ["id", "createdAt"],
                required: false
              }
            ],
            order: [
              [
                { model: models.version_question, as: "ancestors" },
                "hierarchyLevel",
                "DESC"
              ],
              [
                { model: models.version_question, as: "descendents" },
                "hierarchyLevel",
                "DESC"
              ]
            ]
          }
        ]
      };
    });
  };
  return Version;
};

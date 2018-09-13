"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Document = db.define(
    "document",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      forked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      original_document_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "version",
          key: "id"
        }
      },
      original_version_number: {
        type: DataTypes.INTEGER,
        references: {
          model: "document",
          key: "id"
        }
      },
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "project",
          key: "id"
        }
      },
      latest_version: {
        type: DataTypes.INTEGER
      }
    },
    {
      scopes: {
        includeVersionsWithOutstandingIssues: function(documentId) {
          return {
            where: { id: Number(documentId) },
            include: [
              {
                model: db.model("project"),
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
                  }
                ]
              },
              {
                model: db.model("version"),
                attributes: [
                  "id",
                  "hierarchyLevel",
                  "version_number",
                  "creator_id",
                  "createdAt"
                ],
                include: [
                  { model: db.model("document") },
                  {
                    model: db.model("user"),
                    as: "creator"
                  },
                  {
                    model: db.model("issue"),
                    as: "resolvedIssues", // use in SurveyProgress
                    required: false,
                    include: [
                      {
                        model: db.model("comment"),
                        required: false
                      }
                    ]
                  },
                  {
                    model: db.model("comment"), // use in SurveyIssues
                    required: false,
                    include: [
                      {
                        model: db.model("issue"),
                        required: false,
                        where: { open: true }
                      }
                    ]
                  }
                ],
                order: [[{ model: db.model("version") }, "hierarchyLevel"]]
              },
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
                as: "creator"
              },
              {
                model: db.model("user"),
                as: "upvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              },
              {
                model: db.model("user"),
                as: "downvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              }
            ]
          };
        },
        includeVersions: function(documentId) {
          var options = {
            include: [
              { model: db.model("version") },
              {
                model: db.model("project")
              }
            ],
            order: [
              ["createdAt", "DESC"],
              [{ model: db.model("version") }, "hierarchyLevel", "DESC"]
            ]
          };
          if (documentId) options.where = { id: documentId };
          return options;
        },
        includeVersionsWithAllEngagements: function() {
          return {
            include: [
              {
                model: db.model("user"),
                as: "upvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              },
              {
                model: db.model("user"),
                as: "downvotesFrom",
                attributes: ["name", "first_name", "last_name", "email", "id"]
              },
              {
                model: db.model("version"),
                include: [
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
              },
              {
                model: db.model("user"),
                as: "creator"
              },
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
                model: db.model("project")
              }
            ],
            order: [
              ["createdAt", "DESC"],
              [{ model: db.model("version") }, "hierarchyLevel", "DESC"]
            ]
          };
        }
      }
    }
  );
  Document.associate = function(models) {
    // associations can be defined here
  };

  Document.getDocumentsWithStats = async function({ offset, limit }) {
    var documentQueryResult = await Document.scope(
      "includeVersionsWithAllEngagements"
    ).findAndCountAll({
      limit,
      offset
    });
    var count = documentQueryResult.count;
    var documents = documentQueryResult.rows.map(computeDocumentStats);
    return { count, documents };
  };
  return Document;
};

function computeDocumentStats(document) {
  const issues = document.versions.reduce(
    (issueArr, ps) => ps.comments.filter(c => !!c.issue).concat(issueArr),
    []
  );
  const comments = document.versions.reduce(
    (commentArr, ps) => ps.comments.concat(commentArr),
    []
  );
  const replies = comments.reduce(
    (replyArr, comment) =>
      comment.descendents && comment.descendents.length
        ? comment.descendents
            .filter(d => d.reviewed !== "spam")
            .concat(replyArr)
        : replyArr,
    []
  );
  return _.assignIn(
    {
      num_versions: document.versions.length,
      num_outstanding_issues: issues.filter(c => !c.issue.open).length,
      num_resolved_issues: issues.filter(c => c.issue.open).length,
      num_issues: issues.length,
      num_pending_comments: comments.filter(c => c.reviewed === "pending")
        .length,
      num_total_comments: comments.filter(c => c.reviewed !== "spam").length,
      num_upvotes: document.upvotesFrom.length,
      num_downvotes: document.upvotesFrom.length,
      latest_version: document.versions[0]
    },
    document.toJSON()
  );
}

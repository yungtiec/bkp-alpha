const Sequelize = require("sequelize");
const db = require("../db");
const _ = require("lodash");

const Document = db.define(
  "document",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    forked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    original_document_id: {
      type: Sequelize.INTEGER
    },
    original_version_number: {
      type: Sequelize.INTEGER
    },
    project_id: {
      type: Sequelize.INTEGER
    },
    latest_version: {
      type: Sequelize.INTEGER
    }
  },
  {
    scopes: {
      includeVersions: function() {
        return {
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

module.exports = Document;

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

// num_pending_comments: numPendingComments + numPendingReplies,
// num_total_comments: numTotalComments + numTotalReplies,
// num_reaction: numCommentUpvotes + numReplyUpvotes,
// num_issues: numCommentIssues,

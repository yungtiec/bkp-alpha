"use strict";
const Sequelize = require("sequelize");
const { assignIn } = require("lodash");

module.exports = (db, DataTypes) => {
  const Comment = db.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: DataTypes.STRING
      },
      version_question_id: {
        type: DataTypes.INTEGER
      },
      version_answer_id: {
        type: DataTypes.INTEGER
      },
      quote: {
        type: DataTypes.TEXT
      },
      comment: {
        type: DataTypes.TEXT
      },
      annotator_schema_version: {
        type: DataTypes.STRING
      },
      ranges: {
        type: DataTypes.ARRAY(DataTypes.JSON)
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reviewed: {
        type: DataTypes.ENUM("pending", "spam", "verified"),
        defaultValue: "pending"
      }
    },
    {
      scopes: {
        withVersions: function(moreIncludeOptions) {
          var options = {
            include: [
              {
                model: db.model("version"),
                include: [
                  {
                    model: db.model("document"),
                    attributes: ["title"],
                    include: [
                      {
                        model: db.model("user"),
                        as: "collaborators",
                        through: {
                          model: db.model("document_collaborator"),
                          where: {
                            revoked_access: { [Sequelize.Op.not]: true }
                          }
                        },
                        required: false
                      },
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
                      }
                    ]
                  }
                ]
              }
            ]
          };
          if (moreIncludeOptions)
            options.include = options.include.concat(moreIncludeOptions);
          return options;
        },
        upvotes: function(commentId) {
          return {
            where: { id: commentId },
            include: [
              {
                model: db.model("user"),
                as: "upvotesFrom",
                attributes: ["first_name", "last_name", "name", "email", "id"]
              },
              {
                model: db.model("user"),
                as: "owner",
                attributes: [
                  "id",
                  "first_name",
                  "last_name",
                  "name",
                  "email",
                  "id",
                  "anonymity"
                ]
              },
              {
                model: db.model("version"),
                include: [
                  {
                    model: db.model("document"),
                    include: [
                      {
                        model: db.model("project"),
                        attributes: ["symbol"]
                      }
                    ]
                  }
                ]
              },
              {
                model: db.model("comment"),
                as: "ancestors",
                required: false,
                attributes: ["id", "owner_id"],
                include: [
                  {
                    model: db.model("user"),
                    as: "owner",
                    required: false
                  }
                ],
                order: [
                  [
                    {
                      model: Comment,
                      as: "ancestors"
                    },
                    "hierarchyLevel"
                  ]
                ]
              }
            ]
          };
        },
        flatThreadByRootId: function(options) {
          var query = {
            include: [
              {
                model: db.model("user"),
                as: "upvotesFrom",
                attributes: ["first_name", "last_name", "name", "email", "id"]
              },
              {
                model: db.model("user"),
                as: "owner",
                attributes: [
                  "id",
                  "first_name",
                  "last_name",
                  "name",
                  "email",
                  "anonymity"
                ],
                include: [
                  {
                    model: db.model("role")
                  }
                ]
              },
              {
                model: db.model("tag"),
                attributes: ["name", "id"]
              },
              {
                model: db.model("version"),
                include: [
                  {
                    model: db.model("document"),
                    include: [
                      {
                        model: db.model("project"),
                        attributes: ["symbol"]
                      }
                    ]
                  }
                ]
              },
              {
                model: db.model("issue"),
                attributes: ["open", "id"],
                include: [
                  {
                    model: db.model("version"),
                    as: "resolvingVersion",
                    include: [
                      {
                        model: db.model("document"),
                        include: [
                          {
                            model: db.model("project"),
                            attributes: ["symbol"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                model: Comment,
                required: false,
                include: [
                  {
                    model: db.model("user"),
                    as: "upvotesFrom",
                    attributes: [
                      "first_name",
                      "last_name",
                      "name",
                      "email",
                      "id"
                    ]
                  },
                  {
                    model: db.model("user"),
                    as: "owner",
                    attributes: [
                      "id",
                      "first_name",
                      "last_name",
                      "name",
                      "email",
                      "anonymity"
                    ],
                    include: [
                      {
                        model: db.model("role")
                      }
                    ]
                  },
                  {
                    model: Comment,
                    as: "parent",
                    required: false,
                    include: [
                      {
                        model: db.model("user"),
                        as: "owner",
                        attributes: [
                          "id",
                          "first_name",
                          "last_name",
                          "name",
                          "email",
                          "anonymity"
                        ],
                        include: [
                          {
                            model: db.model("role")
                          }
                        ]
                      }
                    ]
                  }
                ],
                as: "descendents"
              }
            ],
            order: [
              [
                {
                  model: Comment,
                  as: "descendents"
                },
                "createdAt"
              ]
            ]
          };
          if (options) query = assignIn(options, query);
          return query;
        }
      }
    }
  );
  Comment.isHierarchy();
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      foreignKey: "owner_id",
      as: "owner"
    });
    Comment.belongsToMany(models.User, {
      as: "upvotesFrom",
      through: "comment_upvote",
      foreignKey: "comment_id"
    });
    Comment.belongsToMany(models.Tag, {
      through: "comment_tag",
      foreignKey: "comment_id"
    });
    Comment.hasOne(models.Issue, {
      foreignKey: "comment_id"
    });
    Comment.belongsTo(models.Version, {
      foreignKey: "version_id"
    });
    Comment.belongsTo(models.VersionQuestion, {
      foreignKey: "version_question_id"
    });
  };

  return Comment;
};

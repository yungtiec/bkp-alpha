"use strict";

module.exports = (db, DataTypes) => {
  const VersionQuestion = db.define(
    "version_question",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      version_id: {
        type: DataTypes.INTEGER
      },
      order_in_version: {
        type: DataTypes.INTEGER
      },
      markdown: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      latest: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      scopes: {
        withVersionAnswers: function(id) {
          return {
            where: { id },
            include: [
              {
                model: db.model("version_answer"),
                where: { latest: true },
                include: [
                  {
                    model: db.model("version_answer"),
                    as: "ancestors",
                    attributes: ["id", "createdAt"],
                    required: false
                  },
                  {
                    model: db.model("version_answer"),
                    as: "descendents",
                    attributes: ["id", "createdAt"],
                    required: false
                  }
                ],
                order: [
                  [
                    {
                      model: db.model("version_answer"),
                      as: "descendents"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ],
                  [
                    {
                      model: db.model("version_answer"),
                      as: "ancestors"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ]
                ]
              }
            ]
          };
        },
        withAncestorsAndVersionAnswers: function(id) {
          return {
            where: { id },
            include: [
              {
                model: db.model("version_answer"),
                where: { latest: true },
                include: [
                  {
                    model: db.model("version_answer"),
                    as: "ancestors",
                    attributes: ["id", "createdAt"],
                    required: false
                  },
                  {
                    model: db.model("version_answer"),
                    as: "descendents",
                    attributes: ["id", "createdAt"],
                    required: false
                  }
                ],
                order: [
                  [
                    {
                      model: db.model("version_answer"),
                      as: "descendents"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ],
                  [
                    {
                      model: db.model("version_answer"),
                      as: "ancestors"
                    },
                    "hierarchyLevel",
                    "DESC"
                  ]
                ]
              },
              {
                model: db.model("version_question"),
                as: "ancestors",
                attributes: ["id", "createdAt"]
              }
            ],
            order: [
              [
                { model: db.model("version_question"), as: "ancestors" },
                "hierarchyLevel",
                "DESC"
              ]
            ]
          };
        }
      }
    }
  );
  VersionQuestion.associate = function(models) {
    // associations can be defined here
  };
  return VersionQuestion;
};

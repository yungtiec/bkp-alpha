"use strict";

module.exports = (db, DataTypes) => {
  const VersionQuestion = db.define("version_question", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
  });
  VersionQuestion.isHierarchy();
  VersionQuestion.associate = function(models) {
    VersionQuestion.belongsTo(models.version, {
      foreignKey: "version_id"
    });
    VersionQuestion.hasMany(models.version_answer, {
      foreignKey: "version_question_id"
      // constraints: false
    });
    VersionQuestion.hasMany(models.comment, {
      foreignKey: "version_question_id"
    });
  };
  VersionQuestion.loadScopes = function(models) {
    VersionQuestion.addScope("withVersionAnswers", function(id) {
      return {
        where: { id },
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
          }
        ]
      };
    });
    VersionQuestion.addScope("withAncestorsAndVersionAnswers", function(id) {
      return {
        where: { id },
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
            attributes: ["id", "createdAt"]
          }
        ],
        order: [
          [
            { model: models.version_question, as: "ancestors" },
            "hierarchyLevel",
            "DESC"
          ]
        ]
      };
    });
  };
  return VersionQuestion;
};

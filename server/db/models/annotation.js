const Sequelize = require("sequelize");
const db = require("../db");

const Annotation = db.define(
  "annotation",
  {
    uri: {
      type: Sequelize.STRING,
      allowNull: false
    },
    survey_question_id: {
      type: Sequelize.INTEGER,
    },
    survey_answer_id: {
      type: Sequelize.INTEGER
    },
    quote: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT
    },
    annotator_schema_version: {
      type: Sequelize.STRING
    },
    ranges: {
      type: Sequelize.ARRAY(Sequelize.JSON)
    },
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    reviewed: {
      type: Sequelize.ENUM("pending", "spam", "verified"),
      defaultValue: "pending"
    }
  },
  {
    hierarchy: true
  }
);

Annotation.getAnnotationsFromUrl = function(uri) {
  return Annotation.findAll({
    where: { uri, parentId: null, reviewed: { [Sequelize.Op.ne]: "spam" } },
    include: [
      {
        model: db.model("user"),
        as: "upvotesFrom",
        attributes: ["first_name", "last_name", "email"]
      },
      {
        model: db.model("user"),
        as: "owner",
        attributes: ["first_name", "last_name", "email"]
      },
      {
        model: db.model("tag"),
        attributes: ["name", "id"]
      },
      {
        model: db.model("issue"),
        attributes: ["open", "id"]
      },
      {
        model: Annotation,
        where: {
          reviewed: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.eq]: "pending" },
              { [Sequelize.Op.eq]: "verified" }
            ]
          }
        },
        required: false,
        include: [
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"]
          },
          {
            model: db.model("user"),
            as: "owner",
            attributes: ["first_name", "last_name", "email"]
          }
        ],
        as: "descendents",
        hierarchy: true
      }
    ]
  });
};

Annotation.findOneThreadByRootId = function(id) {
  return Annotation.findOne({
    where: { id, reviewed: { [Sequelize.Op.ne]: "spam" } },
    include: [
      {
        model: db.model("user"),
        as: "upvotesFrom",
        attributes: ["first_name", "last_name", "email"]
      },
      {
        model: db.model("user"),
        as: "owner",
        attributes: ["first_name", "last_name", "email"]
      },
      {
        model: db.model("tag"),
        attributes: ["name", "id"]
      },
      {
        model: db.model("issue"),
        attributes: ["open", "id"]
      },
      {
        model: Annotation,
        where: {
          reviewed: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.eq]: "pending" },
              { [Sequelize.Op.eq]: "verified" }
            ]
          }
        },
        required: false,
        include: [
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"]
          },
          {
            model: db.model("user"),
            as: "owner",
            attributes: ["first_name", "last_name", "email"]
          }
        ],
        as: "descendents",
        hierarchy: true
      }
    ]
  });
};

module.exports = Annotation;

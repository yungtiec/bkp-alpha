const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn } = require("lodash");

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      // Making `.password` act like a func hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue("password");
      }
    },
    salt: {
      type: Sequelize.STRING,
      // Making `.salt` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue("salt");
      }
    },
    googleId: {
      type: Sequelize.STRING
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    organization: {
      type: Sequelize.STRING
    }
  },
  {
    scopes: {
      annotations: function({ userId, limit, offset, reviewStatus, projects }) {
        var annotationQueryObj = getAnnotationQueryObj({
          queryObj: { userId, limit, offset, reviewStatus, projects },
          order: true
        });
        return {
          where: { id: userId },
          attributes: [
            "id",
            "email",
            "first_name",
            "last_name",
            "organization"
          ],
          include: [annotationQueryObj]
        };
      },
      annotationCount: function({
        userId,
        limit,
        offset,
        reviewStatus,
        projects
      }) {
        var annotationQueryObj = getAnnotationQueryObj({
          queryObj: { userId, limit, offset, reviewStatus, projects },
          order: false,
          pageCount: true
        });
        return {
          where: { id: userId },
          attributes: ["id"],
          include: [annotationQueryObj]
        };
      },
      pageComments: function({ userId, limit, offset }) {
        return {
          where: { id: userId },
          attributes: [
            "id",
            "email",
            "first_name",
            "last_name",
            "organization"
          ],
          include: [
            {
              model: db.model("project_survey_comment"),
              as: "projectSurveyComments",
              required: false,
              limit,
              offset,
              include: [
                {
                  model: db.model("project_survey_comment"),
                  as: "ancestors",
                  required: false,
                  include: [
                    {
                      model: db.model("user"),
                      as: "owner",
                      required: false
                    },
                    {
                      model: db.model("tag"),
                      required: false
                    },
                    {
                      model: db.model("issue"),
                      required: false
                    }
                  ]
                },
                {
                  model: db.model("tag"),
                  required: false
                },
                {
                  model: db.model("issue"),
                  required: false
                },
                {
                  model: db.model("project_survey"),
                  attributes: ["id"],
                  include: [
                    {
                      model: db.model("project"),
                      attributes: ["id", "symbol", "name"]
                    },
                    {
                      model: db.model("survey"),
                      attributes: ["id", "title"]
                    }
                  ]
                }
              ],
              order: [
                [
                  {
                    model: db.model("project_survey_comment"),
                    as: "ancestors"
                  },
                  "hierarchyLevel"
                ]
              ]
            }
          ]
        };
      },
      roles: function(userId) {
        return {
          where: { id: userId },
          include: [
            {
              model: db.model("role")
            }
          ]
        };
      },
      basicInfo: function(userId) {
        return {
          where: { id: userId },
          attributes: ["id", "email", "first_name", "last_name", "organization"]
        };
      }
    }
  }
);

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

User.prototype.hasPermission = async function(permissionName) {
  const userRoles = await this.getRoles({
    include: [
      {
        model: db.model("permission")
      }
    ]
  });
  return userRoles
    .map(role =>
      role.permissions.reduce(
        (bool, permission) => permission.name === permissionName || bool,
        false
      )
    )
    .reduce((bool, roleHasPermission) => roleHasPermission || bool, false);
};

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(plainText)
    .update(salt)
    .digest("hex");
};

User.getContributions = async function(userId) {
  const user = await User.scope({
    method: ["basicInfo", Number(userId)]
  }).findOne();
  const [numAnnotations, numPageComments] = await Promise.map(
    [
      user.getAnnotations({ attributes: ["id"], raw: true }),
      user.getProjectSurveyComments({ attributes: ["id"], raw: true })
    ],
    collections => collections.length
  );
  const [numAnnoationIssues, numPageCommentIssues] = await Promise.map(
    [
      user.getAnnotations({ include: [{ model: db.model("issue") }] }),
      user.getProjectSurveyComments({ include: [{ model: db.model("issue") }] })
    ],
    collections =>
      collections.filter(item => item.issue && item.issue.open).length
  );
  return assignIn(
    {
      num_annotations: numAnnotations,
      num_page_comments: numPageComments,
      num_issues: numAnnoationIssues + numPageCommentIssues
    },
    user.toJSON()
  );
};

User.getAnnotationsAndCount = async function(queryObj) {
  const user = await User.scope({
    method: ["annotations", queryObj]
  }).findOne();
  const { annotations } = await User.scope({
    method: ["annotationCount", queryObj]
  }).findOne();
  console.log(annotations.length)
  return {profile: user, annotationCount: annotations.length};
};

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

/**
 * helpers
 */

function getAnnotationQueryObj({
  queryObj: { userId, limit, offset, reviewStatus, projects },
  order,
  pageCount
}) {
  var projectSurveyQuery = projects
    ? {
        model: db.model("project_survey"),
        attributes: ["id"],
        required: true,
        include: [
          {
            model: db.model("project"),
            where: { id: projects },
            required: true,
            attributes: ["id", "symbol", "name"]
          },
          {
            model: db.model("survey"),
            attributes: ["id", "title"]
          }
        ]
      }
    : {
        model: db.model("project_survey"),
        attributes: ["id"],
        include: [
          {
            model: db.model("project"),
            attributes: ["id", "symbol", "name"]
          },
          {
            model: db.model("survey"),
            attributes: ["id", "title"]
          }
        ]
      };
  var annotationQueryObj = {
    model: db.model("annotation"),
    where: { reviewed: reviewStatus },
    as: "annotations",
    subQuery: false,
    duplicate: false,
    include: [
      {
        model: db.model("annotation"),
        as: "ancestors",
        required: false,
        include: [
          {
            model: db.model("user"),
            as: "owner",
            required: false
          },
          {
            model: db.model("tag"),
            required: false
          },
          {
            model: db.model("issue"),
            required: false
          }
        ]
      },
      {
        model: db.model("tag"),
        required: false
      },
      {
        model: db.model("issue"),
        required: false
      },
      projectSurveyQuery
    ]
  };
  if (order) {
    annotationQueryObj.order = [
      [
        {
          model: db.model("project_survey")
        },
        "id",
        "DESC"
      ],
      ["createdAt", "DESC"],
      ["updatedAt", "DESC"]
    ];
  }
  if (!pageCount) {
    annotationQueryObj.limit = limit;
    annotationQueryObj.offset = offset;
  }
  return annotationQueryObj;
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

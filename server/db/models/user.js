const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn, cloneDeep } = require("lodash");

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
      annotations: function({
        userId,
        limit,
        offset,
        reviewStatus,
        issueStatus,
        projects
      }) {
        var annotationQueryObj = getEngagementItemQueryObj({
          engagementItemModelName: "annotation",
          engagementItemAs: "annotations",
          queryObj: {
            userId,
            limit,
            offset,
            reviewStatus,
            projects,
            issueStatus
          },
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
        projects,
        issueStatus
      }) {
        var annotationQueryObj = getEngagementItemQueryObj({
          engagementItemModelName: "annotation",
          engagementItemAs: "annotations",
          queryObj: {
            userId,
            limit,
            offset,
            reviewStatus,
            projects,
            issueStatus
          },
          order: false,
          pageCount: true
        });
        return {
          where: { id: userId },
          attributes: ["id"],
          include: [annotationQueryObj]
        };
      },
      pageComments: function({
        userId,
        limit,
        offset,
        reviewStatus,
        issueStatus,
        projects
      }) {
        var pageCommentQueryObj = getEngagementItemQueryObj({
          engagementItemModelName: "project_survey_comment",
          engagementItemAs: "projectSurveyComments",
          queryObj: {
            userId,
            limit,
            offset,
            reviewStatus,
            projects,
            issueStatus
          },
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
          include: [pageCommentQueryObj]
        };
      },
      pageCommentCount: function({
        userId,
        limit,
        offset,
        reviewStatus,
        projects,
        issueStatus
      }) {
        var pageCommentQueryObj = getEngagementItemQueryObj({
          engagementItemModelName: "project_survey_comment",
          engagementItemAs: "projectSurveyComments",
          queryObj: {
            userId,
            limit,
            offset,
            reviewStatus,
            projects,
            issueStatus
          },
          order: false,
          pageCount: true
        });
        return {
          where: { id: userId },
          attributes: ["id"],
          include: [pageCommentQueryObj]
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
    method: ["annotations", cloneDeep(queryObj)]
  }).findOne();
  const { annotations } = await User.scope({
    method: ["annotationCount", cloneDeep(queryObj)]
  }).findOne();
  return { profile: user, annotationCount: annotations.length };
};

User.getPageCommentsAndCount = async function(queryObj) {
  const user = await User.scope({
    method: ["pageComments", cloneDeep(queryObj)]
  }).findOne();
  const { projectSurveyComments } = await User.scope({
    method: ["pageCommentCount", cloneDeep(queryObj)]
  }).findOne();
  return { profile: user, pageCommentCount: projectSurveyComments.length };
}

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

function getEngagementItemQueryObj({
  engagementItemModelName,
  engagementItemAs,
  queryObj: { userId, limit, offset, reviewStatus, issueStatus, projects },
  order,
  pageCount
}) {
  var projectSurveyQuery = projects
    ? {
        model: db.model("project_survey"),
        where: { project_id: projects },
        duplicating: false,
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
    : {
        model: db.model("project_survey"),
        attributes: ["id"],
        required: true,
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
  var issueQuery = issueStatus
    ? {
        model: db.model("issue"),
        where: { open: issueStatus }
      }
    : {
        model: db.model("issue"),
        required: false
      };
  var engagementItemQueryObj = {
    model: db.model(engagementItemModelName),
    where: { reviewed: reviewStatus },
    as: engagementItemAs,
    subQuery: false,
    required: false,
    include: [
      {
        model: db.model(engagementItemModelName),
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
      issueQuery,
      projectSurveyQuery
    ]
  };
  if (order) {
    engagementItemQueryObj.order = [
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
    engagementItemQueryObj.limit = limit;
    engagementItemQueryObj.offset = offset;
  }
  return engagementItemQueryObj;
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

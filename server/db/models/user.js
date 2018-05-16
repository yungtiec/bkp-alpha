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
    },
    restricted_access: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
      projectSurveyComments: function({
        userId,
        limit,
        offset,
        reviewStatus,
        issueStatus,
        projects
      }) {
        var ProjectSurveyCommentQueryObj = getEngagementItemQueryObj({
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
          include: [ProjectSurveyCommentQueryObj]
        };
      },
      projectSurveyCommentCount: function({
        userId,
        limit,
        offset,
        reviewStatus,
        projects,
        issueStatus
      }) {
        var ProjectSurveyCommentQueryObj = getEngagementItemQueryObj({
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
          include: [ProjectSurveyCommentQueryObj]
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
          attributes: [
            "id",
            "email",
            "first_name",
            "last_name",
            "organization",
            "restricted_access",
            "createdAt"
          ],
          include: [
            {
              model: db.model("role"),
              attributes: ["name"]
            }
          ]
        };
      },
      notifications: function(userId) {
        return {
          where: { id: userId },
          attributes: ["id"],
          include: [
            {
              model: db.model("notification"),
              required: false,
              as: "notifications",
              where: {
                status: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "unread" },
                    { [Sequelize.Op.eq]: "seen" }
                  ]
                }
              },
              include: [
                {
                  model: db.model("user"),
                  as: "sender",
                  attributes: [
                    "id",
                    "email",
                    "first_name",
                    "last_name",
                    "organization"
                  ]
                }
              ]
            }
          ]
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
  const [annotations, projectSurveyComments, notifications] = await Promise.all(
    [
      user.getAnnotations({
        attributes: ["id", "reviewed"],
        include: [
          {
            model: db.model("issue"),
            required: false
          },
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"],
            required: false
          }
        ]
      }),
      user.getProjectSurveyComments({
        attributes: ["id", "reviewed"],
        include: [
          {
            model: db.model("issue"),
            required: false
          },
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"],
            required: false
          }
        ]
      }),
      user.getNotifications({
        where: {
          status: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.eq]: "unread" },
              { [Sequelize.Op.eq]: "seen" }
            ]
          }
        }
      })
    ]
  );
  const numAnnoationIssues = annotations.filter(item => item.issue).length;
  const numAnnotationUpvotes = annotations.reduce(
    (count, item) =>
      item.upvotesFrom ? item.upvotesFrom.length + count : count,
    0
  );
  const numProjectSurveyCommentIssues = projectSurveyComments.filter(
    item => item.issue
  ).length;
  const numProjectSurveyUpvotes = projectSurveyComments.reduce(
    (count, item) =>
      item.upvotesFrom ? item.upvotesFrom.length + count : count,
    0
  );
  const numAnnoationSpam = annotations.filter(item => item.reviewed === "spam")
    .length;
  const numProjectSurveyCommentSpam = projectSurveyComments.filter(
    item => item.reviewed === "spam"
  ).length;
  return assignIn(
    {
      num_annotations: annotations.length,
      num_project_survey_comments: projectSurveyComments.length,
      num_spam: numAnnoationSpam + numProjectSurveyCommentSpam,
      num_issues: numAnnoationIssues + numProjectSurveyCommentIssues,
      num_notifications: notifications.length,
      num_upvotes: numProjectSurveyUpvotes + numAnnotationUpvotes
    },
    user.toJSON()
  );
};

User.getUserListWithContributions = async function() {
  const users = await Promise.map(User.findAll(), user =>
    User.getContributions(user.id)
  );
  return users;
};

User.getAnnotationsAndCount = async function(queryObj) {
  const user = await User.scope({
    method: ["annotations", cloneDeep(queryObj)]
  }).findOne();
  var { annotations } = await User.scope({
    method: ["annotationCount", cloneDeep(queryObj)]
  }).findOne();
  annotations = annotations.map(annotation => {
    annotation = annotation.toJSON();
    if (!annotation.parentId) return assignIn({ ancestors: [] }, annotation);
    if (annotation.parent.ancestors.length) {
      annotation.ancestors = annotation.parent.ancestors.concat(
        annotation.parent
      );
    } else {
      annotation.ancestors = [annotation.parent];
    }
    return annotation;
  });
  return { annotations, annotationCount: annotations.length };
};

User.getProjectSurveyCommentsAndCount = async function(queryObj) {
  const user = await User.scope({
    method: ["projectSurveyComments", cloneDeep(queryObj)]
  }).findOne();
  var { projectSurveyComments } = await User.scope({
    method: ["projectSurveyCommentCount", cloneDeep(queryObj)]
  }).findOne();
  projectSurveyComments = projectSurveyComments.map(projectSurveyComment => {
    projectSurveyComment = projectSurveyComment.toJSON();
    if (!projectSurveyComment.parentId)
      return assignIn({ ancestors: [] }, projectSurveyComment);
    if (projectSurveyComment.parent.ancestors.length) {
      projectSurveyComment.ancestors = projectSurveyComment.parent.ancestors.concat(
        projectSurveyComment.parent
      );
    } else {
      projectSurveyComment.ancestors = [projectSurveyComment.parent];
    }
    return projectSurveyComment;
  });
  return {
    projectSurveyComments,
    projectSurveyCommentCount: projectSurveyComments.length
  };
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
        model: db.model("tag"),
        required: false
      },
      {
        model: db.model(engagementItemModelName),
        as: "parent", // for unknown reason, include ancestors here doesn't work
        required: false,
        include: [
          {
            model: db.model("tag"),
            required: false
          },
          {
            model: db.model("user"),
            as: "owner"
          },
          {
            model: db.model("issue"),
            required: false
          },
          {
            model: db.model(engagementItemModelName),
            as: "ancestors",
            required: false
          }
        ]
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
        "ASC"
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

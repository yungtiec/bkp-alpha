const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn, cloneDeep, omit } = require("lodash");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
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
      comments: function({
        userId,
        limit,
        offset,
        reviewStatus,
        issueStatus,
        projects
      }) {
        var commentQueryObj = getCommentQueryObj({
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
          include: [commentQueryObj]
        };
      },
      commentCount: function({
        userId,
        limit,
        offset,
        reviewStatus,
        projects,
        issueStatus
      }) {
        var commentQueryObj = getCommentQueryObj({
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
          include: [commentQueryObj]
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
      basicInfo: function({ userId, googleId }) {
        var query;
        if (userId) query = { id: userId };
        if (googleId) query = { googleId };
        return {
          where: query,
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
            },
            { model: db.model("project"), as: "managedProjects" },
            { model: db.model("project"), as: "editedProjects" }
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

User.getContributions = async function({ userId, googleId, forListing }) {
  var query;
  if (userId) query = { userId: Number(userId) };
  if (googleId) query = { googleId };
  const user = await User.scope({
    method: ["basicInfo", query]
  }).findOne();
  const [comments, notifications] = await Promise.all([
    user.getComments({
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
  ]);
  const numCommentIssues = comments.filter(item => item.issue).length;
  const numCommentUpvotes = comments.reduce(
    (count, item) =>
      item.upvotesFrom ? item.upvotesFrom.length + count : count,
    0
  );

  const numCommentSpam = comments.filter(item => item.reviewed === "spam")
    .length;

  return assignIn(
    {
      num_comments: comments.length,
      num_issues: numCommentIssues,
      num_upvotes: numCommentUpvotes,
      num_spam: numCommentSpam
    },
    forListing ? omit(user.toJSON(), ["roles"]) : user.toJSON()
  );
};

User.getUserListWithContributions = async function(query) {
  const users = await Promise.map(User.findAll(query), user =>
    User.getContributions({ userId: user.id, forListing: true })
  );
  return users;
};

User.getCommentsAndCount = async function(queryObj) {
  const user = await User.scope({
    method: ["comments", cloneDeep(queryObj)]
  }).findOne();
  var { comments } = await User.scope({
    method: ["commentCount", cloneDeep(queryObj)]
  }).findOne();
  pagedComments = user.comments.map(comment => {
    comment = comment.toJSON();
    if (!comment.parentId) return assignIn({ ancestors: [] }, comment);
    if (comment.parent.ancestors.length) {
      comment.ancestors = comment.parent.ancestors.concat(comment.parent);
    } else {
      comment.ancestors = [comment.parent];
    }
    return comment;
  });
  return { pagedComments, commentCount: comments.length };
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

function getCommentQueryObj({
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
  var commentQueryObj = {
    model: db.model("comment"),
    where: { reviewed: reviewStatus },
    as: "comments",
    subQuery: false,
    required: false,
    include: [
      {
        model: db.model("tag"),
        required: false
      },
      {
        model: db.model("comment"),
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
            model: db.model("comment"),
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
    commentQueryObj.order = [
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
    commentQueryObj.limit = limit;
    commentQueryObj.offset = offset;
  }
  return commentQueryObj;
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

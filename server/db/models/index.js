const User = require("./user");
const Comment = require("./comment");
const Role = require("./role");
const Project = require("./project");
const Document = require("./document");
const DocumentCollaborator = require("./document-collaborator");
const Version = require("./version");
const VersionAnswer = require("./version-answer");
const VersionQuestion = require("./version-question");
// const Question = require("./question");
const QuestionCategory = require("./question-category");
const Tag = require("./tag");
const Issue = require("./issue");
const Notification = require("./notification");
const ProjectAdmin = require("./project-admin");
const ProjectEditor = require("./project-editor");
Comment.isHierarchy();

/*=============================================
=            role based authorization         =
==============================================*/
/**
 * https://stackoverflow.com/questions/190257/best-role-based-access-control-rbac-database-model
 */

User.belongsToMany(Role, {
  through: "user_role",
  foreignKey: "user_id"
});
Role.belongsToMany(User, {
  through: "user_role",
  foreignKey: "role_id"
});

/*=====  End of role based authorization  ===*/

/*==============================================
=            User and Notification            =
==============================================*/

User.hasMany(Notification, {
  foreignKey: "recipient_id",
  as: "notifications",
  constraints: false
});
Notification.belongsTo(User, {
  foreignKey: "recipient_id",
  as: "recipient",
  constraints: false
});

User.hasMany(Notification, {
  foreignKey: "sender_id",
  as: "activities",
  constraints: false
});
Notification.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
  constraints: false
});

/*=====  End of User and Notification  ======*/

/*=============================================
=            User and Organization            =
=============================================*/

User.belongsToMany(Project, {
  through: "project_admin",
  as: "managedProjects",
  foreignKey: "user_id"
});
Project.belongsToMany(User, {
  through: "project_admin",
  as: "admins",
  foreignKey: "project_id"
});

User.belongsToMany(Project, {
  through: "project_editor",
  as: "editedProjects",
  foreignKey: "user_id"
});
Project.belongsToMany(User, {
  through: "project_editor",
  as: "editors",
  foreignKey: "project_id"
});

/*=====  End of User and Organization  ======*/

/*==============================================
=                  Comment                  =
==============================================*/

/*----------  User and Comment  ----------*/
User.belongsToMany(Comment, {
  as: "upvotedComments",
  through: "comment_upvote",
  foreignKey: "user_id"
});
Comment.belongsToMany(User, {
  as: "upvotesFrom",
  through: "comment_upvote",
  foreignKey: "comment_id"
});

User.hasMany(Comment, {
  foreignKey: "owner_id",
  as: "comments"
});
Comment.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner"
});

/*----------  Comment and Tag  ----------*/
Tag.belongsToMany(Comment, {
  through: "comment_tag",
  foreignKey: "tag_id"
});
Comment.belongsToMany(Tag, {
  through: "comment_tag",
  foreignKey: "comment_id"
});

/*----------  Comment and Issue  ----------*/
Comment.hasOne(Issue, {
  foreignKey: "comment_id"
});
Issue.belongsTo(Comment, {
  foreignKey: "comment_id"
});

/*----------  Issue and Project Survey  ----------*/
Version.hasMany(Issue, {
  foreignKey: "resolving_version_id",
  as: "resolvedIssues"
});
Issue.belongsTo(Version, {
  foreignKey: "resolving_version_id",
  as: "resolvingVersion"
});

/*----------  Comment and Project Survey  ----------*/
Version.hasMany(Comment, {
  foreignKey: "version_id"
});
Comment.belongsTo(Version, {
  foreignKey: "version_id"
});

/*=====  End of Comment  ======*/

/*==============================================
=                    Survey                    =
==============================================*/

Version.belongsTo(Document, {
  foreignKey: "document_id"
});
Document.hasMany(Version, {
  foreignKey: "document_id"
});

Document.belongsTo(Project, {
  foreignKey: "project_id"
});
Project.hasMany(Document, {
  foreignKey: "project_id"
});

User.hasMany(Document, {
  foreignKey: "creator_id",
  as: "documents"
});
Document.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator"
});

// Question.belongsToMany(Version, {
//   through: VersionQuestion,
//   foreignKey: "question_id"
// });
// Version.belongsToMany(Question, {
//   through: VersionQuestion,
//   foreignKey: "version_id"
// });
VersionQuestion.belongsTo(Version, {
  foreignKey: "version_id"
});
// VersionQuestion.belongsTo(Question, {
//   foreignKey: "question_id"
// });
// Question.hasMany(VersionQuestion, {
//   foreignKey: "question_id"
// });
Version.hasMany(VersionQuestion, {
  foreignKey: "version_id"
});

VersionQuestion.belongsToMany(Version, {
  through: VersionAnswer,
  foreignKey: "version_question_id"
});
Version.belongsToMany(VersionQuestion, {
  through: VersionAnswer,
  foreignKey: "version_id"
});
VersionAnswer.belongsTo(Version, {
  foreignKey: "version_id"
});
VersionAnswer.belongsTo(VersionQuestion, {
  foreignKey: "version_question_id"
});
VersionQuestion.hasMany(VersionAnswer, {
  foreignKey: "version_question_id"
});
Version.hasMany(VersionAnswer, {
  foreignKey: "version_id"
});

User.hasMany(Version, {
  foreignKey: "creator_id",
  as: "createdVersions"
});
Version.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator"
});

User.belongsToMany(Document, {
  as: "upvotedDocuments",
  through: "document_upvote",
  foreignKey: "user_id"
});
Document.belongsToMany(User, {
  as: "upvotesFrom",
  through: "document_upvote",
  foreignKey: "document_id"
});

User.belongsToMany(Document, {
  as: "downvotedDocuments",
  through: "document_downvote",
  foreignKey: "user_id"
});
Document.belongsToMany(User, {
  as: "downvotesFrom",
  through: "document_downvote",
  foreignKey: "document_id"
});

VersionQuestion.hasMany(Comment, {
  foreignKey: "version_question_id"
});
Comment.belongsTo(VersionQuestion, {
  foreignKey: "version_question_id"
});

Document.hasMany(Document, {
  foreignKey: "original_document_id"
});
Document.belongsTo(Document, {
  foreignKey: "original_document_id",
  as: "forkFrom"
});

Document.belongsToMany(User, {
  through: "document_collaborator",
  foreignKey: "document_id",
  as: "collaborators"
});
User.belongsToMany(Document, {
  through: "document_collaborator",
  foreignKey: "user_id",
  as: "collaboratedDocuments"
});
/*=============  End of Survey  ==============*/

module.exports = {
  User,
  Comment,
  Role,
  Project,
  Version,
  VersionAnswer,
  // Question,
  QuestionCategory,
  Document,
  VersionQuestion,
  Tag,
  Issue,
  Notification,
  DocumentCollaborator,
  ProjectAdmin,
  ProjectEditor
};

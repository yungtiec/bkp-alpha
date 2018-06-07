const User = require("./user");
const Comment = require("./comment");
const Permission = require("./permission");
const Role = require("./role");
const Project = require("./project");
const ProjectSurvey = require("./project-survey");
const ProjectSurveyAnswer = require("./project-survey-answer");
const Question = require("./question");
const QuestionCategory = require("./question-category");
const Survey = require("./survey");
const SurveyQuestion = require("./survey-question");
const Tag = require("./tag");
const Issue = require("./issue");
const Notification = require("./notification");
const Collaborator = require("./collaborator");

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

Role.belongsToMany(Permission, {
  through: "role_permission",
  foreignKey: "role_id"
});
Permission.belongsToMany(Role, {
  through: "role_permission",
  foreignKey: "permission_id"
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
  through: "user_project",
  foreignKey: "user_id"
});
Project.belongsToMany(User, {
  through: "user_project",
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
ProjectSurvey.hasMany(Issue, {
  foreignKey: "resolving_project_survey_id",
  as: "resolvedIssues"
});
Issue.belongsTo(ProjectSurvey, {
  foreignKey: "resolving_project_survey_id",
  as: "resolvingProjectSurvey"
});

/*----------  Comment and Project Survey  ----------*/
ProjectSurvey.hasMany(Comment, {
  foreignKey: "project_survey_id"
});
Comment.belongsTo(ProjectSurvey, {
  foreignKey: "project_survey_id"
});

/*=====  End of Comment  ======*/

/*==============================================
=                    Survey                    =
==============================================*/

Project.belongsToMany(Survey, {
  through: ProjectSurvey,
  foreignKey: "project_id"
});
Survey.belongsToMany(Project, {
  through: ProjectSurvey,
  foreignKey: "survey_id"
});
ProjectSurvey.belongsTo(Survey, {
  foreignKey: "survey_id"
});
ProjectSurvey.belongsTo(Project, {
  foreignKey: "project_id"
});
Project.hasMany(ProjectSurvey, {
  foreignKey: "project_id"
});
Survey.hasMany(ProjectSurvey, {
  foreignKey: "survey_id"
});

Question.belongsToMany(Survey, {
  through: SurveyQuestion,
  foreignKey: "question_id"
});
Survey.belongsToMany(Question, {
  through: SurveyQuestion,
  foreignKey: "survey_id"
});
SurveyQuestion.belongsTo(Survey, {
  foreignKey: "survey_id"
});
SurveyQuestion.belongsTo(Question, {
  foreignKey: "question_id"
});
Question.hasMany(SurveyQuestion, {
  foreignKey: "question_id"
});
Survey.hasMany(SurveyQuestion, {
  foreignKey: "survey_id"
});

SurveyQuestion.belongsToMany(ProjectSurvey, {
  through: ProjectSurveyAnswer,
  foreignKey: "survey_question_id"
});
ProjectSurvey.belongsToMany(SurveyQuestion, {
  through: ProjectSurveyAnswer,
  foreignKey: "project_survey_id"
});
ProjectSurveyAnswer.belongsTo(ProjectSurvey, {
  foreignKey: "project_survey_id"
});
ProjectSurveyAnswer.belongsTo(SurveyQuestion, {
  foreignKey: "survey_question_id"
});
SurveyQuestion.hasMany(ProjectSurveyAnswer, {
  foreignKey: "survey_question_id"
});
ProjectSurvey.hasMany(ProjectSurveyAnswer, {
  foreignKey: "project_survey_id"
});

User.hasMany(ProjectSurvey, {
  foreignKey: "creator_id",
  as: "projectSurveys"
});
ProjectSurvey.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator"
});

SurveyQuestion.hasMany(Comment, {
  foreignKey: "survey_question_id"
});
Comment.belongsTo(SurveyQuestion, {
  foreignKey: "survey_question_id"
});

ProjectSurvey.hasMany(ProjectSurvey, {
  foreignKey: "original_id"
});
ProjectSurvey.belongsTo(ProjectSurvey, {
  foreignKey: "original_id",
  as: "forkFrom"
});

ProjectSurvey.belongsToMany(User, {
  through: "collaborator",
  foreignKey: "project_survey_id",
  as: "collaborators"
});
User.belongsToMany(ProjectSurvey, {
  through: "collaborator",
  foreignKey: "user_id"
});
/*=============  End of Survey  ==============*/

module.exports = {
  User,
  Comment,
  Permission,
  Role,
  Project,
  ProjectSurvey,
  ProjectSurveyAnswer,
  Question,
  QuestionCategory,
  Survey,
  SurveyQuestion,
  Tag,
  Issue,
  Notification,
  Collaborator
};

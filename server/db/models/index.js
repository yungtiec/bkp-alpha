const User = require("./user");
const Annotation = require("./annotation");
const Permission = require("./permission");
const Role = require("./role");
const Project = require("./project");
const ProjectSurveyComment = require("./project-survey-comment");
const Tag = require("./tag");
const Issue = require("./issue");

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

/*=============================================
=            User and Annotation              =
==============================================*/

User.belongsToMany(Annotation, {
  as: "upvotedAnnotations",
  through: "annotation_upvote",
  foreignKey: "user_id"
});
Annotation.belongsToMany(User, {
  as: "upvotesFrom",
  through: "annotation_upvote",
  foreignKey: "annotation_id"
});

User.hasMany(Annotation, { foreignKey: "owner_id", as: "annotations" });
Annotation.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

/*=====  End of User and Annotation  ========*/

/*=============================================
=            Annotation and Tag             =
==============================================*/

Tag.belongsToMany(Annotation, {
  through: "annotation_tag",
  foreignKey: "tag_id"
});
Annotation.belongsToMany(Tag, {
  through: "annotation_tag",
  foreignKey: "annotation_id"
});

/*=====  End of Annotation and Tag ========*/

/*=============================================
=            Annotation and Issue             =
==============================================*/

Annotation.hasOne(Issue);
Issue.belongsTo(Annotation);

/*=====  End of Annotation and Issue ========*/

/*=============================================
=            User and Page Comment              =
==============================================*/

User.belongsToMany(ProjectSurveyComment, {
  as: "upvotedComments",
  through: "project_survey_comment_upvote",
  foreignKey: "user_id"
});
ProjectSurveyComment.belongsToMany(User, {
  as: "upvotesFrom",
  through: "project_survey_comment_upvote",
  foreignKey: "project_survey_comment_id"
});

User.hasMany(ProjectSurveyComment, {
  foreignKey: "owner_id",
  as: "project_survey_comments"
});
ProjectSurveyComment.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

/*=====  End of User and Page Comment  ========*/

/*=============================================
=            Page Comment  and Tag             =
==============================================*/

Tag.belongsToMany(ProjectSurveyComment, {
  through: "project_survey_comment_tag",
  foreignKey: "tag_id"
});
ProjectSurveyComment.belongsToMany(Tag, {
  through: "project_survey_comment_tag",
  foreignKey: "project_survey_comment_id"
});

/*=====  End of Page Comment  and Tag ========*/

/*=============================================
=            Page Comment and Issue             =
==============================================*/

ProjectSurveyComment.hasOne(Issue);
Issue.belongsTo(ProjectSurveyComment);

/*=====  End of Page Comment and Issue ========*/
module.exports = {
  User,
  Annotation,
  Permission,
  Role,
  Project,
  ProjectSurveyComment,
  Tag,
  Issue
};

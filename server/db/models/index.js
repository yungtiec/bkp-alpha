const User = require("./user");
const Annotation = require("./annotation");
const Permission = require("./permission");
const Role = require("./role");
const Project = require("./project");

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
  as: "upvoted",
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

module.exports = {
  User,
  Annotation,
  Permission,
  Role,
  Project
};

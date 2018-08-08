const { find, isEmpty } = require("lodash");

module.exports = {
  Comment: (action, model, user) => {
    if (!user || isEmpty(user)) return false;
    const userRole = !user.roles.length ? "contributer" : user.roles[0].name;
    const isAdmin = userRole.name === "admin";
    const isProjectAdmin =
      userRole.name === "project_admin" &&
      !!find(model.project.admins, a => a.id === user.id);
    const isProjectEditor =
      userRole.name === "project_editor" &&
      !!find(model.project.editors, a => a.id === user.id);
    const isCommentOwner = user.id === model.comment.owner_id;
    const needVerification = model.comment.reviewed === "pending";

    switch (action) {
      case "Reviewed":
        return (
          !(isAdmin || isProjectAdmin || isProjectEditor) || !needVerification
        );
      case "Verify":
        return (
          (isAdmin || isProjectAdmin || isProjectEditor) && needVerification
        );
      case "AutoVerify":
        return isAdmin || isProjectAdmin || isProjectEditor;
      case "Issue":
        return isAdmin || isProjectAdmin || isProjectEditor || isCommentOwner;
      case "Edit":
        return isCommentOwner;
    }
  },
  Disclosure: (action, model, user) => {
    if (!user || isEmpty(user)) return false;
    const isAdmin = userRole.name === "admin";
    const userRole = !user.roles.length ? "contributer" : user.roles[0].name;
    const isProjectAdmin = model.project
      ? userRole.name === "project_admin" &&
        !!find(model.project.admins, a => a.id === user.id)
      : userRole.name === "project_admin";
    const isProjectEditor = model.project
      ? userRole.name === "project_editor" &&
        !!find(model.project.editors, a => a.id === user.id)
      : userRole.name === "project_editor";
    const isDisclosureOwner = model.disclosure
      ? model.disclosure.creator_id === user.id
      : null;
    const isDisclosureCollaborator = model.disclosure
      ? find(model.disclosure.collaborators, a => a.id === user.id)
      : null;

    switch (action) {
      case "Create":
        return isAdmin || isProjectAdmin || isProjectEditor;
      case "Version":
        return (
          isAdmin ||
          isProjectAdmin ||
          (isProjectEditor && (isDisclosureOwner || isDisclosureCollaborator))
        );
    }
  }
};

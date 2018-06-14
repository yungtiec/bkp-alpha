const { find, isEmpty } = require("lodash");

module.exports = {
  Comment: (action, model, user) => {
    if (!user || isEmpty(user)) return false;
    const isAdmin = user.roles[0].name === "admin";
    const isProjectAdmin =
      user.roles[0].name === "project_admin" &&
      !!find(model.project.admins, a => a.id === user.id);
    const isProjectEditor =
      user.roles[0].name === "project_editor" &&
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
      case "Issue":
        return isAdmin || isProjectAdmin || isProjectEditor || isCommentOwner;
      case "Edit":
        return isCommentOwner;
    }
  },
  Disclosure: (action, model, user) => {
    if (!user || isEmpty(user)) return false;
    const isAdmin = user.roles[0].name === "admin";
    const isProjectAdmin =
      user.roles[0].name === "project_admin" &&
      !!find(model.project.admins, a => a.id === user.id);
    const isProjectEditor =
      user.roles[0].name === "project_editor" &&
      !!find(model.project.editors, a => a.id === user.id);
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
          (isProjectEditor && (isCommentOwner || isDisclosureCollaborator))
        );
    }
  }
};

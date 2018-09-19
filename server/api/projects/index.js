const router = require("express").Router();
const projectController = require("./controller");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
module.exports = router;

/**
 * Getting a list of projects
 *
 * @name Get projects
 * @route {GET} /api/projects
 * @todo pagination
 *
 */
router.get("/", projectController.getProjects);

/**
 * Getting project by symbol
 *
 * @name Get project
 * @route {GET} /api/projects/:projectId
 * @routeparam {String} symbol
 *
 */
router.get("/:symbol", projectController.getProject);

/**
 * Getting collaborator options for project by project symbol.
 *
 * @name Get collaborator options for project
 * @route {GET} /api/projects/:projectId/collaborator-options
 * @routeparam {String} symbol
 *
 */
router.get(
  "/:symbol/collaborator-options",
  projectController.getProjectCollaboratorOptions
);

/**
 * Adding editor to project
 *
 * @name Post editor
 * @route {POST} /api/projects/:symbol/editors
 * @authentication
 * @routeparam {String} symbol
 * @bodyparam {String} editorEmail
 *
 */
router.post(
  "/:symbol/editors",
  ensureAuthentication,
  projectController.postProjectEditors
);

/**
 * Removing editor from project
 *
 * @name Delete editor
 * @route {DELETE} /api/projects/:symbol/editors/:projectEditorId
 * @authentication
 * @routeparam {String} symbol
 * @routeparam {Number} projectEditorId
 *
 */
router.delete(
  "/:symbol/editors/:projectEditorId",
  ensureAuthentication,
  projectController.deleteProjectEditor
);

const router = require("express").Router();
const projectController = require("./controller");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
module.exports = router;

router.get("/", projectController.getProjects);

router.get("/:symbol", projectController.getProject);

router.get(
  "/:symbol/collaborator-options",
  projectController.getProjectCollaboratorOptions
);

router.post("/:symbol/editors", projectController.postProjectEditors);

router.delete(
  "/:symbol/editors/:projectEditorId",
  projectController.deleteProjectEditor
);

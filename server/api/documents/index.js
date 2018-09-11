const router = require("express").Router({ mergeParams: true });
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const documentController = require("./controller");
module.exports = router;

router
  .get("/", documentController.getDocuments)
  .get("/:documentId", documentController.getDocument)
  .get("/:documentId/questions", documentController.getDocumentLatestQuestion)
  .post(
    "/",
    ensureAuthentication,
    ensureResourceAccess,
    documentController.postDocument
  )
  .post(
    "/:documentId/upvote",
    ensureAuthentication,
    ensureResourceAccess,
    documentController.postUpvote
  )
  .post(
    "/:documentId/downvote",
    ensureAuthentication,
    ensureResourceAccess,
    documentController.postDownvote
  )
  .post(
    "/:parentVersionId",
    ensureAuthentication,
    ensureResourceAccess,
    documentController.postNewVersion
  );

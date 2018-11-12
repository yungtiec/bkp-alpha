const router = require("express").Router({ mergeParams: true });
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const documentController = require("./controller");
module.exports = router;

/**
 * Getting a list of documents
 *
 * @name Get documents
 * @route {GET} /api/documents
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/", documentController.getDocuments);

/**
 * Getting document metadata by id, i.e upvotes, downvotes, creator, versions...etc
 *
 * @name Get document
 * @route {GET} /api/documents/:documentId
 * @routeparam {Number} documentId
 *
 */
router.get("/:documentId", documentController.getDocument);

/**
 * Getting document's latest version's contents (consisted of series of questions and answers) by id
 *
 * @name Get document contents
 * @route {GET} /api/documents/:documentId/questions
 * @routeparam {Number} documentId
 *
 */
router.get(
  "/:documentId/questions",
  documentController.getDocumentLatestQuestion
);

/**
 * Posting document executes a series of database queries, including creating document, first version, questions and answers, and setting up associations.
 *
 * @name Post document
 * @route {POST} /api/documents
 * @authentication
 * @bodyparam {String} selectedProjectSymbol
 * @bodyparam {String} markdown is the md file uploaded by user, ready to be parsed into questions and answers
 * @bodyparam {Number} commentPeriodValue is the duration of the open period for the public comment initiative
 * @bodyparam {Number} commentPeriodUnit is the unit of comment period (days, weeks, and months)
 * @bodyparam {Object} scorecard
 * @bodyparam {String} versionNumber is specified by uploader
 * @bodyparam {Array} collaboratorEmails
 *
 */
router.post(
  "/",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postDocument
);

/**
 * Posting a new version executes a series of database queries, including creating version, questions and answers, and setting up associations.
 *
 * @name Post new version to document
 * @route {POST} /api/documents/:parentVersionId
 * @authentication
 * @routeparam {Number} parentVersionId is the version id of the last version
 * @bodyparam {String} markdown is the md file uploaded by user, ready to be parsed into questions and answers
 * @bodyparam {Array} resolvedIssueIds is an array of ids of issues resolved by the uploaded version
 * @bodyparam {Array} newResolvedIssues is an array of issues resolved by the uploaded version not previously raised by the community
 * @bodyparam {Number} commentPeriodValue is the duration of the open period for the public comment initiative
 * @bodyparam {Number} commentPeriodUnit is the unit of comment period (days, weeks, and months)
 * @bodyparam {Object} scorecard
 * @bodyparam {String} versionNumber is specified by uploader
 * @bodyparam {Array} collaboratorEmails
 *
 */
router.post(
  "/:parentVersionId",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postNewVersion
);

/**
 * Upvote document
 *
 * @name Post upvote
 * @authentication
 * @route {POST} /api/documents/:documentId/upvote
 * @authentication
 * @routeparam {Number} documentId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:documentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postUpvote
);

/**
 * Downvote document
 *
 * @name Post downvote
 * @route {POST} /api/documents/:documentId/downvote
 * @authentication
 * @routeparam {Number} documentId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:documentId/downvote",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postDownvote
);

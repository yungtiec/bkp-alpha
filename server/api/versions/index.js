const router = require("express").Router({ mergeParams: true });
const versionController = require("./controllers/version-controller");
const questionController = require("./controllers/question-controller");
const answerController = require("./controllers/answer-controller");
const commentController = require("./controllers/comment-controller");
const annotatorController = require("./controllers/annotator-controller");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrCommentOwnership,
  ensureResourceAccess
} = require("../utils");
Promise = require("bluebird");
module.exports = router;

router.get("/:versionId/metadata", versionController.getMetadata);

router.put("/:versionId/scorecard", versionController.putScorecard);

router
  .get("/:versionId/questions", questionController.getQuestions)
  .post(
    "/:versionId/questions",
    ensureAuthentication,
    questionController.postQuestion
  )
  .put(
    "/:versionId/questions",
    ensureAuthentication,
    questionController.putQuestion
  );

router
  .post(
    "/:versionId/answers",
    ensureAuthentication,
    answerController.postAnswer
  )
  .put("/:versionId/answers", ensureAuthentication, answerController.putAnswer);

router.get("/:versionId/comments", commentController.getComments);

router
  .post(
    "/:versionId/comments",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.postComment
  )
  .post(
    "/:versionId/comments/:parentId/reply",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.postReply
  )
  .post(
    "/:versionId/comments/:commentId/upvote",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.postUpvote
  )
  .put(
    "/:versionId/comments/:commentId/edit",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.putEditedComment
  )
  .delete(
    "/:versionId/comments/:commentId/tags/:tagId",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.deleteTag
  )
  .put(
    "/:versionId/comments/:commentId/tags",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.putTags
  )
  .put(
    "/:versionId/comments/:commentId/verify",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.putCommentStatus
  )
  .put(
    "/:versionId/comments/:commentId/issue",
    ensureAuthentication,
    ensureResourceAccess,
    commentController.putCommentIssueStatus
  );

router
  .get("/:versionId/annotator", annotatorController.getAnnotatedComments)
  .post(
    "/:versionId/annotator",
    ensureAuthentication,
    ensureResourceAccess,
    annotatorController.postAnnotatedComment
  );


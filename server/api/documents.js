const router = require("express").Router({ mergeParams: true });
const db = require("../db");
const permission = require("../access-control")["Disclosure"];
const {
  User,
  Project,
  Version,
  Document,
  VersionQuestion,
  VersionAnswer,
  Notification,
  Question,
  DocumentCollaborator,
  Issue,
  ProjectAdmin,
  ProjectEditor
} = require("../db/models");
const moment = require("moment");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("./utils");
const MarkdownParsor = require("../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { count, documents } = await Document.getDocumentsWithStats({
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.send({ count, documents });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      createNewDocument({
        markdown: req.body.markdown,
        collaboratorEmails: req.body.collaboratorEmails.map(
          emailOption => emailOption.value
        ),
        commentPeriodUnit: req.body.commentPeriodUnit,
        commentPeriodValue: req.body.commentPeriodValue,
        selectedProjectSymbol: req.body.selectedProjectSymbol,
        scorecard: req.body.scorecard,
        creator: req.user,
        res,
        next
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:documentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (req.body.hasDownvoted)
        await req.user.removeDownvotedDocuments(req.params.documentId);
      if (!req.body.hasUpvoted) {
        await req.user.addUpvotedDocuments(req.params.documentId);
      } else {
        await req.user.removeUpvotedDocuments(req.params.documentId);
      }
      const [upvotesFrom, downvotesFrom] = await Document.findById(
        req.params.documentId
      ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
      res.send([upvotesFrom, downvotesFrom]);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:documentId/downvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (req.body.hasUpvoted)
        await req.user.removeUpvotedDocuments(req.params.documentId);
      if (!req.body.hasDownvoted) {
        await req.user.addDownvotedDocuments(req.params.documentId);
      } else {
        await req.user.removeDownvotedDocuments(req.params.documentId);
      }
      const [upvotesFrom, downvotesFrom] = await Document.findById(
        req.params.documentId
      ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
      res.send([upvotesFrom, downvotesFrom]);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:parentVersionId",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      addVersionToExistingDocument({
        parentVersionId: req.params.parentVersionId,
        markdown: req.body.markdown,
        resolvedIssueIds: req.body.resolvedIssueIds,
        newIssues: req.body.newIssues,
        collaboratorEmails: req.body.collaboratorEmails.map(
          emailOption => emailOption.value
        ),
        commentPeriodUnit: req.body.commentPeriodUnit,
        commentPeriodValue: req.body.commentPeriodValue,
        scorecard: req.body.scorecard,
        creator: req.user,
        res,
        next
      });
    } catch (err) {
      next(err);
    }
  }
);

async function createNewDocument({
  markdown,
  collaboratorEmails,
  commentPeriodUnit,
  commentPeriodValue,
  selectedProjectSymbol,
  scorecard,
  creator,
  res,
  next
}) {
  try {
    var project = await Project.findOne({
      where: { symbol: selectedProjectSymbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canCreate = permission("Create", { project }, creator);
    if (!canCreate) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var document = await Document.create({
      title: markdownParsor.title,
      creator_id: creator.id,
      project_id: project.id,
      latest_version: 1
    });
    var commentUntilInUnix = moment()
      .add(commentPeriodValue, commentPeriodUnit)
      .format("x");
    var version = await Version.create({
      document_id: document.id,
      creator_id: creator.id,
      comment_until_unix: commentUntilInUnix,
      scorecard
    });
    var questionInstances = await Promise.map(
      markdownParsor.questions,
      async questionObject => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_version
        );
        var versionQuestion = await VersionQuestion.create({
          version_id: version.id,
          markdown: `### ${questionObject.question.trim()}`,
          order_in_version: questionObject.order_in_version
        });
        await VersionAnswer.create({
          markdown: answer,
          version_question_id: versionQuestion.id,
          version_id: version.id
        });
      }
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          DocumentCollaborator.create({
            user_id: user ? user.id : null,
            email,
            document_id: document.id
          }).then(collaborator => {
            return Notification.notifyCollaborators({
              sender: creator,
              collaboratorId: user.id,
              versionId: version.id,
              projectSymbol: project.symbol,
              parentVersionTitle: document.title,
              action: "created"
            });
          })
        )
    );
    res.send(version);
  } catch (err) {
    next(err);
  }
}

async function addVersionToExistingDocument({
  parentVersionId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  scorecard,
  creator,
  res,
  next
}) {
  try {
    var parentVersion = await Version.scope({
      method: ["byIdWithMetadata", Number(parentVersionId)]
    }).findOne();
    var project = await Project.findOne({
      where: { symbol: parentVersion.document.project.symbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canVersion = permission(
      "Version",
      { project, disclosure: parentVersion.document },
      creator
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var commentUntilInUnix = moment()
      .add(commentPeriodValue, commentPeriodUnit)
      .format("x");
    var version = await Version.create({
      document_id: parentVersion.document.id,
      creator_id: creator.id,
      comment_until_unix: commentUntilInUnix,
      scorecard
    });
    await parentVersion.addChild(version.id);
    var document = await Document.findById(parentVersion.document.id).then(s =>
      s.update({ latest_version: parentVersion.hierarchyLevel + 1 })
    );
    var questionInstances = await Promise.map(
      markdownParsor.questions,
      async questionObject => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_version
        );
        var versionQuestion = await VersionQuestion.create({
          version_id: version.id,
          markdown: `### ${questionObject.question.trim()}`,
          order_in_version: questionObject.order_in_version
        });
        await VersionAnswer.create({
          markdown: answer,
          version_question_id: versionQuestion.id,
          version_id: version.id
        });
        return question;
      }
    );
    var prevCollaboratorEmails = parentVersion.document.collaborators.map(
      user => user.email
    );
    var removedCollaborators = _.difference(
      prevCollaboratorEmails,
      collaboratorEmails
    ).map(async email =>
      DocumentCollaborator.update(
        { revoked_access: true },
        {
          where: {
            email,
            document_id: parentVersion.document.id
          }
        }
      )
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          DocumentCollaborator.findOrCreate({
            where: {
              user_id: user.id,
              document_id: parentVersion.document.id
            },
            defaults: {
              user_id: user ? user.id : null,
              email,
              document_id: parentVersion.document.id,
              version_version: version.hierarchyLevel
            }
          }).then(async (collaborator, created) => {
            var updated;
            if (collaborator.revoked_access) {
              collaborator = await DocumentCollaborator.update(
                {
                  revoked_access: false
                },
                { where: { id: collaborator.id } }
              );
              updated = true;
            }
            if (created || updated)
              return Notification.notifyCollaborators({
                sender: creator,
                collaboratorId: user.id,
                versionId: version.id,
                projectSymbol: project.symbol,
                parentVersionTitle: parentVersion.document.title,
                action: "updated"
              });
          })
        )
    );
    var resolvedCurrentIssues = resolvedIssueIds.map(async issueId =>
      Issue.update(
        { open: false, resolving_version_id: version.id },
        { where: { id: Number(issueId) } }
      )
    );
    var resolvedAddedIssues = newIssues.map(async newIssue =>
      Comment.create({
        comment: newIssue,
        reviewed: "verified",
        version_id: parentVersionId,
        owner_id: creator.id
      }).then(comment =>
        Issue.create({
          open: false,
          comment_id: comment.id,
          resolving_version_id: version.id
        })
      )
    );
    var engagedUsers = await getEngagedUsers({
      version: parentVersion,
      creator,
      collaboratorEmails
    });
    await Promise.all(
      collaborators
        .concat(removedCollaborators)
        .concat(resolvedCurrentIssues)
        .concat(resolvedAddedIssues)
        .concat(
          engagedUsers.map(engagedUser =>
            Notification.notifyEngagedUserOnUpdate({
              engagedUser,
              versionId: version.id,
              projectSymbol: project.symbol,
              parentVersionTitle: parentVersion.document.title
            })
          )
        )
    );
    res.send(version);
  } catch (err) {
    next(err);
  }
}

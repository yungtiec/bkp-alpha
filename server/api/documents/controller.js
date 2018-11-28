const permission = require("../../access-control")["Disclosure"];
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
} = require("../../db/models");
const { getEngagedUsers } = require("../utils");
const moment = require("moment");
const _ = require("lodash");
const MarkdownParsor = require("../../../script/markdown-parser");
const crypto = require("crypto");
Promise = require("bluebird");

const getDocuments = async (req, res, next) => {
  try {
    const { count, documents } = await Document.getDocumentsWithStats({
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.send({ count, documents });
  } catch (err) {
    next(err);
  }
};

const getDocumentBySlug = async (req, res, next) => {
  try {
    const version = await Version.findOne( { where: { version_slug: req.params.version_slug } } );
    const document = await Document.scope({
      method: [
        "includeVersionsWithOutstandingIssues",
        { documentId: version.document_id }
      ]
    }).findOne();
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await Document.scope({
      method: [
        "includeVersionsWithOutstandingIssues",
        { documentId: req.params.documentId }
      ]
    }).findOne();
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const getDocumentLatestQuestionBySlug = async (req, res, next) => {
  try {
    const versionBySlug = await Version.findOne( { where: { version_slug: req.params.version_slug } } );
    const document = await Document.scope({
      method: ["includeVersions", { documentId: versionBySlug.document_id }]
    }).findOne();
    const latestVersionId = _.maxBy(document.versions, "hierarchyLevel").id;
    var rawVersion = await Version.scope({
      method: ["byIdWithVersionQuestions", latestVersionId]
    }).findOne();
    var version_questions = rawVersion.version_questions.map(vq => {
      vq = addHistory(vq);
      vq.version_answers[0] = addHistory(vq.version_answers[0]);
      return vq;
    });
    var version = _.assignIn(rawVersion.toJSON(), { version_questions });
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const getDocumentLatestQuestion = async (req, res, next) => {
  try {
    const document = await Document.scope({
      method: ["includeVersions", { documentId: req.params.documentId }]
    }).findOne();
    const latestVersionId = _.maxBy(document.versions, "hierarchyLevel").id;
    var rawVersion = await Version.scope({
      method: ["byIdWithVersionQuestions", latestVersionId]
    }).findOne();
    var version_questions = rawVersion.version_questions.map(vq => {
      vq = addHistory(vq);
      vq.version_answers[0] = addHistory(vq.version_answers[0]);
      return vq;
    });
    var version = _.assignIn(rawVersion.toJSON(), { version_questions });
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const addHistory = versionQuestionOrAnswer => {
  versionQuestionOrAnswer = versionQuestionOrAnswer.toJSON
    ? versionQuestionOrAnswer.toJSON()
    : versionQuestionOrAnswer;
  versionQuestionOrAnswer.history = (versionQuestionOrAnswer.ancestors || [])
    .concat([_.omit(versionQuestionOrAnswer, ["ancestors"])])
    .concat(versionQuestionOrAnswer.descendents || []);
  delete versionQuestionOrAnswer["ancestors"];
  delete versionQuestionOrAnswer["descendents"];
  return versionQuestionOrAnswer;
};

const createVersionSlug = async (docTitle, versionObj) => {
  const sha256 = crypto.createHash("sha256");

  try {
    // Hash the original version obj as a JSON string
    // Convert the hash to base64 ([a-z], [A-Z], [0-9], +, /)
    const hash = sha256.update(JSON.stringify(versionObj)).digest("base64");

    // This is the  base64 key that corresponds to the given JSON string
    const base64Key = hash.slice(0, 8);

    // Convert base64 to hex string
    let versionSlug = Buffer.from(base64Key, "base64").toString("hex");

    return `${docTitle.split(" ").join("-")}-${versionSlug}`;
  } catch (err) {
    console.error(err);
  }
};

const postDocument = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { symbol: req.body.selectedProjectSymbol },
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
    const canCreate = permission("Create", { project }, req.user);
    if (!canCreate) {
      res.sendStatus(403);
      return;
    }
    const markdownParsor = new MarkdownParsor({
      markdown: req.body.markdown || ""
    });
    const document = await Document.create({
      title: markdownParsor.title,
      creator_id: req.user.id,
      project_id: project.id,
      latest_version: 1
    });
    const commentUntilInUnix = moment()
      .add(req.body.commentPeriodValue, req.body.commentPeriodUnit)
      .format("x");
    const versionObj = {
      document_id: document.id,
      creator_id: req.user.id,
      comment_until_unix: commentUntilInUnix,
      scorecard: req.body.scorecard,
      version_number: req.body.versionNumber
    };
    const versionSlug = await createVersionSlug(
      document.title || req.body.title,
      versionObj
    );
    const versionWithSlug = Object.assign(
      { version_slug: versionSlug },
      versionObj
    );
    const version = await Version.create(versionWithSlug);

    const questionInstances = await Promise.map(
      markdownParsor.questions,
      async questionObject => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_version
        );
        var versionQuestion = await VersionQuestion.create({
          version_id: version.id,
          markdown: `### ${questionObject.question.trim()}`,
          order_in_version: questionObject.order_in_version,
          latest: true
        });
        await VersionAnswer.create({
          markdown: answer,
          version_question_id: versionQuestion.id,
          version_id: version.id,
          latest: true
        });
      }
    );
    const collaborators = req.body.collaboratorEmails
      ? req.body.collaboratorEmails.map(emailOption => emailOption.value).map(
          async email =>
            await User.findOne({ where: { email } }).then(user =>
              DocumentCollaborator.create({
                user_id: user ? user.id : null,
                email,
                document_id: document.id
              }).then(collaborator => {
                return Notification.notifyCollaborators({
                  sender: req.user,
                  collaboratorId: user.id,
                  versionId: version.id,
                  projectSymbol: project.symbol,
                  parentVersionTitle: document.title,
                  action: "created"
                });
              })
            )
        )
      : null;
    const versionJSON = version.toJSON();
    versionJSON.document = document;
    res.send(versionJSON);
  } catch (err) {
    next(err);
  }
};

const postUpvote = async (req, res, next) => {
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
};

const postDownvote = async (req, res, next) => {
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
};

const postNewVersion = async (req, res, next) => {
  try {
    var {
      markdown,
      resolvedIssueIds,
      newResolvedIssues,
      commentPeriodUnit,
      commentPeriodValue,
      versionNumber,
      scorecard
    } = req.body;
    var collaboratorEmails = req.body.collaboratorEmails.map(
      emailOption => emailOption.value
    );
    var parentVersion = await Version.scope({
      method: ["byIdWithMetadata", Number(req.params.parentVersionId)]
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
      req.user
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
      creator_id: req.user.id,
      comment_until_unix: commentUntilInUnix,
      version_number: versionNumber,
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
          order_in_version: questionObject.order_in_version,
          latest: true
        });
        await VersionAnswer.create({
          markdown: answer,
          version_question_id: versionQuestion.id,
          version_id: version.id,
          latest: true
        });
        return versionQuestion;
      }
    );
    var prevCollaboratorEmails = parentVersion.document.collaborators.map(
      user => user.email
    );
    var removedCollaborators = _
      .difference(prevCollaboratorEmails, collaboratorEmails)
      .map(async email =>
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
                sender: req.user,
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
    var resolvedAddedIssues = newResolvedIssues.map(async newIssue =>
      Comment.create({
        comment: newIssue,
        reviewed: "verified",
        version_id: req.params.parentVersionId,
        owner_id: req.user.id
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
      creator: req.user,
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
    version = version.toJSON();
    version.document = document;
    res.send(version);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDocuments,
  getDocument,
  getDocumentBySlug,
  getDocumentLatestQuestion,
  getDocumentLatestQuestionBySlug,
  postDocument,
  postUpvote,
  postDownvote,
  postNewVersion
};

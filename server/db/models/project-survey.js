const Sequelize = require("sequelize");
const db = require("../db");
const _ = require("lodash");

const ProjectSurvey = db.define(
  "project_survey",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    survey_id: {
      type: Sequelize.INTEGER
    },
    project_id: {
      type: Sequelize.INTEGER
    },
    submitted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reviewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    forked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    original_id: {
      type: Sequelize.INTEGER
    },
    comment_until_unix: {
      type: Sequelize.BIGINT
    },
    scorecard: {
      type: Sequelize.JSONB
    }
  },
  {
    hierarchy: true,
    scopes: {
      byIdWithAllEngagements: function(projectSurveyId) {
        return {
          where: { id: projectSurveyId },
          include: [
            {
              model: db.model("issue"),
              as: "resolvedIssues",
              required: false,
              include: [
                {
                  model: db.model("comment"),
                  required: false
                }
              ]
            },
            {
              model: db.model("project_survey"),
              as: "ancestors",
              attributes: ["id", "hierarchyLevel", "creator_id", "createdAt"],
              include: [
                { model: db.model("survey") },
                {
                  model: db.model("user"),
                  as: "creator"
                },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  required: false
                },
                {
                  model: db.model("issue"),
                  as: "resolvedIssues",
                  required: false,
                  include: [
                    {
                      model: db.model("comment"),
                      required: false
                    }
                  ]
                },
                {
                  model: db.model("comment"),
                  required: false,
                  include: [
                    {
                      model: db.model("issue"),
                      required: false,
                      where: { open: true }
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("project_survey"),
              as: "descendents",
              attributes: ["id", "hierarchyLevel", "creator_id", "createdAt"],
              include: [
                { model: db.model("survey") },
                {
                  model: db.model("user"),
                  as: "creator"
                },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  required: false
                },
                {
                  model: db.model("issue"),
                  as: "resolvedIssues",
                  required: false,
                  include: [
                    {
                      model: db.model("comment"),
                      required: false
                    }
                  ]
                },
                {
                  model: db.model("comment"),
                  required: false,
                  include: [
                    {
                      model: db.model("issue"),
                      required: false,
                      where: { open: true }
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("user"),
              as: "creator"
            },
            {
              model: db.model("user"),
              as: "collaborators",
              required: false
            },
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["id", "name", "first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "downvotesFrom",
              attributes: ["id", "name", "first_name", "last_name", "email"]
            },
            {
              model: db.model("survey"),
              include: [
                {
                  model: db.model("survey_question"),
                  include: [
                    {
                      model: db.model("question")
                    },
                    {
                      model: db.model("project_survey_answer"),
                      where: {
                        project_survey_id: projectSurveyId
                      },
                      include: [
                        {
                          model: db.model("project_survey_answer"),
                          where: {
                            project_survey_id: projectSurveyId
                          },
                          as: "descendents",
                          hierarchy: true,
                          required: false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("comment"),
              required: false,
              include: [
                {
                  model: db.model("issue"),
                  required: false,
                  where: { open: true }
                }
              ]
            },
            {
              model: db.model("project")
            }
          ],
          order: [
            [
              { model: db.model("project_survey"), as: "ancestors" },
              "hierarchyLevel"
            ],
            [
              { model: db.model("project_survey"), as: "descendents" },
              "hierarchyLevel"
            ]
          ]
        };
      },
      allLatestWithAllEngagements: function() {
        return {
          where: { hierarchyLevel: 1 },
          include: [
            { model: db.model("project_survey"), as: "descendents" },
            {
              model: db.model("user"),
              as: "creator"
            },
            {
              model: db.model("user"),
              as: "collaborators",
              required: false
            },
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["id", "name", "first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "downvotesFrom",
              attributes: ["id", "name", "first_name", "last_name", "email"]
            },
            {
              model: db.model("comment"),
              required: false,
              attributes: ["id", "reviewed", "hierarchyLevel"],
              where: {
                reviewed: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "pending" },
                    { [Sequelize.Op.eq]: "verified" }
                  ]
                },
                hierarchyLevel: 1
              },
              include: [
                {
                  model: db.model("issue"),
                  required: false
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["id"],
                  required: false
                },
                { model: db.model("comment"), as: "descendents" }
              ],
              order: [
                [
                  { model: db.model("comment"), as: "descendents" },
                  "hierarchyLevel"
                ]
              ]
            },
            {
              model: db.model("survey")
            },
            {
              model: db.model("project")
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [
              { model: db.model("project_survey"), as: "descendents" },
              "hierarchyLevel"
            ]
          ]
        };
      },
      allRootsWithDescendants: function() {
        return {
          where: { hierarchyLevel: 1 },
          include: [
            { model: db.model("project_survey"), as: "descendents" },
            {
              model: db.model("survey")
            },
            {
              model: db.model("project")
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [
              { model: db.model("project_survey"), as: "descendents" },
              "hierarchyLevel",
              "DESC"
            ]
          ]
        };
      }
    }
  }
);

ProjectSurvey.getAllPublishedSurveysWithStats = async function() {
  const projectSurveys = await ProjectSurvey.scope(
    "allLatestWithAllEngagements"
  ).findAll();
  return getPublishedSurveysStats(projectSurveys);
};

ProjectSurvey.getLatestPublishedSurveysWithStats = async function() {
  return await ProjectSurvey.scope("allLatestWithAllEngagements").find({
    limit: 10
  });
};

module.exports = ProjectSurvey;

/**
 *
 * helpers
 *
 */

function getPublishedSurveysStats(projectSurveys) {
  return Promise.map(projectSurveys, async projectSurveyInstance => {
    var rawProjectSurvey = projectSurveyInstance.toJSON();
    if (rawProjectSurvey.descendents.length) {
      projectSurveyInstance = await ProjectSurvey.findOne({
        where: { id: rawProjectSurvey.descendents.slice(-1)[0].id },
        include: [
          {
            model: db.model("comment"),
            required: false,
            attributes: ["id", "reviewed", "hierarchyLevel"],
            where: {
              reviewed: {
                [Sequelize.Op.or]: [
                  { [Sequelize.Op.eq]: "pending" },
                  { [Sequelize.Op.eq]: "verified" }
                ]
              },
              hierarchyLevel: 1
            },
            include: [
              {
                model: db.model("issue"),
                required: false
              },
              {
                model: db.model("user"),
                as: "upvotesFrom",
                attributes: ["id"],
                required: false
              },
              { model: db.model("comment"), as: "descendents" }
            ],
            order: [
              [
                { model: db.model("comment"), as: "descendents" },
                "hierarchyLevel"
              ]
            ]
          },
          {
            model: db.model("user"),
            as: "upvotesFrom;",
            attributes: ["id"],
            required: false
          },
          {
            model: db.model("user"),
            as: "downvotesFrom",
            attributes: ["id"],
            required: false
          },
          {
            model: db.model("survey")
          }
        ]
      });
      rawProjectSurvey = _.assignIn(
        _.pick(rawProjectSurvey, ["creator", "project"]),
        projectSurveyInstance.toJSON()
      );
    }
    const comments = rawProjectSurvey.comments;
    const numPendingComments = comments.filter(c => c.reviewed === "pending")
      .length;
    const numPendingReplies = comments.reduce(
      (count, comment) =>
        comment.descendents && comment.descendents.length
          ? comment.descendents.filter(d => d.reviewed === "pending").length +
            count
          : count,
      0
    );
    const numTotalComments = comments.filter(c => c.reviewed !== "spam").length;
    const numTotalReplies = comments.reduce(
      (count, comment) =>
        comment.descendents && comment.descendents.length
          ? comment.descendents.filter(d => d.reviewed !== "spam").length +
            count
          : count,
      0
    );
    const numCommentUpvotes = comments.reduce(
      (upvotes, c) => upvotes.concat(c.upvotesFrom),
      []
    ).length;
    const numReplyUpvotes = comments.reduce(
      (count, comment) =>
        comment.descendents && comment.descendents.length
          ? comment.descendents.reduce(
              (upvotes, d) => upvotes.concat(d.upvotesFrom),
              []
            ).length + count
          : count,
      0
    );
    const numCommentIssues = comments.filter(c => !!c.issue).length;
    const projectSurvey = _.assignIn(
      {
        title: rawProjectSurvey.survey.title,
        description: rawProjectSurvey.survey.description,
        creator: rawProjectSurvey.creator,
        num_pending_comments: numPendingComments + numPendingReplies,
        num_total_comments: numTotalComments + numTotalReplies,
        num_reaction: numCommentUpvotes + numReplyUpvotes,
        num_issues: numCommentIssues
      },
      _.omit(rawProjectSurvey, ["survey"])
    );
    return projectSurvey;
  });
}

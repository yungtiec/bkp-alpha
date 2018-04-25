const fs = require("fs");
const cheerio = require("cheerio");
const showdown = require("showdown");
const converter = new showdown.Converter();

const extractQuestions = $ => {
  var questions = [];
  $("h1").each(function(i, h1) {
    questions[i] = { question: $(this).text(), order_in_survey: i };
  });
  return questions;
};

const getAnswerToQuestion = ({ markdownToParse, question, nextQuestion }) => {
  const startIndex = markdownToParse.indexOf(question) + question.length;
  const endIndex = markdownToParse.indexOf(`# ${nextQuestion}`);
  return markdownToParse.substring(startIndex, endIndex);
};

const getAnswerToTheLastQuestion = ({ markdownToParse, lastQuestion }) => {
  return markdownToParse.substring(
    markdownToParse.indexOf(lastQuestion) + lastQuestion.length
  );
};

function MarkdownParsor({ filepath, markdown }) {
  this.markdownToParse = filepath
    ? (this.markdown = fs.readFileSync(filepath, "utf8"))
    : markdown;

  this.html = converter.makeHtml(this.markdownToParse);

  this.questions = extractQuestions(cheerio.load(this.html));

  return this;
}

MarkdownParsor.prototype.findAnswerToQuestion = function(questionIndex) {
  var self = this;
  if (questionIndex === self.questions.length - 1) {
    return getAnswerToTheLastQuestion({
      markdownToParse: self.markdownToParse,
      lastQuestion: self.questions[questionIndex].question
    });
  } else {
    return getAnswerToQuestion({
      markdownToParse: self.markdownToParse,
      question: self.questions[questionIndex].question,
      nextQuestion: self.questions[questionIndex + 1].question
    });
  }
};

module.exports = MarkdownParsor;

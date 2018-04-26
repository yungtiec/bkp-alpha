const fs = require("fs");
const cheerio = require("cheerio");
const showdown = require("showdown");
const converter = new showdown.Converter();

const extractTitle = $ =>  $("h1").text()

const extractDescription = $ =>  $("h2").text()

const extractQuestions = $ => {
  var questions = [];
  $("h3").each(function(i, h3) {
    questions[i] = { question: $(this).text(), order_in_survey: i };
  });
  return questions;
};

const getAnswerToQuestion = ({ markdownToParse, question, nextQuestion }) => {
  const startIndex = markdownToParse.indexOf(question) + question.length;
  const endIndex = markdownToParse.indexOf(`### ${nextQuestion}`);
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

  var $ = cheerio.load(this.html)

  this.title = extractTitle($)
  this.description = extractDescription($);
  this.questions = extractQuestions($);

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

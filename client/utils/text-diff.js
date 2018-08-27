import Diff from "text-diff";

var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

Diff.prototype.getMarkdownWithdifference = function(diffs) {
  var markdown = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_br = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0]; // Operation (insert, delete, equal)
    var data = diffs[x][1]; // Text of change.
    var text = data
      .replace(pattern_amp, "&amp;")
      .replace(pattern_lt, "&lt;")
      .replace(pattern_gt, "&gt;")
      // .replace(pattern_br, "<br/>");
    switch (op) {
      case DIFF_INSERT:
        markdown[x] = "*" + text + "*";
        break;
      case DIFF_DELETE:
        markdown[x] = "~~" + text + "~~";
        break;
      case DIFF_EQUAL:
        markdown[x] = text;
        break;
    }
  }
  return markdown.join("");
};

export default Diff;

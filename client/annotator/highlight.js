import xpathRange from "xpath-range";

// highlightRange wraps the DOM Nodes within the provided range with a highlight
// element of the specified class and returns the highlight Elements.
//
// normedRange - A NormalizedRange to be highlighted.
// cssClass - A CSS class to use for the highlight (default: 'annotator-hl')
//
// Returns an array of highlight Elements.
function highlightRange(normedRange, cssClass) {
  if (typeof cssClass === "undefined" || cssClass === null) {
    cssClass = "annotator-hl";
  }
  var white = /^\s*$/;

  // Ignore text nodes that contain only whitespace characters. This prevents
  // spans being injected between elements that can only contain a restricted
  // subset of nodes such as table rows and lists. This does mean that there
  // may be the odd abandoned whitespace node in a paragraph that is skipped
  // but better than breaking table layouts.
  var nodes = normedRange.textNodes(),
    results = [];

  for (var i = 0, len = nodes.length; i < len; i++) {
    var node = nodes[i];
    if (!white.test(node.nodeValue)) {
      var hl = global.document.createElement("span");
      hl.className = cssClass;
      node.parentNode.replaceChild(hl, node);
      hl.appendChild(node);
      results.push(hl);
    }
  }
  return results;
}

// reanchorRange will attempt to normalize a range, swallowing Range.RangeErrors
// for those ranges which are not reanchorable in the current document.
function reanchorRange(range, rootElement) {
  try {
    return xpathRange.Range.sniff(range).normalize(rootElement);
  } catch (e) {
    if (!(e instanceof xpathRange.Range.RangeError)) {
      // Oh Javascript, why you so crap? This will lose the traceback.
      throw e;
    }
    // Otherwise, we simply swallow the error. Callers are responsible
    // for only trying to draw valid annotations.
  }
  return null;
}

// Public: Draw highlights for the annotation.
//
// annotation - An annotation Object for which to draw highlights.
//
// Returns an Array of drawn highlight elements.
export const draw = function(element, annotation) {
  var normedRanges = [];

  for (var i = 0, ilen = annotation.ranges.length; i < ilen; i++) {
    var r = reanchorRange(annotation.ranges[i], element);
    if (r !== null) {
      normedRanges.push(r);
    }
  }
  var hasLocal =
    typeof annotation._local !== "undefined" && annotation._local !== null;
  if (!hasLocal) {
    annotation._local = {};
  }
  var hasHighlights =
    typeof annotation._local.highlights !== "undefined" &&
    annotation._local.highlights === null;
  if (!hasHighlights) {
    annotation._local.highlights = [];
  }

  for (var j = 0, jlen = normedRanges.length; j < jlen; j++) {
    var normed = normedRanges[j];
    $.merge(
      annotation._local.highlights,
      highlightRange(normed, "annotator-hl")
    );
  }

  // Save the annotation data on each highlighter element.
  $(annotation._local.highlights).data("annotation", annotation);

  // Add a data attribute for annotation id if the annotation has one
  if (typeof annotation.id !== "undefined" && annotation.id !== null) {
    $(annotation._local.highlights).attr("data-annotation-id", annotation.id);
  }

  return annotation;
};

// Public: Remove the drawn highlights for the given annotation.
//
// annotation - An annotation Object for which to purge highlights.
//
// Returns nothing.
export const undraw = function(annotation) {
  var hasHighlights =
    typeof annotation._local !== "undefined" &&
    annotation._local !== null &&
    typeof annotation._local.highlights !== "undefined" &&
    annotation._local.highlights !== null;

  if (!hasHighlights) {
    return;
  }

  for (var i = 0, len = annotation._local.highlights.length; i < len; i++) {
    var h = annotation._local.highlights[i];
    if (h.parentNode !== null) {
      $(h).replaceWith(h.childNodes);
    }
  }
  delete annotation._local.highlights;
};

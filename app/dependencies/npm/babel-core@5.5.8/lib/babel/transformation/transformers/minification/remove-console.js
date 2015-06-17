/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.CallExpression = CallExpression;
var metadata = {
  optional: true,
  group: "builtin-pre"
};

exports.metadata = metadata;

function CallExpression(node, parent) {
  if (this.get("callee").matchesPattern("console", true)) {
    this.dangerouslyRemove();
  }
}
/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.DebuggerStatement = DebuggerStatement;
var metadata = {
  optional: true,
  group: "builtin-pre"
};

exports.metadata = metadata;

function DebuggerStatement(node) {
  this.dangerouslyRemove();
}
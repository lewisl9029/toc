/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.ForOfStatement = ForOfStatement;

var _es6ForOf = require("../es6/for-of");

var metadata = {
  optional: true
};

exports.metadata = metadata;

function ForOfStatement(node, parent, scope, file) {
  if (this.get("right").isGenericType("Array")) {
    return _es6ForOf._ForOfStatementArray.call(this, node, scope, file);
  }
}
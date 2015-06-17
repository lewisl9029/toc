/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.CallExpression = CallExpression;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _traversal = require("../../../traversal");

var _traversal2 = _interopRequireDefault(_traversal);

var _helpersParse = require("../../../helpers/parse");

var _helpersParse2 = _interopRequireDefault(_helpersParse);

var metadata = {
  group: "builtin-pre",
  optional: true
};

exports.metadata = metadata;

function CallExpression(node) {
  if (this.get("callee").isIdentifier({ name: "eval" }) && node.arguments.length === 1) {
    var evaluate = this.get("arguments")[0].evaluate();
    if (!evaluate.confident) return;

    var code = evaluate.value;
    if (typeof code !== "string") return;

    var ast = (0, _helpersParse2["default"])(code);
    _traversal2["default"].removeProperties(ast);
    return ast.program;
  }
}
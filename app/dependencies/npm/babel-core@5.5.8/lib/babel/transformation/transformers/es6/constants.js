/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.Scope = Scope;
exports.VariableDeclaration = VariableDeclaration;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _messages = require("../../../messages");

var messages = _interopRequireWildcard(_messages);

function Scope(node, parent, scope) {
  for (var name in scope.bindings) {
    var binding = scope.bindings[name];

    // not a constant
    if (binding.kind !== "const" && binding.kind !== "module") continue;

    var _arr = binding.constantViolations;
    for (var _i = 0; _i < _arr.length; _i++) {
      var violation = _arr[_i];
      throw violation.errorWithNode(messages.get("readOnly", name));
    }
  }
}

function VariableDeclaration(node) {
  if (node.kind === "const") node.kind = "let";
}
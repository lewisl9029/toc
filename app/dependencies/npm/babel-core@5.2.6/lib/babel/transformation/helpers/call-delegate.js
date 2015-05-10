/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;

var _traverse = require("../../traversal");

var _traverse2 = _interopRequireDefault(_traverse);

var _import = require("../../types");

var t = _interopRequireWildcard(_import);

var visitor = {
  enter: function enter(node, parent, scope, state) {
    if (this.isThisExpression() || this.isReferencedIdentifier({ name: "arguments" })) {
      state.found = true;
      this.stop();
    }

    if (this.isFunction()) {
      this.skip();
    }
  }
};

exports["default"] = function (node, scope) {
  var container = t.functionExpression(null, [], node.body, node.generator, node.async);

  var callee = container;
  var args = [];

  var state = { found: false };
  scope.traverse(node, visitor, state);
  if (state.found) {
    callee = t.memberExpression(container, t.identifier("apply"));
    args = [t.thisExpression(), t.identifier("arguments")];
  }

  var call = t.callExpression(callee, args);
  if (node.generator) call = t.yieldExpression(call, true);

  return t.returnStatement(call);
};

module.exports = exports["default"];
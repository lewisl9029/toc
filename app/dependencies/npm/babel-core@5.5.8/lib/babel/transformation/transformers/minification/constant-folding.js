/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.AssignmentExpression = AssignmentExpression;
exports.IfStatement = IfStatement;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

var metadata = {
  optional: true,
  group: "builtin-prepass",
  experimental: true
};

exports.metadata = metadata;

function AssignmentExpression() {
  var left = this.get("left");
  if (!left.isIdentifier()) return;

  var binding = this.scope.getBinding(left.node.name);
  if (!binding || binding.hasDeoptValue) return;

  var evaluated = this.get("right").evaluate();
  if (evaluated.confident) {
    binding.setValue(evaluated.value);
  } else {
    binding.deoptValue();
  }
}

function IfStatement() {
  var evaluated = this.get("test").evaluate();
  if (!evaluated.confident) {
    // todo: deopt binding values for constant violations inside
    return this.skip();
  }

  if (evaluated.value) {
    this.skipKey("alternate");
  } else {
    this.skipKey("consequent");
  }
}

var Scopable = {
  enter: function enter() {
    var funcScope = this.scope.getFunctionParent();

    for (var name in this.scope.bindings) {
      var binding = this.scope.bindings[name];
      var deopt = false;

      var _arr = binding.constantViolations;
      for (var _i = 0; _i < _arr.length; _i++) {
        var path = _arr[_i];
        var funcViolationScope = path.scope.getFunctionParent();
        if (funcViolationScope !== funcScope) {
          deopt = true;
          break;
        }
      }

      if (deopt) binding.deoptValue();
    }
  },

  exit: function exit() {
    for (var name in this.scope.bindings) {
      var binding = this.scope.bindings[name];
      binding.clearValue();
    }
  }
};

exports.Scopable = Scopable;
var Expression = {
  exit: function exit() {
    var res = this.evaluate();
    if (res.confident) return t.valueToNode(res.value);
  }
};
exports.Expression = Expression;
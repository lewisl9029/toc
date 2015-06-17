/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

/**
 * Description
 */

exports.replaceWithMultiple = replaceWithMultiple;

/**
 * Description
 */

exports.replaceWithSourceString = replaceWithSourceString;

/**
 * Description
 */

exports.replaceWith = replaceWith;

/**
 * Description
 */

exports.replaceExpressionWithStatements = replaceExpressionWithStatements;

/**
 * Description
 */

exports.replaceInline = replaceInline;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpersCodeFrame = require("../../helpers/code-frame");

var _helpersCodeFrame2 = _interopRequireDefault(_helpersCodeFrame);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../index");

var _index4 = _interopRequireDefault(_index3);

var _types = require("../../types");

var t = _interopRequireWildcard(_types);

var _helpersParse = require("../../helpers/parse");

var _helpersParse2 = _interopRequireDefault(_helpersParse);

var hoistVariablesVisitor = {
  Function: function Function() {
    this.skip();
  },

  VariableDeclaration: function VariableDeclaration(node, parent, scope) {
    if (node.kind !== "var") return;

    var bindings = this.getBindingIdentifiers();
    for (var key in bindings) {
      scope.push({ id: bindings[key] });
    }

    var exprs = [];

    var _arr = node.declarations;
    for (var _i = 0; _i < _arr.length; _i++) {
      var declar = _arr[_i];
      if (declar.init) {
        exprs.push(t.expressionStatement(t.assignmentExpression("=", declar.id, declar.init)));
      }
    }

    return exprs;
  }
};
function replaceWithMultiple(nodes) {
  this.resync();

  nodes = this._verifyNodeList(nodes);
  t.inheritsComments(nodes[0], this.node);
  this.node = this.container[this.key] = null;
  this.insertAfter(nodes);
  if (!this.node) this.dangerouslyRemove();
}

function replaceWithSourceString(replacement) {
  this.resync();

  try {
    replacement = "(" + replacement + ")";
    replacement = (0, _helpersParse2["default"])(replacement);
  } catch (err) {
    var loc = err.loc;
    if (loc) {
      err.message += " - make sure this is an expression.";
      err.message += "\n" + (0, _helpersCodeFrame2["default"])(replacement, loc.line, loc.column + 1);
    }
    throw err;
  }

  replacement = replacement.program.body[0].expression;
  _index4["default"].removeProperties(replacement);
  return this.replaceWith(replacement);
}

function replaceWith(replacement, whateverAllowed) {
  this.resync();

  if (this.removed) {
    throw new Error("You can't replace this node, we've already removed it");
  }

  if (replacement instanceof _index2["default"]) {
    replacement = replacement.node;
  }

  if (!replacement) {
    throw new Error("You passed `path.replaceWith()` a falsy node, use `path.dangerouslyRemove()` instead");
  }

  if (this.node === replacement) {
    return;
  }

  // normalise inserting an entire AST
  if (t.isProgram(replacement)) {
    replacement = replacement.body;
    whateverAllowed = true;
  }

  if (Array.isArray(replacement)) {
    if (whateverAllowed) {
      return this.replaceWithMultiple(replacement);
    } else {
      throw new Error("Don't use `path.replaceWith()` with an array of nodes, use `path.replaceWithMultiple()`");
    }
  }

  if (typeof replacement === "string") {
    if (whateverAllowed) {
      return this.replaceWithSourceString(replacement);
    } else {
      throw new Error("Don't use `path.replaceWith()` with a string, use `path.replaceWithSourceString()`");
    }
  }

  // replacing a statement with an expression so wrap it in an expression statement
  if (this.isNodeType("Statement") && t.isExpression(replacement) && !this.canHaveVariableDeclarationOrExpression()) {
    replacement = t.expressionStatement(replacement);
  }

  // replacing an expression with a statement so let's explode it
  if (this.isNodeType("Expression") && t.isStatement(replacement)) {
    return this.replaceExpressionWithStatements([replacement]);
  }

  var oldNode = this.node;
  if (oldNode) t.inheritsComments(replacement, oldNode);

  // replace the node
  this.node = this.container[this.key] = replacement;
  this.type = replacement.type;

  // potentially create new scope
  this.setScope();
}

function replaceExpressionWithStatements(nodes) {
  this.resync();

  var toSequenceExpression = t.toSequenceExpression(nodes, this.scope);

  if (toSequenceExpression) {
    return this.replaceWith(toSequenceExpression);
  } else {
    var container = t.functionExpression(null, [], t.blockStatement(nodes));
    container.shadow = true;

    this.replaceWith(t.callExpression(container, []));
    this.traverse(hoistVariablesVisitor);

    // add implicit returns to all ending expression statements
    var last = this.get("callee").getCompletionRecords();
    for (var i = 0; i < last.length; i++) {
      var lastNode = last[i];
      if (lastNode.isExpressionStatement()) {
        var loop = lastNode.findParent(function (path) {
          return path.isLoop();
        });
        if (loop) {
          var uid = this.get("callee").scope.generateDeclaredUidIdentifier("ret");
          this.get("callee.body").pushContainer("body", t.returnStatement(uid));
          lastNode.get("expression").replaceWith(t.assignmentExpression("=", uid, lastNode.node.expression));
        } else {
          lastNode.replaceWith(t.returnStatement(lastNode.node.expression));
        }
      }
    }

    return this.node;
  }
}

function replaceInline(nodes) {
  this.resync();

  if (Array.isArray(nodes)) {
    if (Array.isArray(this.container)) {
      nodes = this._verifyNodeList(nodes);
      this._containerInsertAfter(nodes);
      return this.dangerouslyRemove();
    } else {
      return this.replaceWithMultiple(nodes);
    }
  } else {
    return this.replaceWith(nodes);
  }
}
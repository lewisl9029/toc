/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.Func /*tion*/ = Func;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _util = require("../../../util");

var util = _interopRequireWildcard(_util);

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

var memberExpressionOptimisationVisitor = {
  Scope: function Scope(node, parent, scope, state) {
    // check if this scope has a local binding that will shadow the rest parameter
    if (!scope.bindingIdentifierEquals(state.name, state.outerBinding)) {
      this.skip();
    }
  },

  enter: function enter(node, parent, scope, state) {
    var _this = this;

    var stop = function stop() {
      state.canOptimise = false;
      _this.stop();
    };

    if (this.isArrowFunctionExpression()) return stop();

    // skip over functions as whatever `arguments` we reference inside will refer
    // to the wrong function
    if (this.isFunctionDeclaration() || this.isFunctionExpression()) {
      state.noOptimise = true;
      this.traverse(memberExpressionOptimisationVisitor, state);
      state.noOptimise = false;
      return this.skip();
    }

    // is this a referenced identifier and is it referencing the rest parameter?
    if (!this.isReferencedIdentifier({ name: state.name })) return;

    if (!state.noOptimise && t.isMemberExpression(parent) && parent.computed) {
      // if we know that this member expression is referencing a number then we can safely
      // optimise it
      var prop = this.parentPath.get("property");
      if (prop.isBaseType("number")) {
        state.candidates.push(this);
        return;
      }
    }

    stop();
  }
};

function optimizeMemberExpression(parent, offset) {
  if (offset === 0) return;

  var newExpr;
  var prop = parent.property;

  if (t.isLiteral(prop)) {
    prop.value += offset;
    prop.raw = String(prop.value);
  } else {
    // // UnaryExpression, BinaryExpression
    newExpr = t.binaryExpression("+", prop, t.literal(offset));
    parent.property = newExpr;
  }
}

var hasRest = function hasRest(node) {
  return t.isRestElement(node.params[node.params.length - 1]);
};

function Func(node, parent, scope, file) {
  if (!hasRest(node)) return;

  var restParam = node.params.pop();
  var rest = restParam.argument;

  var argsId = t.identifier("arguments");

  // otherwise `arguments` will be remapped in arrow functions
  argsId._shadowedFunctionLiteral = true;

  // support patterns
  if (t.isPattern(rest)) {
    var pattern = rest;
    rest = scope.generateUidIdentifier("ref");

    var declar = t.variableDeclaration("let", pattern.elements.map(function (elem, index) {
      var accessExpr = t.memberExpression(rest, t.literal(index), true);
      return t.variableDeclarator(elem, accessExpr);
    }));
    node.body.body.unshift(declar);
  }

  // check if rest is used in member expressions and optimise for those cases

  var state = {
    outerBinding: scope.getBindingIdentifier(rest.name),
    canOptimise: true,
    candidates: [],
    method: node,
    name: rest.name
  };

  this.traverse(memberExpressionOptimisationVisitor, state);

  // we only have shorthands and there's no other references
  if (state.canOptimise && state.candidates.length) {
    var _arr = state.candidates;

    for (var _i = 0; _i < _arr.length; _i++) {
      var candidate = _arr[_i];
      candidate.replaceWith(argsId);
      optimizeMemberExpression(candidate.parent, node.params.length);
    }
    return;
  }

  //

  var start = t.literal(node.params.length);
  var key = scope.generateUidIdentifier("key");
  var len = scope.generateUidIdentifier("len");

  var arrKey = key;
  var arrLen = len;
  if (node.params.length) {
    // this method has additional params, so we need to subtract
    // the index of the current argument position from the
    // position in the array that we want to populate
    arrKey = t.binaryExpression("-", key, start);

    // we need to work out the size of the array that we're
    // going to store all the rest parameters
    //
    // we need to add a check to avoid constructing the array
    // with <0 if there are less arguments than params as it'll
    // cause an error
    arrLen = t.conditionalExpression(t.binaryExpression(">", len, start), t.binaryExpression("-", len, start), t.literal(0));
  }

  var loop = util.template("rest", {
    ARRAY_TYPE: restParam.typeAnnotation,
    ARGUMENTS: argsId,
    ARRAY_KEY: arrKey,
    ARRAY_LEN: arrLen,
    START: start,
    ARRAY: rest,
    KEY: key,
    LEN: len
  });
  loop._blockHoist = node.params.length + 1;
  node.body.body.unshift(loop);
}
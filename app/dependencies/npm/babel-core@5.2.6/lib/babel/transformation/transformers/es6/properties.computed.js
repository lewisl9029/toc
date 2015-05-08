/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;
exports.ObjectExpression = ObjectExpression;

var _import = require("../../../types");

var t = _interopRequireWildcard(_import);

function loose(node, body, objId) {
  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];

    body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(objId, prop.key, prop.computed || t.isLiteral(prop.key)), prop.value)));
  }
}

function spec(node, body, objId, initProps, file) {
  var props = node.properties;
  var prop, key;

  // normalize key

  for (var i = 0; i < props.length; i++) {
    prop = props[i];
    if (prop.kind !== "init") continue;

    key = prop.key;

    if (!prop.computed && t.isIdentifier(key)) {
      prop.key = t.literal(key.name);
    }
  }

  // add all non-computed properties and `__proto__` properties to the initializer

  var broken = false;

  for (i = 0; i < props.length; i++) {
    prop = props[i];

    if (prop.computed) {
      broken = true;
    }

    if (prop.kind !== "init" || !broken || t.isLiteral(t.toComputedKey(prop, prop.key), { value: "__proto__" })) {
      initProps.push(prop);
      props[i] = null;
    }
  }

  // add a simple assignment for all Symbol member expressions due to symbol polyfill limitations
  // otherwise use Object.defineProperty

  for (i = 0; i < props.length; i++) {
    prop = props[i];
    if (!prop) continue;

    key = prop.key;
    var bodyNode;

    if (prop.computed && t.isMemberExpression(key) && t.isIdentifier(key.object, { name: "Symbol" })) {
      // { [Symbol.iterator]: "foo" }
      bodyNode = t.assignmentExpression("=", t.memberExpression(objId, key, true), prop.value);
    } else {
      bodyNode = t.callExpression(file.addHelper("define-property"), [objId, key, prop.value]);
    }

    body.push(t.expressionStatement(bodyNode));
  }

  // only one node and it's a Object.defineProperty that returns the object

  if (body.length === 1) {
    var first = body[0].expression;

    if (t.isCallExpression(first)) {
      first.arguments[0] = t.objectExpression(initProps);
      return first;
    }
  }
}

function shouldVisit(node) {
  return t.isProperty(node) && node.computed;
}

function ObjectExpression(node, parent, scope, file) {
  var hasComputed = false;

  for (var i = 0; i < node.properties.length; i++) {
    hasComputed = t.isProperty(node.properties[i], { computed: true, kind: "init" });
    if (hasComputed) break;
  }

  if (!hasComputed) return;

  var initProps = [];
  var objId = scope.generateUidBasedOnNode(parent);

  //

  var body = [];

  //

  var callback = spec;
  if (file.isLoose("es6.properties.computed")) callback = loose;

  var result = callback(node, body, objId, initProps, file);
  if (result) return result;

  //

  body.unshift(t.variableDeclaration("var", [t.variableDeclarator(objId, t.objectExpression(initProps))]));

  body.push(t.expressionStatement(objId));

  return body;
}
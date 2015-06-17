/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

/**
 * Description
 */

exports.insertBefore = insertBefore;
exports._containerInsert = _containerInsert;
exports._containerInsertBefore = _containerInsertBefore;
exports._containerInsertAfter = _containerInsertAfter;
exports._maybePopFromStatements = _maybePopFromStatements;

/**
 * Description
 */

exports.insertAfter = insertAfter;

/**
 * Description
 */

exports.updateSiblingKeys = updateSiblingKeys;

/**
 * Description
 */

/**
 * Description
 */

exports._verifyNodeList = _verifyNodeList;

/**
 * Description
 */

exports.unshiftContainer = unshiftContainer;

/**
 * Description
 */

exports.pushContainer = pushContainer;

/**
 * Description
 */

exports.hoist = hoist;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libHoister = require("./lib/hoister");

var _libHoister2 = _interopRequireDefault(_libHoister);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _types = require("../../types");

var t = _interopRequireWildcard(_types);

function insertBefore(nodes) {
  this._assertUnremoved();

  nodes = this._verifyNodeList(nodes);

  if (this.parentPath.isExpressionStatement() || this.parentPath.isLabeledStatement()) {
    return this.parentPath.insertBefore(nodes);
  } else if (this.isNodeType("Expression") || this.parentPath.isForStatement() && this.key === "init") {
    if (this.node) nodes.push(this.node);
    this.replaceExpressionWithStatements(nodes);
  } else if (this.isNodeType("Statement") || !this.type) {
    this._maybePopFromStatements(nodes);
    if (Array.isArray(this.container)) {
      return this._containerInsertBefore(nodes);
    } else if (this.isStatementOrBlock()) {
      if (this.node) nodes.push(this.node);
      this.node = this.container[this.key] = t.blockStatement(nodes);
    } else {
      throw new Error("We don't know what to do with this node type. We were previously a Statement but we can't fit in here?");
    }
  } else {
    throw new Error("No clue what to do with this node type.");
  }

  return [this];
}

function _containerInsert(from, nodes) {
  this.updateSiblingKeys(from, nodes.length);

  var paths = [];

  for (var i = 0; i < nodes.length; i++) {
    var to = from + i;
    var node = nodes[i];
    this.container.splice(to, 0, node);

    if (this.context) {
      var path = this.context.create(this.parent, this.container, to, this.containerKey);
      paths.push(path);
      this.queueNode(path);
    } else {
      paths.push(_index2["default"].get({
        parentPath: this,
        parent: node,
        container: this.container,
        containerKey: this.containerKey,
        key: to
      }));
    }
  }

  return paths;
}

function _containerInsertBefore(nodes) {
  return this._containerInsert(this.key, nodes);
}

function _containerInsertAfter(nodes) {
  return this._containerInsert(this.key + 1, nodes);
}

function _maybePopFromStatements(nodes) {
  var last = nodes[nodes.length - 1];
  if (t.isExpressionStatement(last) && t.isIdentifier(last.expression) && !this.isCompletionRecord()) {
    nodes.pop();
  }
}

function insertAfter(nodes) {
  this._assertUnremoved();

  nodes = this._verifyNodeList(nodes);

  if (this.parentPath.isExpressionStatement() || this.parentPath.isLabeledStatement()) {
    return this.parentPath.insertAfter(nodes);
  } else if (this.isNodeType("Expression") || this.parentPath.isForStatement() && this.key === "init") {
    if (this.node) {
      var temp = this.scope.generateDeclaredUidIdentifier();
      nodes.unshift(t.expressionStatement(t.assignmentExpression("=", temp, this.node)));
      nodes.push(t.expressionStatement(temp));
    }
    this.replaceExpressionWithStatements(nodes);
  } else if (this.isNodeType("Statement") || !this.type) {
    this._maybePopFromStatements(nodes);
    if (Array.isArray(this.container)) {
      return this._containerInsertAfter(nodes);
    } else if (this.isStatementOrBlock()) {
      if (this.node) nodes.unshift(this.node);
      this.node = this.container[this.key] = t.blockStatement(nodes);
    } else {
      throw new Error("We don't know what to do with this node type. We were previously a Statement but we can't fit in here?");
    }
  } else {
    throw new Error("No clue what to do with this node type.");
  }

  return [this];
}

function updateSiblingKeys(fromIndex, incrementBy) {
  var paths = this.parent._paths;
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (path.key >= fromIndex) {
      path.key += incrementBy;
    }
  }
}

function _verifyNodeList(nodes) {
  if (nodes.constructor !== Array) {
    nodes = [nodes];
  }

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (!node) {
      throw new Error("Node list has falsy node with the index of " + i);
    } else if (typeof node !== "object") {
      throw new Error("Node list contains a non-object node with the index of " + i);
    } else if (!node.type) {
      throw new Error("Node list contains a node without a type with the index of " + i);
    } else if (node instanceof _index2["default"]) {
      nodes[i] = node.node;
    }
  }

  return nodes;
}

function unshiftContainer(containerKey, nodes) {
  this._assertUnremoved();

  nodes = this._verifyNodeList(nodes);

  // get the first path and insert our nodes before it, if it doesn't exist then it
  // doesn't matter, our nodes will be inserted anyway

  var container = this.node[containerKey];
  var path = _index2["default"].get({
    parentPath: this,
    parent: this.node,
    container: container,
    containerKey: containerKey,
    key: 0
  });

  return path.insertBefore(nodes);
}

function pushContainer(containerKey, nodes) {
  this._assertUnremoved();

  nodes = this._verifyNodeList(nodes);

  // get an invisible path that represents the last node + 1 and replace it with our
  // nodes, effectively inlining it

  var container = this.node[containerKey];
  var i = container.length;
  var path = _index2["default"].get({
    parentPath: this,
    parent: this.node,
    container: container,
    containerKey: containerKey,
    key: i
  });

  return path.replaceWith(nodes, true);
}

function hoist() {
  var scope = arguments[0] === undefined ? this.scope : arguments[0];

  var hoister = new _libHoister2["default"](this, scope);
  return hoister.run();
}
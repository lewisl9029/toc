/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
/**
 * Description
 */

exports.findParent = findParent;

/**
 * Description
 */

exports.getStatementParent = getStatementParent;

/**
 * Description
 */

exports.getAncestry = getAncestry;

/**
 * Description
 */

exports.inType = inType;

/**
 * Description
 */

exports.inShadow = inShadow;

function findParent(callback) {
  var path = this;
  while (path) {
    if (callback(path)) return path;
    path = path.parentPath;
  }
  return null;
}

function getStatementParent() {
  var path = this;
  do {
    if (Array.isArray(path.container)) {
      return path;
    }
  } while (path = path.parentPath);
}

function getAncestry() {
  var ancestry = [];

  var path = this.parentPath;
  while (path) {
    ancestry.push(path.node);
    path = path.parentPath;
  }

  return ancestry;
}

function inType() {
  var path = this;
  while (path) {
    var _arr = arguments;

    for (var _i = 0; _i < _arr.length; _i++) {
      var type = _arr[_i];
      if (path.node.type === type) return true;
    }
    path = path.parentPath;
  }

  return false;
}

function inShadow() {
  var path = this;
  while (path) {
    if (path.isFunction()) {
      if (path.node.shadow) {
        return path;
      } else {
        return null;
      }
    }
    path = path.parentPath;
  }
  return null;
}
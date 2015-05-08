/* */ 
"format cjs";
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;

var _groupBy = require("lodash/collection/groupBy");

var _groupBy2 = _interopRequireDefault(_groupBy);

var _flatten = require("lodash/array/flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _values = require("lodash/object/values");

var _values2 = _interopRequireDefault(_values);

// Priority:
//
//  - 0 We want this to be at the **very** bottom
//  - 1 Default node position
//  - 2 Priority over normal nodes
//  - 3 We want this to be at the **very** top

var BlockStatement = {
  exit: function exit(node) {
    var hasChange = false;
    for (var i = 0; i < node.body.length; i++) {
      var bodyNode = node.body[i];
      if (bodyNode && bodyNode._blockHoist != null) hasChange = true;
    }
    if (!hasChange) return;

    var nodePriorities = _groupBy2["default"](node.body, function (bodyNode) {
      var priority = bodyNode && bodyNode._blockHoist;
      if (priority == null) priority = 1;
      if (priority === true) priority = 2;
      return priority;
    });

    node.body = _flatten2["default"](_values2["default"](nodePriorities).reverse());
  }
};

exports.BlockStatement = BlockStatement;
exports.Program = BlockStatement;
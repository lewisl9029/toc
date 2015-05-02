/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

exports.__esModule = true;

var _import = require("../types");

var t = _interopRequireWildcard(_import);

exports["default"] = function (obj) {
  for (var type in obj) {
    var fns = obj[type];
    if (typeof fns === "function") {
      obj[type] = fns = { enter: fns };
    }

    var aliases = t.FLIPPED_ALIAS_KEYS[type];
    if (aliases) {
      for (var i = 0; i < aliases.length; i++) {
        var alias = aliases[i];
        obj[alias] = obj[alias] || fns;
      }
    }
  }
  return obj;
};

module.exports = exports["default"];
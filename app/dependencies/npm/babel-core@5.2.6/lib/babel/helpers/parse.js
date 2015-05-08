/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;

var _normalizeAst = require("./normalize-ast");

var _normalizeAst2 = _interopRequireDefault(_normalizeAst);

var _estraverse = require("estraverse");

var _estraverse2 = _interopRequireDefault(_estraverse);

var _codeFrame = require("./code-frame");

var _codeFrame2 = _interopRequireDefault(_codeFrame);

var _import = require("../../acorn");

var acorn = _interopRequireWildcard(_import);

exports["default"] = function (opts, code, callback) {
  try {
    var comments = [];
    var tokens = [];

    var parseOpts = {
      allowImportExportEverywhere: opts.looseModules,
      allowReturnOutsideFunction: opts.looseModules,
      ecmaVersion: 6,
      strictMode: opts.strictMode,
      sourceType: opts.sourceType,
      onComment: comments,
      locations: true,
      features: opts.features || {},
      plugins: opts.plugins || {},
      onToken: tokens,
      ranges: true
    };

    if (opts.nonStandard) {
      parseOpts.plugins.jsx = true;
      parseOpts.plugins.flow = true;
    }

    var ast = acorn.parse(code, parseOpts);

    _estraverse2["default"].attachComments(ast, comments, tokens);

    ast = _normalizeAst2["default"](ast, comments, tokens);

    if (callback) {
      return callback(ast);
    } else {
      return ast;
    }
  } catch (err) {
    if (!err._babel) {
      err._babel = true;

      var message = err.message = "" + opts.filename + ": " + err.message;

      var loc = err.loc;
      if (loc) {
        err.codeFrame = _codeFrame2["default"](code, loc.line, loc.column + 1, opts);
        message += "\n" + err.codeFrame;
      }

      if (err.stack) {
        var newStack = err.stack.replace(err.message, message);
        try {
          err.stack = newStack;
        } catch (e) {}
      }
    }

    throw err;
  }
};

;
module.exports = exports["default"];

// `err.stack` may be a readonly property in some environments
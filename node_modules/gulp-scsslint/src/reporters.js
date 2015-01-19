/*jshint node:true */

'use strict';

var c = require('chalk');
var gutil = require('gulp-util');
var map = require('map-stream');

// Consts
var PLUGIN_NAME = 'gulp-scsslint';

/**
 * Default reporter logs SCSS-Lint errors using similar a similar format
 * to SCSS-Lint's default reporter, e.g.:
 *    123 [W] Class `Foo` in selector should be written in all lowercase as `foo`
 */
exports.defaultReporter = function(file) {
   var errorCount = file.scsslint.errorCount;
   var plural = errorCount === 1 ? '' : 's';

   file.scsslint.results.forEach(function(result) {
      var msg =
         c.cyan(file.path) + ':' +
         c.red(result.line) + ' ' +
         ('error' === result.severity ? c.red('[E]') : c.cyan('[W]')) + ' ' +
         result.reason;
      gutil.log(msg);
  });
};

/**
 * Reporter to emit an error on SCSS lint failure.
 * Otherwise, lint errors don't result in errors emmitted on the stream.
 */
exports.failReporter = function(file) {
   var error;
   if (file.scsslint && !file.scsslint.success) {
      error = new gutil.PluginError(PLUGIN_NAME, {
         message: 'SCSS-Lint failed for: ' + file.relative,
         showStack: false
      });
   }
   return error;
};

/**
 * Maps scsslint result objects through the given reporter if success is false.
 * @param reporter A reporter function that takes a file and reports
 *    on the scsslint object. Supplying 'fail' will use the fail reporter,
 *    which emits an error when SCSS-Lint returns warnings or errors.
 *    Optional, defaults to defaultReporter.
 */
exports.reporter = function(reporter) {
   if (!reporter || 'default' === reporter) {
      reporter = exports.defaultReporter;
   }

   if ('fail' === reporter) {
      reporter = exports.failReporter;
   }

   if ('undefined' === typeof reporter) {
      throw new gutil.PluginError(PLUGIN_NAME, 'Invalid reporter ' + reporter);
   }

   return map(function(file, cb) {
      // Only report if SCSS-Lint was run and errors were found
      var error;
      if (file.scsslint && !file.scsslint.success) {
         error = reporter(file);
      }

      return cb(error, file);
   });
};

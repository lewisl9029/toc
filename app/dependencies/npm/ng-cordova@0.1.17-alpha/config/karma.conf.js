/* */ 
var buildConfig = require("./build.config");
module.exports = {
  files: ['bower_components/angular/angular.min.js', 'bower_components/angular-mocks/angular-mocks.js', 'bower_components/jquery/dist/jquery.js'].concat(buildConfig.pluginFiles).concat('test/plugins/*.js').concat(buildConfig.mockFiles).concat('test/mocks/*.js'),
  frameworks: ['jasmine'],
  reporters: ['progress', 'coverage'],
  preprocessors: {'src/plugins/*.js': ['coverage']},
  coverageReporter: {
    type: 'html',
    dir: 'coverage/'
  },
  port: 9876,
  colors: true,
  logLevel: 'INFO',
  autoWatch: true,
  captureTimeout: 60000,
  singleRun: false,
  browsers: ['Chrome']
};

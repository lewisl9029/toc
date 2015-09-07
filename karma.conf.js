/* jshint node: true */
// Karma configuration
// Generated on Sun Dec 28 2014 09:58:19 GMT+0000 (UTC)

module.exports = function(config) {
  var basePaths = {
    dev: 'app/'
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'chai',
      'jspm'
    ],

    // list of files / patterns to load in the browser
    files: [],

    jspm: {
      packages: basePaths.dev + 'dependencies/',
      loadFiles: [
        basePaths.dev + 'components/**/*-test.unit.js',
        basePaths.dev + 'libraries/**/*-test.unit.js',
        basePaths.dev + 'services/**/*-test.unit.js',
        basePaths.dev + 'views/**/*-test.unit.js',
        basePaths.dev + '*-test.unit.js'
      ],
      serveFiles: [
        basePaths.dev + '**/*.js'
      ],
      config: basePaths.dev + 'jspm-config.js'
    },

    proxies: {
      '/base/dependencies/': '/base/' + basePaths.dev + 'dependencies/',
      '/base/views/': '/base/' + basePaths.dev + 'views/',
      '/base/components/': '/base/' + basePaths.dev + 'components/',
      '/base/services/': '/base/' + basePaths.dev + 'services/',
      '/base/libraries/': '/base/' + basePaths.dev + 'libraries/'
    },

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors:
    //   https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    //hostname: '172.17.42.1',
    port: 8102,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file
    //   changes
    autoWatch: true,

    // start these browsers
    // available browser launchers:
    //   https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'ChromeHeadless'
      // 'FirefoxWebDriver'
    ],

    customLaunchers: {
      'ChromeHeadless': {
        base: 'Chrome',
        flags: [
        '--no-sandbox'
        ]
      },
      'FirefoxWebDriver': {
        base: 'WebDriver',
        config: {
          hostname: '172.17.42.1',
          port: 8203,
        },
        browserName: 'firefox',
        name: 'Karma'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    //TODO: run tests on a faster machine
    // see https://github.com/karma-runner/karma/issues/598
    captureTimeout: 30000,
    browserNoActivityTimeout: 60000
  });
};

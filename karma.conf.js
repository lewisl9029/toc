/* jshint node: true */
// Karma configuration
// Generated on Sun Dec 28 2014 09:58:19 GMT+0000 (UTC)

module.exports = function(config) {
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
      packages: 'www/jspm_packages/',
      loadFiles: [
        'www/components/**/*-test.unit.js',
        'www/libraries/**/*-test.unit.js',
        'www/services/**/*-test.unit.js',
        'www/views/**/*-test.unit.js',
        'www/*-test.unit.js'
      ],
      serveFiles: [
        'www/**/*.js'
      ],
      config: 'www/config.js'
    },

    proxies: {
      '/base/jspm_packages/': '/base/www/jspm_packages/',
      '/base/views/': '/base/www/views/',
      '/base/components/': '/base/www/components/',
      '/base/services/': '/base/www/services/',
      '/base/libraries/': '/base/www/libraries/'
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
    hostname: '172.17.42.1',
    port: 8101,

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
    singleRun: false,

    //TODO: run tests on a faster machine
    // see https://github.com/karma-runner/karma/issues/598
    captureTimeout: 30000,
    browserNoActivityTimeout: 20000
  });
};

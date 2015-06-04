// conf.js

var basePaths = {
  dev: 'app/'
};

exports.config = {
  framework: 'jasmine2',
  directConnect: true,
  capabilities: {
    // //TODO: transition back to chrome once we have non-trivial ui tests
    // //current test only checks if the app loads without console error messages
    // 'browserName': 'phantomjs',
    // 'phantomjs.binary.path': require('phantomjs').path
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['no-sandbox']
    }
  },
  getPageTimeout: 60000,
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  },
  // seleniumAddress: 'http://172.17.42.1:8203/wd/hub',
  specs: [
    basePaths.dev + 'views/**/*-test.e2e.js',
    basePaths.dev + '*-test.e2e.js'
  ]
};

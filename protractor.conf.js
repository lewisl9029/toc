// conf.js

var basePaths = {
  dev: 'app/'
};

exports.config = {
  framework: 'jasmine2',
  directConnect: true,
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['no-sandbox']
    }
  },
  // seleniumAddress: 'http://172.17.42.1:8203/wd/hub',
  specs: [
    basePaths.dev + 'views/**/*-test.e2e.js',
    basePaths.dev + '*-test.e2e.js'
  ]
};

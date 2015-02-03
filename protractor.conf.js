// conf.js
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
  specs: ['www/app-test.e2e.js']
};

var performPostTestChecks = function performPostTestChecks() {
  afterEach(function afterEach() {
    browser.manage().logs().get('browser').then(
      function checkBrowserLog(browserLog) {
        console.log('log: ' + JSON.stringify(browserLog, null, ' '));
        expect(browserLog.length).toEqual(0);
      }
    );
  });
};

describe('app', function() {
  performPostTestChecks();

  it('should have a title', function() {
    browser.get('http://localhost:8100/');
    expect(browser.getTitle()).toEqual('Toc Messenger');
  });
});

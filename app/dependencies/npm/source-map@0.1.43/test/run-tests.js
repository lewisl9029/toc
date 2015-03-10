/* */ 
(function(process) {
  var assert = require("assert");
  var fs = require("fs");
  var path = require("path");
  var util = require("./source-map/util");
  function run(tests) {
    var total = 0;
    var passed = 0;
    for (var i = 0; i < tests.length; i++) {
      for (var k in tests[i].testCase) {
        if (/^test/.test(k)) {
          total++;
          try {
            tests[i].testCase[k](assert, util);
            passed++;
          } catch (e) {
            console.log('FAILED ' + tests[i].name + ': ' + k + '!');
            console.log(e.stack);
          }
        }
      }
    }
    console.log('');
    console.log(passed + ' / ' + total + ' tests passed.');
    console.log('');
    return total - passed;
  }
  function isTestFile(f) {
    var testToRun = process.argv[2];
    return testToRun ? path.basename(testToRun) === f : /^test\-.*?\.js/.test(f);
  }
  function toModule(f) {
    return './source-map/' + f.replace(/\.js$/, '');
  }
  var requires = fs.readdirSync(path.join(__dirname, 'source-map')).filter(isTestFile).map(toModule);
  var code = run(requires.map(require).map(function(mod, i) {
    return {
      name: requires[i],
      testCase: mod
    };
  }));
  process.exit(code);
})(require("process"));

/* */ 
(function(process) {
  var fs = require("fs");
  var vm = require("vm");
  var load = function(path) {
    vm.runInThisContext(fs.readFileSync(path));
  };
  process.argv.slice(2).map(load);
  sjcl.test.run(undefined, function() {
    if (!browserUtil.allPassed) {
      process.exit(1);
    }
  });
})(require("process"));

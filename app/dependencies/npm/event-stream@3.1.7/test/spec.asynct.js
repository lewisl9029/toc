/* */ 
(function(process) {
  var es = require("../index");
  var it = require("it-is").style('colour');
  var spec = require("stream-spec");
  exports['simple stream'] = function(test) {
    var stream = es.through();
    var x = spec(stream).basic().pausable();
    stream.write(1);
    stream.write(1);
    stream.pause();
    stream.write(1);
    stream.resume();
    stream.write(1);
    stream.end(2);
    process.nextTick(function() {
      x.validate();
      test.done();
    });
  };
  exports['throw on write when !writable'] = function(test) {
    var stream = es.through();
    var x = spec(stream).basic().pausable();
    stream.write(1);
    stream.write(1);
    stream.end(2);
    stream.write(1);
    process.nextTick(function() {
      x.validate();
      test.done();
    });
  };
  exports['end fast'] = function(test) {
    var stream = es.through();
    var x = spec(stream).basic().pausable();
    stream.end();
    process.nextTick(function() {
      x.validate();
      test.done();
    });
  };
  require("./helper/index")(module);
})(require("process"));

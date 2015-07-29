/* */ 
(function(process) {
  var es = require("../index"),
      it = require("it-is").style('colour'),
      d = require("ubelt"),
      join = require("path").join,
      fs = require("fs"),
      Stream = require("stream").Stream,
      spec = require("stream-spec");
  exports['es.split() works like String#split'] = function(test) {
    var readme = join(__filename),
        expected = fs.readFileSync(readme, 'utf-8').split('\n'),
        cs = es.split(),
        actual = [],
        ended = false,
        x = spec(cs).through();
    var a = new Stream();
    a.write = function(l) {
      actual.push(l.trim());
    };
    a.end = function() {
      ended = true;
      expected.forEach(function(v, k) {
        if (v)
          it(actual[k]).like(v);
      });
      process.nextTick(function() {
        test.done();
        x.validate();
      });
    };
    a.writable = true;
    fs.createReadStream(readme, {flags: 'r'}).pipe(cs);
    cs.pipe(a);
  };
  require("./helper/index")(module);
})(require("process"));

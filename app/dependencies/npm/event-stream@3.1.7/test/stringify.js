/* */ 
(function(Buffer) {
  var es = require("../index");
  exports['handle buffer'] = function(t) {
    es.stringify().on('data', function(d) {
      t.equal(d.trim(), JSON.stringify('HELLO'));
      t.end();
    }).write(new Buffer('HELLO'));
  };
  require("./helper/index")(module);
})(require("buffer").Buffer);

/* */ 
var es = require("../index"),
    it = require("it-is").style('colour'),
    d = require("ubelt");
exports['write an array'] = function(test) {
  var readThis = d.map(3, 6, 100, d.id);
  var writer = es.writeArray(function(err, array) {
    if (err)
      throw err;
    it(array).deepEqual(readThis);
    test.done();
  });
  d.each(readThis, writer.write.bind(writer));
  writer.end();
};
exports['writer is writable, but not readable'] = function(test) {
  var reader = es.writeArray(function() {});
  it(reader).has({
    readable: false,
    writable: true
  });
  test.done();
};
require("./helper/index")(module);

/* */ 
(function(process) {
  var inspect = require("util").inspect;
  if (!module.parent) {
    var map = require("../index");
    var es = require("event-stream");
    es.pipe(process.openStdin(), es.split(), map(function(data, callback) {
      var j;
      try {
        j = JSON.parse(data);
      } catch (err) {
        return callback(null, data);
      }
      callback(null, inspect(j));
    }), process.stdout);
  }
})(require("process"));

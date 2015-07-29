/* */ 
(function(process) {
  var inspect = require("util").inspect;
  var es = require("event-stream");
  var split = require("../index");
  if (!module.parent) {
    es.pipe(process.openStdin(), split(), es.map(function(data, callback) {
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

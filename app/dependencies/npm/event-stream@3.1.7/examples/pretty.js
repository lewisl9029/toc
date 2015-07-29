/* */ 
(function(process) {
  var inspect = require("util").inspect;
  if (!module.parent) {
    var es = require("../index");
    es.pipe(process.openStdin(), es.split(), es.map(function(data, callback) {
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

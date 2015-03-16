var client = require("./client.js");
var server = require("./server.js");

exports.install = function(self,args)
{
  client.install(self,args);
  server.install(self,args);
}

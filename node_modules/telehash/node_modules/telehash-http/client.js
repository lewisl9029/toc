var io = require("socket.io-client");

exports.install = function(self)
{
  var sockets = {};
  self.deliver("http", function(path, msg, to) {
    if(!sockets[path.http]){
      sockets[path.http] = io.connect(path.http);
      sockets[path.http].on("packet", function(packet){
        self.receive((new Buffer(packet.data, "base64")).toString("binary"), path);
      });
    }
    sockets[path.http].emit("packet", {data: msg.toString("base64")});
  });  
}


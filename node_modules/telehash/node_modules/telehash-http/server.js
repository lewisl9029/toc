
exports.install = function(self, args)
{
  if(!args) args = {};
  var io = require("socket.io").listen(args.port||0, {log:false});

  // guess any local ipv4 just once for http
  if(!args.http)
  {
    var ifaces = require("os").networkInterfaces()
    var best;
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details){
        if(details.family != "IPv4") return;
        if(!best || !self.isLocalIP(details.address) || best == "127.0.0.1") best = details.address;
      });
      args.http = "http://"+best+":"+io.server.address().port;
    }
    
  }

  self.pathSet({type:"http","http":args.http});    

  io.on("connection", function(socket){
    socket.on("packet", function(packet) {
      if(!packet.data) return;
      self.receive((new Buffer(packet.data, "base64")).toString("binary"), {type:"local", id:socket.id});
    });
  });
  self.deliver("local",function(to,msg){
    var buf = Buffer.isBuffer(msg) ? msg : new Buffer(msg, "binary");
    if(io.sockets.sockets[to.id])
    {
      io.sockets.sockets[to.id].emit("packet", {data: buf.toString("base64")});
    }
  });
}


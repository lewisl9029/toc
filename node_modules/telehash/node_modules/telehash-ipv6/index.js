var dgram = require("dgram");
var os = require("os");

exports.install = function(self, args)
{
  var paths = [];
  if(!args) args = {};
  if(typeof args.port != "number") args.port = 0;

  function msgs(msg, rinfo){
    self.receive(msg.toString("binary"), {type:"ipv6", ip:rinfo.address, port:rinfo.port});
  }

  var server = dgram.createSocket("udp6", msgs);
  server.on("error", function(err){
    console.log("error from the UDP6 socket, dropping IPv6 support",err);
    self.deliver("ipv6",false);
    paths.forEach(function(path){
      self.pathSet(path,true);
    });
  });

  self.deliver("ipv6",function(to,msg){
    var buf = Buffer.isBuffer(msg) ? msg : new Buffer(msg, "binary");
    server.send(buf, 0, buf.length, to.port, to.ip);    
  });

  self.wait(true);
  server.bind(args.port, "::0", function(err){
    // regularly update w/ local ip address changes
    function interfaces()
    {
      var ifaces = os.networkInterfaces()
      var address = server.address();
      var paths2 = [];
      for (var dev in ifaces) {
        ifaces[dev].forEach(function(details){
          if(details.family != "IPv6") return;
          if(details.internal) return;
          if(details.address.length <= 4) return;
          var path = {type:"ipv6",ip:details.address,port:address.port};
          if(self.pathMatch(path,paths2)) return;
          paths2.push(path);
        });
      }
      paths2.forEach(function(path){
        var path1 = self.pathMatch(path,paths);
        // add new ones
        if(!path1) self.pathSet(path);
        // look for old missing ones to remove
        paths.splice(paths.indexOf(path1),1);
      });
      // leftovers gone
      paths.forEach(function(path){
        self.pathSet(path,true);
      });
      // for next time
      paths = paths2;
      setTimeout(interfaces,10000);
    }
    interfaces();
    self.wait(false);
  });
}


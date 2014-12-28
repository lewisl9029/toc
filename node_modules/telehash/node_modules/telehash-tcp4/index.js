var net = require('net');
var os = require('os');
var lob = require('lob-enc');
var upnp = require('nat-upnp');
var pmp = require('pmp');

exports.name = 'tcp4';
exports.port = 0;
exports.ip = '0.0.0.0';

// add our transport to this new mesh
exports.mesh = function(mesh, cbExt)
{
  var args = mesh.args||{};
  var telehash = mesh.lib;

  var tp = {pipes:{}};

  // tcp server and accept
  tp.server = net.createServer(function connect(sock){
    tp.pipe(false, {type:'tcp4',ip:sock.remoteAddress,port:sock.remotePort}, function(pipe){
      pipe.use(sock);
    });
  });

  tp.server.on('error', function(err){
    telehash.log.error('tcp4 socket fatal error',err);
  });

  // turn a path into a pipe
  tp.pipe = function(link, path, cbPipe){
    if(typeof path != 'object' || path.type != 'tcp4') return false;
    if(typeof path.ip != 'string' || typeof path.port != 'number') return false;
    var id = [path.ip,path.port].join(':');
    var pipe = tp.pipes[id];
    if(pipe) return cbPipe(pipe);
    pipe = new telehash.Pipe('tcp4',exports.keepalive);
    tp.pipes[id] = pipe;
    pipe.id = id;
    pipe.path = path;
    pipe.chunks = lob.chunking({}, function receive(err, packet){
      if(packet) mesh.receive(packet, pipe);
    });
    // util to add/use this socket
    pipe.use = function(sock){
      if(pipe.sock) pipe.sock.end();
      // track this sock and 'pipe' it to/from our chunks
      pipe.sock = sock;
      sock.pipe(pipe.chunks);
      pipe.chunks.pipe(sock);
      sock.on('end',function(){
        pipe.sock = false;
      })
    }
    pipe.onSend = function(packet, link, cb){
      // must create a connecting socket if none
      if(!pipe.sock) pipe.use(net.connect(path));
      pipe.chunks.send(packet);
      cb();
    }
    cbPipe(pipe);
  };

  // return our current addressible paths
  tp.paths = function(){
    var ifaces = os.networkInterfaces()
    var address = tp.server.address();
    var local = '127.0.0.1';
    var best = mesh.public.ipv4; // prefer that if any set
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details){
        if(details.family != 'IPv4') return;
        if(details.internal)
        {
          local = details.address;
          return;
        }
        if(!best) best = details.address;
      });
    }
    best = tp.nat||best||local;
    return [{type:'tcp4',ip:best,port:address.port}];
  };

  // use config options or bind any/all
  tp.server.listen(args.port?args.port:exports.port, args.ip||exports.ip, function(err){
    if(err) telehash.log.error('tcp4 listen error',err);
    // TODO start pmp and upnp w/ our port
    cbExt(undefined, tp);
  });

}


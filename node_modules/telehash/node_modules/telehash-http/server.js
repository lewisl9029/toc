exports.name = 'http-server';
var io = require('socket.io');
var http = require('http');
var lob = require('lob-enc');

exports.mesh = function(mesh, cbMesh)
{
  var log = mesh.log;
  // make our own reference to args in case we're called multiple times (multiple http servers)
  var args = mesh.args.http||{};
  if(!args.protocol) args.protocol = 'http';
  var tp = {};
  // create a server if one not given
  tp.server = args.server||http.createServer();
  tp.io = io.listen(tp.server, {log:false});

  // http is primarily for public / non-local usage, so only return the most public path
  tp.paths = function(){
    // if there's one manually configured, use that
    if(args.url) return [{type:'http',url:args.url}];

    // just use the best local one
    var port = tp.server.address().port;
    var ifaces = require('os').networkInterfaces()
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
    best = best||local;
    return [{type:'http',url:args.protocol+'://'+best+':'+port}];
  };

  // all incoming connections turn into their own pipes
  tp.io.on('connection', function(socket){
    var pipe = new mesh.lib.Pipe('http-server');
    pipe.id = socket.id;
    pipe.from = socket.handshake.address;
    log.debug('new http connection',pipe.from,socket.handshake.headers['user-agent']);

    // send packets out to the client as messages
    pipe.onSend = function(packet, link, cb){
      if(!socket) return;
      // TODO, if channel packet, use .volatile
      var msg = lob.encode(packet);
      socket.emit('msg', msg.toString('binary'));
      cb();
    }

    socket.on('msg', function(msg) {
      var packet = lob.decode(new Buffer(msg,'binary'));
      if(!packet) return log.info('dropping invalid packet from',pipe.from,msg.toString('hex'));
      mesh.receive(packet, pipe);
    });

    // when disconnected, fire keepalive notif since we're dead
    socket.on('disconnect', function () {
      pipe.emit('keepalive');
      socket = false;
    });
  });

  // if server was provided, just return
  if(args.server) return cbMesh(undefined, tp);
  
  // otherwise return after fully listening
  tp.server.listen(args.port||0, function(err){
    cbMesh(err, tp);
  });
}


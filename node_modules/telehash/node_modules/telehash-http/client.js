exports.name = 'http-client';
var io = require('socket.io-client');
var urllib = require('url');
var lob = require('lob-enc');

exports.mesh = function(mesh, cbMesh)
{
  var log = mesh.log;
  var tp = {pipes:{}};

  // turn a path into a pipe backed by a socket.io client
  tp.pipe = function(hn, path, cbPipe){
    if(typeof path != 'object' || path.type != 'http' || typeof path.url != 'string') return false;
    var url = urllib.parse(path.url);
    if(url.protocol != 'http:' && url.protocol != 'https:') return false;
    var id = url.href;
    var pipe = tp.pipes[id];
    if(pipe) return cbPipe(pipe);
    
    // new socket.io connection attempt
    var socket = io.connect(id);

    socket.on('connect', function(){
      log.debug('connected',id);

      // create new pipe for the connected socket
      pipe = tp.pipes[id] = new mesh.lib.Pipe('http-client');
      pipe.id = id;
      pipe.path = path;

      // receive incoming socket.io messages
      socket.on('msg', function(msg){
        var packet = lob.decode(new Buffer(msg,'binary'));
        if(!packet) return log.info('dropping invalid packet from',pipe.id,msg.toString('hex'));
        mesh.receive(packet, pipe);
      });
    
      // send packets out to the server as messages
      pipe.onSend = function(packet, link, cb){
        if(!socket) return; // disconnected
        // TODO, if channel packet, use .volatile
        var msg = lob.encode(packet);
        socket.emit('msg', msg.toString('binary'));
        cb();
      }

      socket.on('disconnect', function(){
        log.debug('disconnected',pipe.id);
        if(tp.pipes[pipe.id] == pipe) delete tp.pipes[pipe.id];
        pipe.emit('keepalive');
        socket = false;
      });
    
      cbPipe(pipe);
    });

    // helpful
    socket.on('error', function(err){
      log.info('http connection error to',id,err);
    })
  };

  cbMesh(undefined, tp);
}


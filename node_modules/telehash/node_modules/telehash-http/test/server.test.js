var expect = require('chai').expect;
var ext = require('../server.js');
var sioc = require('socket.io-client');


describe('http-server', function(){

  var mockMesh = {
    log:console,
    args:{},
    public:{},
    lib:{Pipe:function(){return {send:function(p,l,cb){cb()}}}},
    receive:function(){}
  };

  it('exports an object', function(){
    expect(ext).to.be.a('object');
  });

  it('is an extension', function(){
    expect(ext.mesh).to.be.a('function');
    expect(ext.name).to.be.equal('http-server');
  });

  it('extends a mock mesh', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      expect(tp).to.be.a('object');
      expect(tp.paths).to.be.a('function');
      expect(tp.server).to.exist;
      done();
    });
  });

  it('returns paths array', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      var paths = tp.paths();
      console.log(paths);
      expect(Array.isArray(paths)).to.be.true;
      expect(paths.length).to.be.equal(1);
      done();
    });
  });
  
  it('receives a connection and packet', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      var path = tp.paths()[0];

      mockMesh.receive = function(packet, pipe)
      {
        expect(packet.length).to.be.equal(42);
        expect(pipe.id).to.exist;
        done();
      }

      var socket = sioc.connect(path.url);
      socket.on('connect',function(){
        socket.emit('msg',new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex'));
      });
    });
  });

})
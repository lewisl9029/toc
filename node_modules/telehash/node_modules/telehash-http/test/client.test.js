var expect = require('chai').expect;
var ext = require('../client.js');


describe('http-client', function(){

  console.debug = console.log;
  var mockMesh = {
    log:console,
    lib:{Pipe:function(){return {send:function(p,l,cb){
      if(!this.onSend) return cb();
      this.onSend.apply(this,arguments);
    }}}},
    receive:function(){}
  };

  it('exports an object', function(){
    expect(ext).to.be.a('object');
  });

  it('is an extension', function(){
    expect(ext.mesh).to.be.a('function');
    expect(ext.name).to.be.equal('http-client');
  });

  it('extends a mock mesh', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      expect(tp).to.be.a('object');
      expect(tp.pipe).to.be.a('function');
      done();
    });
  });

  it('skips unknown pipe', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      expect(tp.pipe(false, {}, function(){})).to.be.false;
      done();
    });
  });

  it('delivers a packet over a connected pipe', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      var server = require('http').createServer();
      var io =  require('socket.io')(server);
      io.on('connection', function(socket){
        socket.on('msg', function(msg){
          var buf = new Buffer(msg,'binary');
          expect(buf.toString('hex')).to.be.equal('00147b226a736f6e223a7b223432223a747275657d7d');
          done();
        });
      });
      server.listen(0, function(err){
        expect(err).to.not.exist;
        var port = server.address().port;
        expect(port).to.be.above(0);
        tp.pipe(false, {type:'http',url:'http://127.0.0.1:'+port}, function(pipe){
          expect(pipe).to.exist;
          pipe.send({json:{'42':true}},false,function(){});
        });
      })
    });
  });

})
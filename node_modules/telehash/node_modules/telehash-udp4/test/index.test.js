var expect = require('chai').expect;
var ext = require('../index.js');


describe('udp4', function(){

  var mockMesh = {
    public:{},
    lib:{Pipe:function(){return {send:function(p,l,cb){cb()}}},log:console},
    receive:function(){}
  };

  it('exports an object', function(){
    expect(ext).to.be.a('object');
  });

  it('is an extension', function(){
    expect(ext.mesh).to.be.a('function');
    expect(ext.name).to.be.equal('udp4');
  });

  it('extends a mock mesh', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      expect(tp).to.be.a('object');
      expect(tp.pipe).to.be.a('function');
      expect(tp.paths).to.be.a('function');
      expect(tp.discover).to.be.a('function');
      expect(tp.server).to.exist;
      done();
    });
  });

  it('returns paths array', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      var paths = tp.paths();
      expect(Array.isArray(paths)).to.be.true;
      done();
    });
  });

  it('returns a public path', function(done){
    mockMesh.public = {ipv4:'1.2.3.4'}
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      var paths = tp.paths().filter(function(path){return path.ip == '1.2.3.4'});
      expect(paths.length).to.be.equal(1);
      done();
    });
  });
  
  it('enables discovery', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      tp.discover({}, function(err){
        expect(err).to.not.exist;
        done();
      });
    });
  });
  
  it('skips unknown pipe', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      expect(tp.pipe(false, {}, function(){})).to.be.false;
      done();
    });
  });

  it('creates a pipe', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      tp.pipe(false, {type:'udp4',ip:'127.0.0.1',port:42424}, function(pipe){
        expect(pipe).to.exist;
        done();
      });
    });
  });

  it('sends a packet', function(done){
    ext.mesh(mockMesh, function(err, tp){
      expect(err).to.not.exist;
      tp.pipe(false, {type:'udp4',ip:'127.0.0.1',port:42424}, function(pipe){
        expect(pipe).to.exist;
        pipe.send({},false,done);
      });
    });
  });

})
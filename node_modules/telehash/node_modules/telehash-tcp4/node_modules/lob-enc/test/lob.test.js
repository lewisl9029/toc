var expect = require('chai').expect;
var es = require('event-stream');
var crypto = require('crypto');
var lob = require('../index.js');


describe('hashname', function(){

  it('should encode', function(){
    var json = {
      "type":"test",
      "foo":["bar"]
    };
    var body = new Buffer("any binary!");
    var bin = lob.encode(json, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(42);
  });

  it('should decode', function(){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var packet = lob.decode(bin);
    expect(packet).to.be.a('object');
    expect(packet.json.type).to.be.equal('test');
    expect(packet.body.length).to.be.equal(11);
  });

  it('should transpose', function(){
    var hex = '001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921';
    var bin = new Buffer(hex,'hex');
    var packet = lob.decode(bin);
    bin = lob.encode(packet);
    expect(bin).to.be.a('object');
    expect(bin.toString('hex')).to.be.equal(hex);
  });

  it('should handle no head', function(){
    var body = new Buffer("any binary!");
    var bin = lob.encode(null, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(13);
    var packet = lob.decode(bin);
    expect(packet.head.length).to.be.equal(0);
    expect(packet.body.toString()).to.be.equal("any binary!");
  });

  it('should handle empty head', function(){
    var bin = lob.encode({});
    expect(bin.length).to.be.equal(2);
  });

  it('should handle bin head', function(){
    var head = new Buffer("42","hex");
    var body = new Buffer("any binary!");
    var bin = lob.encode(head, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(14);
    var packet = lob.decode(bin);
    expect(packet.head.length).to.be.equal(1);
    expect(packet.head.toString("hex")).to.be.equal("42");
    expect(packet.body.toString()).to.be.equal("any binary!");
  });

  it('should verify', function(){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var packet = lob.decode(bin);
    expect(lob.isPacket(packet)).to.be.true;
    expect(lob.isPacket({})).to.be.false;
    expect(lob.isPacket(new Buffer(0))).to.be.false;
    var pkt = new Buffer(2);
    pkt.head = pkt.body = new Buffer(0);
    pkt.json = {};
    expect(lob.isPacket(pkt)).to.be.true;
    delete pkt.json;
    expect(lob.isPacket(pkt)).to.be.false;
  });

  it('should packet', function(){
    var packet = lob.packet({a:0},new Buffer(2));
    expect(lob.isPacket(packet)).to.be.true;
    expect(packet.length).to.be.equal(11);
  });

  it('should stream', function(done){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var stream = lob.stream(function(packet, cb){
      expect(lob.isPacket(packet)).to.be.true;
      expect(cb).to.be.a('function');
      expect(packet.head.length).to.be.equal(29);
      done();
    });
    stream.pipe(es.wait(function(err, body){
      expect(err).to.not.exist;
      expect(body.length).to.be.equal(11);
    }));
    stream.write(bin);
  });

  it('should stream assemble', function(done){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var stream = lob.stream(function(packet, cb){
      expect(lob.isPacket(packet)).to.be.true;
      expect(cb).to.be.a('function');
      expect(packet.head.length).to.be.equal(29);
      done();
    });
    stream.pipe(es.wait(function(err, body){
      expect(err).to.not.exist;
      expect(body.length).to.be.equal(11);
    }));
    es.readArray([bin.slice(0,10),bin.slice(10,20),bin.slice(20,30),bin.slice(30)]).pipe(stream);
  });

  it('should chunk stream', function(done){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var stream2 = lob.chunking({}, function(err, packet){
      expect(lob.isPacket(packet)).to.be.true;
      expect(packet.head.length).to.be.equal(29);
      done();
    });
    var stream1 = lob.chunking({});
    stream1.pipe(stream2);
    stream2.pipe(stream1);
    stream1.send(bin);
  });

  it('should chunk bidi', function(done){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var stream2 = lob.chunking({}, function(err, packet){
      expect(lob.isPacket(packet)).to.be.true;
      expect(packet.head.length).to.be.equal(29);
      stream2.send(packet); // bounce back
    });
    var stream1 = lob.chunking({}, function(err, packet){
      expect(lob.isPacket(packet)).to.be.true;
      expect(packet.head.length).to.be.equal(29);
      done();
    });
    stream1.pipe(stream2);
    stream2.pipe(stream1);
    stream1.send(bin);
  });

  it('should chunk stream w/ acks', function(done){
    var bin = lob.encode({foo:true},require('crypto').randomBytes(1000));
    var stream2 = lob.chunking({ack:"chunk"}, function(err, packet){
      expect(lob.isPacket(packet)).to.be.true;
      expect(packet.body.length).to.be.equal(1000);
      done();
    });
    var stream1 = lob.chunking({});
    stream1.pipe(stream2);
    stream2.pipe(stream1);
    stream1.send(bin);
  });
  
  it('should cloak and decloak', function(){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var packet = lob.decloak(bin);
    expect(packet).to.be.a('object');
    expect(packet.json.type).to.be.equal('test');
    expect(packet.body.length).to.be.equal(11);
    var cloaked = lob.cloak(packet);
    expect(Buffer.isBuffer(cloaked)).to.be.true;
    expect(cloaked.length).to.be.above(packet.length);
    console.log("cloaked",cloaked.toString("hex"));
    packet = lob.decloak(cloaked);
    expect(packet).to.be.a('object');
    expect(packet.json.type).to.be.equal('test');
    expect(packet.body.length).to.be.equal(11);
    // fixture from c
    packet = lob.decloak(new Buffer("b8921a332948eedec882b3102aa9d6de8688d73a195b0cab64bbf61f5c6805df85e901c1fb774046f46a43ba5440a5cad24eb486","hex"));
    expect(packet).to.be.a('object');
    expect(packet.json.test).to.be.equal('cloaked');
    expect(packet.body.length).to.be.equal(0);
  });

})
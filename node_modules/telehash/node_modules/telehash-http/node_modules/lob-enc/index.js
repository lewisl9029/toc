var crypto = require('crypto');
var chacha20 = require('chacha20');

// encode a packet
exports.encode = function(head, body)
{
  // support different arg types
  if(head === null) head = false; // grrrr
  if(typeof head == 'number') head = new Buffer(String.fromCharCode(json));
  if(typeof head == 'object')
  {
    // accept a packet as the first arg
    if(Buffer.isBuffer(head.body) && body === undefined)
    {
      body = head.body;
      head = head.head || head.json;
    }
    // serialize raw json
    if(!Buffer.isBuffer(head))
    {
      head = new Buffer(JSON.stringify(head));
      // require real json object
      if(head.length < 7) head = false;
    }
  }
  head = head || new Buffer(0);
  if(typeof body == 'string') body = new Buffer(body, 'binary');
  body = body || new Buffer(0);
  var len = new Buffer(2);
  len.writeInt16BE(head.length, 0);
  return Buffer.concat([len, head, body]);
}

// packet decoding, add values to a buffer return
exports.decode =function(bin)
{
  if(!bin) return undefined;
  var buf = (typeof bin == 'string') ? new Buffer(bin, 'binary') : bin;
  if(bin.length < 2) return undefined;

  // read and validate the json length
  var len = buf.readUInt16BE(0);
  if(len > (buf.length - 2)) return undefined;
  buf.head = buf.slice(2, len+2);
  buf.body = buf.slice(len + 2);

  // parse out the json
  buf.json = {};
  if(len >= 7)
  {
    try {
      buf.json = JSON.parse(buf.head.toString('utf8'));
    } catch(E) {
      return undefined;
    }
  }
  return buf;
}

// convenience to create a valid packet object
exports.packet = function(head, body)
{
  return exports.decode(exports.encode(head, body));
}

exports.isPacket = function(packet)
{
  if(!Buffer.isBuffer(packet)) return false;
  if(packet.length < 2) return false;
  if(typeof packet.json != 'object') return false;
  if(!Buffer.isBuffer(packet.head)) return false;
  if(!Buffer.isBuffer(packet.body)) return false;
  return true;
}

// read a bytestream for a packet, decode the header and pass body through
var Transform = require('stream').Transform;
exports.stream = function(cbHead){
  var stream = new Transform();
  var buf = new Buffer(0);
  stream._transform = function(data,enc,cbTransform)
  {
    // no buffer means pass everything through
    if(!buf)
    {
      stream.push(data);
      return cbTransform();
    }
    // gather until full header
    buf = Buffer.concat([buf,data]);
    var packet = exports.decode(buf);
    if(!packet) return cbTransform();
    buf = false; // pass through all future data
    // give to the app
    cbHead(packet, function(err){
      if(err) return cbTransform(err);
      stream.push(packet.body);
      cbTransform();
    });
  }
  return stream;
}

// chunking stream
var Duplex = require('stream').Duplex;
exports.chunking = function(args, cbPacket){
  if(!args) args = {};
  if(!args.size || args.size > 255) args.size = 255; // 1 to 255 bytes
  if(!cbPacket) cbPacket = function(err, packet){ };

  var stream = new Duplex({allowHalfOpen:false});
  var acking = false;
  var queue = [];
  
  // incoming chunked data coming from another stream
  var chunks = new Buffer(0);
  var data = new Buffer(0);
  stream._write = function(data2,enc,cbWrite)
  {
    data = Buffer.concat([data,data2]);
    while(data.length)
    {
      var len = data.readUInt8(0);
      // packet done
      if(len === 0)
      {
        if(chunks.length)
        {
          var packet = exports.decode(chunks);
          chunks = new Buffer(0);
          if(packet) cbPacket(false, packet);
        }
        data = data.slice(1);
        continue;
      }
      // not a full chunk yet, wait for more
      if(data.length < (len+1)) break;
      // full chunk, buffer it up
      chunks = Buffer.concat([chunks,data.slice(1,len+1)]);
      data = data.slice(len+1);
      // send/clear acks per chunk when enabled
      if(args.ack)
      {
        acking = false;
        if(!queue.length) queue.push(new Buffer("\0"));
        stream.send();
      }
    }
    cbWrite();
  }

  // accept packets to be chunked
  stream.send = function(packet)
  {
    // break packet into chunks and add to queue
    while(packet)
    {
      var len = new Buffer(1);
      var chunk = packet.slice(0,args.size-1);
      packet = packet.slice(chunk.length);
      len.writeUInt8(chunk.length,0);
      // check if we can include the packet terminating zero
      var zero = new Buffer(0);
      if(packet.length == 0 && chunk.length < 255)
      {
        zero = new Buffer("\0");
        packet = false;
      }
      queue.push(Buffer.concat([len,chunk,zero]));
    }

    // pull next packet to be chunked off the queue
    if(queue.length && !acking)
    {
      if(args.ack) acking = true;
      if(stream.push(queue.shift())) stream.send(); // let the loop figure itself out
    }
  }

  // try sending more chunks
  stream._read = function(size)
  {
    stream.send();
  }

  return stream;
}

function keyize(key)
{
  if(!key) key = "telehash";
  if(Buffer.isBuffer(key) && key.length == 32) return key;
  return crypto.createHash('sha256').update(key).digest();
}

exports.cloak = function(packet, key, rounds)
{
  if(!(key = keyize(key)) || !Buffer.isBuffer(packet)) return undefined;
  if(!rounds) rounds = 1;
  // get a non-zero start
  while(1)
  {
    var nonce = crypto.randomBytes(8);
    if(nonce[0] == 0) continue;
    break;
  }
  var cloaked = Buffer.concat([nonce, chacha20.encrypt(key, nonce, packet)]);
  rounds--;
  return (rounds) ? exports.cloak(cloaked, key, rounds) : cloaked;
}

exports.decloak = function(cloaked, key, rounds)
{
  if(!(key = keyize(key)) || !Buffer.isBuffer(cloaked) || cloaked.length < 2) return undefined;
  if(!rounds) rounds = 0;
  if(cloaked[0] == 0)
  {
    var packet = exports.decode(cloaked);
    if(packet) packet.cloaked = rounds;
    return packet;
  }
  if(cloaked.length < 10) return undefined; // must have cloak and a minimum packet
  rounds++;
  return exports.decloak(chacha20.decrypt(key, cloaked.slice(0,8), cloaked.slice(8)), key, rounds);
}


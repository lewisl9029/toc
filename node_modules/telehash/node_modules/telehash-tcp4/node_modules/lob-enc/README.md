# Length-Object-Binary (LOB) Packet Encoding (javascript)

This module will encode and decode [LOB](https://github.com/telehash/telehash.org/tree/master/v3/lob) packets to/from JSON and Buffers.

Install: `npm install lob-enc`

Primary usage:

```js
var lob = require('lob-enc');
var json = {
  "type":"test",
  "foo":["bar"]
};
var body = new Buffer("any binary!");
var bin = lob.encode(json, body));
// bin will be a buffer with json and body encoded

var packet = lob.decode(bin);
// packet.json == json, and packet.body == body

// do both encode and decode together, for convenience
var packet = lob.packet(json, body);

// object validator
var bool = lob.isPacket(packet);
```

Also supports reading a packet in a [streaming mode](https://github.com/telehash/telehash.org/blob/master/v3/channels/thtp.md#thtp-channel):

````js
var stream = lob.stream(function(packet, cbDone){
  // packet.json is the complete header
  // any packet.body will be subsequently streamed
  cbDone();
});

var es = require('event-stream');
stream.pipe(es.wait(function(err, body){
  // body is the body of the packet
}));

// test stream in fragments
var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
es.readArray([bin.slice(0,10),bin.slice(10,20),bin.slice(20,30),bin.slice(30)]).pipe(stream);
````

Packets can be read and written in [chunks](https://github.com/telehash/telehash.org/blob/master/v3/lob/chunking.md):

````js
// args.ack = true will only send one chunk until another is read, blocking/acking
var chunk = lob.chunking(args, function cbPacket(err, packet){ });

chunk.pipe(socket); // chunks are written to socket
socket.pipe(chunk); // incoming socket data is read back as chunks

chunk.send(packet); // send a packet as one or more chunks
````

Packets can be [cloaked](https://github.com/telehash/telehash.org/blob/master/v3/cloaking.md):

````js
var cloaked = lob.cloak(packet);
var packet = lob.decloak(cloaked);
// packet.cloaked = # of rounds
````

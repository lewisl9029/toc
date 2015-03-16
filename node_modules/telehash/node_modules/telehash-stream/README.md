telesocket
==========

Adding [stream](http://nodejs.org/api/stream.html) support to [telehash-js](https://github.com/telehash/thjs) channels, also implements the [sock](https://github.com/telehash/telehash.org/blob/master/ext/sock.md) extension.

## Usage

```js
var self = new require("telehash-js").switch();
require("telehash-stream").install(self);

// on any channel created outgoing or received incoming do this to get a full read/write binary stream for that channel
var stream = chan.wrap("stream");
```

TODO: add a high level friendly self.stream("hashname") style api
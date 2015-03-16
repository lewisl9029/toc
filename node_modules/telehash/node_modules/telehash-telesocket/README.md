telesocket
==========

Adding telesocket support to telehash-js

## Usage

```js
var self = new require("telehash-js").switch();
require("telehash-telesocket").install(self);

//   - to listen pass path-only uri "/foo/bar", fires callback(socket) on any incoming matching uri
self.socket("/foo/bar", callback);

//   - to connect, pass in full uri "ts://hashname/path" returns socket with .onopen, .onmessage, .onerror, and .send("str")
self.socket("ts://hashname/path");
```
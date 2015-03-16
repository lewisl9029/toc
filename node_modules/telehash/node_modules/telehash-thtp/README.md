THTP
====

Adding [THTP](https://github.com/telehash/telehash.org/blob/master/ext/bind_http.md) support to [telehash-js](https://github.com/telehash/thjs)

## Usage

```js
var self = new require("telehash-js").switch();
require("telehash-thtp").install(self);

self.thtp.listen(callback);
self.thtp.request({uri:"thtp://hashname/path"},callback);
```
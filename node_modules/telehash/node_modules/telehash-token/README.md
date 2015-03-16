hashtoken
=========

Adding [hashtoken](https://github.com/telehash/telehash.org/blob/master/ext/hashtoken.md) support to [telehash-js](https://github.com/telehash/thjs)

## Usage

```js
var self = new require("telehash-js").switch();
require("telehash-token").install(self);

// returns a token string
self.token();

// returns a token string, fires callback(from) when it's called
self.token(callback);

// listens for token, fires callback(from) when it's called
self.token(token, callback);

// called for any un-matched tokens
self.tokens = function(token, from, callback){ callback(true||false); };

// use a token, fires callback(err, to)
self.dispense(token, callback);
```
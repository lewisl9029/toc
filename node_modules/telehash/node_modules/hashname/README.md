# Hashname - A fingerprint for multiple public keys (in pure javascript)

This module will generate and parse [hashnames](https://github.com/telehash/telehash.org/tree/master/v3/hashname), base32 encoded consistent fingerprint strings from one or more public keys.

Install: `npm install hashname`

Primary usage:

```js
var hashname = require('hashname');
var keys = {
  "3a":"hp6yglmmqwcbw5hno37uauh6fn6dx5oj7s5vtapaifrur2jv6zha",
  "1a":"vgjz3yjb6cevxjomdleilmzasbj6lcc7"
};
var hn = hashname.fromKeys(keys));
// hn will be 'jvdoio6kjvf3yqnxfvck43twaibbg4pmb7y3mqnvxafb26rqllwa'
```

There's also other utility/convenience methods, see the examples in the [tests](test/).
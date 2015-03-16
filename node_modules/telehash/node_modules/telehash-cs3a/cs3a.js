var crypto = require("crypto");

var self;
exports.install = function(telehash)
{
  self = telehash;
  telehash.CSets["3a"] = exports;
}

var sodium;
exports.crypt = function(s)
{
  sodium = s;
}

exports.genkey = function(ret,cbDone,cbStep)
{
  var kp = sodium.crypto_box_keypair();
  ret["3a"] = kp.publicKey.toString("base64");
  ret["3a_secret"] = kp.secretKey.toString("base64");
  cbDone();
}

exports.loadkey = function(id, pub, priv)
{
  if(typeof pub == "string") pub = new Buffer(pub,"base64");
  if(!Buffer.isBuffer(pub) || pub.length != 32) return "invalid public key";
  id.key = pub;
  id.public = pub;

  if(priv)
  {
    if(typeof priv == "string") priv = new Buffer(priv,"base64");
    if(!Buffer.isBuffer(priv) || priv.length != 32) return "invalid private key";
    id.private = priv;
  }
  return false;
}

exports.openize = function(id, to, inner)
{
	if(!to.linekey) to.linekey = sodium.crypto_box_keypair();
  var linepub = to.linekey.publicKey;

  // get the shared secret to create the iv+key for the open aes
  var secret = sodium.crypto_box_beforenm(to.public, to.linekey.secretKey);
  var nonce = new Buffer("000000000000000000000000000000000000000000000001","hex");

  // encrypt the inner, encode if needed
  var body = (!Buffer.isBuffer(inner)) ? self.pencode(inner,id.cs["3a"].key) : inner;
  var cbody = sodium.crypto_secretbox(body, nonce, secret);
  cbody = cbody.slice(sodium.crypto_secretbox_BOXZEROBYTES); // remove zeros from nacl's api

  // prepend the line public key and hmac it  
  var secret = sodium.crypto_box_beforenm(to.public, id.cs["3a"].private);
  var macd = Buffer.concat([linepub,cbody]);
  var mac = sodium.crypto_onetimeauth(macd,secret);

  // create final body
  var body = Buffer.concat([mac,macd]);
  return self.pencode(0x3a, body);
}

exports.deopenize = function(id, open)
{
  var ret = {verify:false};
  if(!open.body) return ret;

  var mac1 = open.body.slice(0,16).toString("hex");
  ret.linepub = open.body.slice(16,48);
  var cbody = open.body.slice(48);

  var secret = sodium.crypto_box_beforenm(ret.linepub,id.cs["3a"].private);
  var nonce = new Buffer("000000000000000000000000000000000000000000000001","hex");

  // decipher the inner
  var zeros = new Buffer(Array(sodium.crypto_secretbox_BOXZEROBYTES)); // add zeros for nacl's api
  var body = sodium.crypto_secretbox_open(Buffer.concat([zeros,cbody]),nonce,secret);
  var inner = self.pdecode(body);
  if(!inner) return ret;
  ret.inner = inner;

  // if needs validation, load inner key info
  if(!open.from)
  {
    ret.key = inner.body;
    if(!ret.key || ret.key.length != 32) return ret;
    if(typeof inner.js.from != "object" || !inner.js.from["3a"]) return ret;
    if(crypto.createHash("SHA256").update(inner.body).digest("hex") != inner.js.from["3a"]) return ret;
  }else{
    ret.key = open.from.public;
  }

  // verify the hmac
  var secret = sodium.crypto_box_beforenm(ret.key, id.cs["3a"].private);
  var mac2 = sodium.crypto_onetimeauth(open.body.slice(16),secret).toString("hex");
  if(mac2 != mac1) return ret;

  // all good, cache+return
  ret.verify = true;
  ret.js = inner.js;
//    console.log("INNER",inner.js,ret.key.length);
  return ret;
}

// set up the line enc/dec keys
exports.openline = function(from, open)
{
  from.lineIV = 0;
  from.lineInB = new Buffer(from.lineIn, "hex");
  var secret = sodium.crypto_box_beforenm(open.linepub, from.linekey.secretKey);
  from.encKey = crypto.createHash("sha256")
    .update(secret)
    .update(new Buffer(from.lineOut, "hex"))
    .update(new Buffer(from.lineIn, "hex"))
    .digest();
  from.decKey = crypto.createHash("sha256")
    .update(secret)
    .update(new Buffer(from.lineIn, "hex"))
    .update(new Buffer(from.lineOut, "hex"))
    .digest();
  return true;
},

exports.lineize = function(to, packet)
{
	// now encrypt the packet
  var nonce = crypto.randomBytes(24);
  var cbody = sodium.crypto_secretbox(self.pencode(packet.js,packet.body), nonce, to.encKey);
  cbody = cbody.slice(sodium.crypto_secretbox_BOXZEROBYTES); // remove zeros from nacl's api

  // create final body
  var body = Buffer.concat([to.lineInB,nonce,cbody]);

  return self.pencode(null, body);
},

exports.delineize = function(from, packet)
{
  if(!packet.body) return "no body";
  // remove lineid
  packet.body = packet.body.slice(16);
  
  // decrypt body
  var nonce = packet.body.slice(0,24);
  var cbody = packet.body.slice(24);
  var zeros = new Buffer(Array(sodium.crypto_secretbox_BOXZEROBYTES)); // add zeros for nacl's api
  var deciphered = self.pdecode(sodium.crypto_secretbox_open(Buffer.concat([zeros,cbody]),nonce,from.decKey));
	if(!deciphered) return "invalid decrypted packet";

  packet.js = deciphered.js;
  packet.body = deciphered.body;
  return false;
}


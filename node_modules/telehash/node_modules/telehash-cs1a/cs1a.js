var crypto = require("crypto");

var self;
exports.install = function(telehash)
{
  self = telehash;
  telehash.CSets["1a"] = exports;
}

exports.crypt = function(ecc,aes)
{
  crypto.ecc = ecc;
  crypto.aes = aes;
}

// simple xor buffer folder
function fold(count, buf)
{
  if(!count || buf.length % 2) return buf;
  var ret = buf.slice(0,buf.length/2);
  for(i = 0; i < ret.length; i++) ret[i] = ret[i] ^ buf[i+ret.length];
  return fold(count-1,ret);
}

exports.genkey = function(ret,cbDone,cbStep)
{
  var k = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1);
  ret["1a"] = k.PublicKey.slice(1).toString("base64");
  ret["1a_secret"] = k.PrivateKey.toString("base64");
  cbDone();
}

exports.loadkey = function(id, pub, priv)
{
  if(typeof pub == "string") pub = new Buffer(pub,"base64");
  if(!Buffer.isBuffer(pub) || pub.length != 40) return "invalid public key";
  id.key = pub;
  id.public = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1, Buffer.concat([new Buffer("04","hex"),id.key]), true);
  if(!id.public) return "public key load failed";

  if(priv)
  {
    if(typeof priv == "string") priv = new Buffer(priv,"base64");
    if(!Buffer.isBuffer(priv) || priv.length != 20) return "invalid private key";
    id.private = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1, priv);
    if(!id.private) return "private key load failed";
  }
  return false;
}

exports.openize = function(id, to, inner)
{
	if(!to.ecc) to.ecc = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1);
  var eccpub = to.ecc.PublicKey.slice(1);

  // get the shared secret to create the iv+key for the open aes
  var secret = to.ecc.deriveSharedSecret(to.public);
  var key = fold(1,crypto.createHash("sha256").update(secret).digest());
  var iv = new Buffer("00000000000000000000000000000001","hex");

  // encrypt the inner
  var body = (!Buffer.isBuffer(inner)) ? self.pencode(inner,id.cs["1a"].key) : inner;
  var cbody = crypto.aes(true, key, iv, body);

  // prepend the line public key and hmac it  
  var secret = id.cs["1a"].private.deriveSharedSecret(to.public);
  var macd = Buffer.concat([eccpub,cbody]);
  var hmac = fold(3,crypto.createHmac("sha256", secret).update(macd).digest());

  // create final body
  var body = Buffer.concat([hmac,macd]);
  return self.pencode(0x1a, body);
},

exports.deopenize = function(id, open)
{
  var ret = {verify:false};
  if(!open.body) return ret;

  var mac1 = open.body.slice(0,4).toString("hex");
  var pub = open.body.slice(4,44);
  var cbody = open.body.slice(44);

  try{
    ret.linepub = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1, Buffer.concat([new Buffer("04","hex"),pub]), true);      
  }catch(E){
    console.log("ecc err",E);
  }
  if(!ret.linepub) return ret;

  var secret = id.cs["1a"].private.deriveSharedSecret(ret.linepub);
  var key = fold(1,crypto.createHash("sha256").update(secret).digest());
  var iv = new Buffer("00000000000000000000000000000001","hex");

  // aes-128 decipher the inner
  var body = crypto.aes(false, key, iv, cbody);
  var inner = self.pdecode(body);
  if(!inner) return ret;
  ret.inner = inner;

  // verify+load inner key info
  var epub;
  if(!open.from)
  {
    epub = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp160r1, Buffer.concat([new Buffer("04","hex"),inner.body]), true);
    if(!epub) return ret;
    ret.key = inner.body;
  }else{
    epub = open.from.public;
  }

  // verify the hmac
  var secret = id.cs["1a"].private.deriveSharedSecret(epub);
  var mac2 = fold(3,crypto.createHmac("sha256", secret).update(open.body.slice(4)).digest()).toString("hex");
  if(mac2 != mac1) return ret;

  // all good, cache+return
  ret.verify = true;
  ret.js = inner.js;
  return ret;
},

// set up the line enc/dec keys
exports.openline = function(from, open)
{
  from.lineIV = crypto.randomBytes(4).readUInt32LE(0); // start from random place
  from.lineInB = new Buffer(from.lineIn, "hex");
  var ecdhe = from.ecc.deriveSharedSecret(open.linepub);
  from.encKey = fold(1,crypto.createHash("sha256")
    .update(ecdhe)
    .update(new Buffer(from.lineOut, "hex"))
    .update(from.lineInB)
    .digest());
  from.decKey = fold(1,crypto.createHash("sha256")
    .update(ecdhe)
    .update(from.lineInB)
    .update(new Buffer(from.lineOut, "hex"))
    .digest());
  return true;
},

exports.lineize = function(to, packet)
{
	// now encrypt the packet
  var iv = new Buffer(16);
  iv.fill(0);
  iv.writeUInt32LE(to.lineIV++,12);

  var cbody = crypto.aes(true, to.encKey, iv, self.pencode(packet.js,packet.body));

  // prepend the IV and hmac it
  var mac = fold(3,crypto.createHmac("sha256", to.encKey).update(Buffer.concat([iv.slice(12),cbody])).digest());

  // create final body
  var body = Buffer.concat([to.lineInB,mac,iv.slice(12),cbody]);

  return self.pencode(null, body);
},

exports.delineize = function(from, packet)
{
  if(!packet.body) return "no body";
  // remove lineid
  packet.body = packet.body.slice(16);
  
  // validate the hmac
  var mac1 = packet.body.slice(0,4).toString("hex");
  var mac2 = fold(3,crypto.createHmac("sha256", from.decKey).update(packet.body.slice(4)).digest()).toString("hex");
  if(mac1 != mac2) return "invalid hmac";

  // decrypt body
  var iv = packet.body.slice(4,8);
  var ivz = new Buffer(12);
  ivz.fill(0);
  var body = packet.body.slice(8);
  var deciphered = self.pdecode(crypto.aes(false,from.decKey,Buffer.concat([ivz,iv]),body));
	if(!deciphered) return "invalid decrypted packet";

  packet.js = deciphered.js;
  packet.body = deciphered.body;
  return false;
}
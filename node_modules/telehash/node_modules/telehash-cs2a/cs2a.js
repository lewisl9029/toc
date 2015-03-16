var crypto = require("crypto");
var sjcl = require("sjcl");

var self;
exports.install = function(telehash)
{
  self = telehash;
  telehash.CSets["2a"] = exports;
}

var forge;
exports.crypt = function(ecc,f)
{
  crypto.ecc = ecc;
  forge = f;
}

exports.genkey = function(ret,cbDone,cbStep)
{
	var state = forge.rsa.createKeyPairGenerationState(2048, 0x10001);
	var step = function() {
	  // run for 100 ms
	  if(!forge.rsa.stepKeyPairGenerationState(state, 100)) {
      if(cbStep) cbStep();
	    setTimeout(step, 10);
	  } else {
      var key = forge.asn1.toDer(forge.pki.publicKeyToAsn1(state.keys.publicKey)).bytes();
      ret["2a"] = forge.util.encode64(key);
      ret["2a_secret"] = forge.util.encode64(forge.asn1.toDer(forge.pki.privateKeyToAsn1(state.keys.privateKey)).bytes());
      cbDone();
	  }
	}
	setTimeout(step);  
}

exports.loadkey = function(id, pub, priv)
{
  // take pki or ber format
  if(pub.length > 300)
  {
    if(pub.substr(0,1) == "-") pub = forge.asn1.toDer(forge.pki.publicKeyToAsn1(forge.pki.publicKeyFromPem(key))).bytes();
    else pub = forge.util.decode64(pub);
  }
  id.key = pub;
  var pk = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(pub));    
  id.encrypt = function(buf){
    return new Buffer(pk.encrypt(buf.toString("binary"), "RSA-OAEP"), "binary");
  };
  id.verify = function(a,b){
    return pk.verify(a.toString("binary"), b.toString("binary"));
  };
  if(priv)
  {
    var sk = (priv.substr(0,1) == "-") ? forge.pki.privateKeyFromPem(priv) :  forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(forge.util.decode64(priv)));
    id.sign = function(buf){
    	var md = forge.md.sha256.create();
    	md.update(buf.toString("binary"));
      return new Buffer(sk.sign(md),"binary");
    };
    id.decrypt = function(buf){
      return new Buffer(sk.decrypt(buf.toString("binary"), "RSA-OAEP"),"binary");
    };
  }
  return false;
}

exports.openize = function(id, to, inner)
{
	if(!to.ecc) to.ecc = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp256r1);
  var eccpub = to.ecc.PublicKey.slice(1);

	// encrypt the body
  var ibody = (!Buffer.isBuffer(inner)) ? self.pencode(inner,id.cs["2a"].key) : inner;
  var keyhex = crypto.createHash("sha256").update(eccpub).digest("hex");
  var key = new sjcl.cipher.aes(sjcl.codec.hex.toBits(keyhex));
  var iv = sjcl.codec.hex.toBits("00000000000000000000000000000001");
  var cipher = sjcl.mode.gcm.encrypt(key, sjcl.codec.hex.toBits(ibody.toString("hex")), iv, [], 128);
  var cbody = new Buffer(sjcl.codec.hex.fromBits(cipher), "hex");

	// sign & encrypt the sig
  var sig = id.cs["2a"].sign(cbody);
  if(!to.lineOut) to.lineOut = ""; // no lines for tickets
  var keyhex = crypto.createHash("sha256").update(Buffer.concat([eccpub,new Buffer(to.lineOut,"hex")])).digest("hex");
  var key = new sjcl.cipher.aes(sjcl.codec.hex.toBits(keyhex));
  var cipher = sjcl.mode.gcm.encrypt(key, sjcl.codec.hex.toBits(sig.toString("hex")), iv, [], 32);
  var csig = new Buffer(sjcl.codec.hex.fromBits(cipher), "hex");

	// encrypt the ecc key
  var ekey = to.encrypt(eccpub);

  var body = Buffer.concat([ekey,csig,cbody]);    
  //	console.log(open, body.length);
	var packet = self.pencode(0x2a, body);
	return packet;
}

exports.deopenize = function(id, open)
{
  var ret = {verify:false};
  // grab the chunks
  var ekey = open.body.slice(0,256);
  var csig = open.body.slice(256,256+260);
  var cbody = open.body.slice(256+260);

  // decrypt the ecc public key and verify/load it
  var eccpub = id.cs["2a"].decrypt(ekey);
  if(!eccpub) return ret;
  try {
    ret.linepub = new crypto.ecc.ECKey(crypto.ecc.ECCurves.secp256r1, Buffer.concat([new Buffer("04","hex"),eccpub]), true);
  }catch(E){};
  if(!ret.linepub) return ret;

  // decipher the body as a packet so we can examine it
  var keyhex = crypto.createHash("sha256").update(eccpub).digest("hex");
  var key = new sjcl.cipher.aes(sjcl.codec.hex.toBits(keyhex));
  var iv = sjcl.codec.hex.toBits("00000000000000000000000000000001");
  var cipher = sjcl.mode.gcm.decrypt(key, sjcl.codec.hex.toBits(cbody.toString("hex")), iv, [], 128);
  var ibody = new Buffer(sjcl.codec.hex.fromBits(cipher), "hex");
  var deciphered = self.pdecode(ibody);
  if(!deciphered || !deciphered.body) return ret;
  ret.js = deciphered.js;
  ret.inner = deciphered;
  
  var from = {};
  var lineIn;
  if(!open.from)
  {
    // extract attached public key
    ret.key = deciphered.body;
    if(exports.loadkey(from,deciphered.body)) return ret;
    lineIn = deciphered.js.line;
  }else{
    from = open.from;
    lineIn = "";
  }

  // decrypt signature
  var keyhex = crypto.createHash("sha256").update(Buffer.concat([eccpub,new Buffer(lineIn,"hex")])).digest("hex");
  var key = new sjcl.cipher.aes(sjcl.codec.hex.toBits(keyhex));
  var cipher = sjcl.mode.gcm.decrypt(key, sjcl.codec.hex.toBits(csig.toString("hex")), iv, [], 32);
  var sig = new Buffer(sjcl.codec.hex.fromBits(cipher), "hex");

  // verify signature
  ret.verify = from.verify(cbody,sig);
  return ret;
}

// set up the line enc/dec keys
exports.openline = function(from, open)
{
  var ecdhe = from.ecc.deriveSharedSecret(open.linepub);
  from.lineInB = new Buffer(from.lineIn, "hex");
  var hex = crypto.createHash("sha256")
    .update(ecdhe)
    .update(new Buffer(from.lineOut, "hex"))
    .update(new Buffer(from.lineIn, "hex"))
    .digest("hex");
  from.encKey = new sjcl.cipher.aes(sjcl.codec.hex.toBits(hex));
  var hex = crypto.createHash("sha256")
    .update(ecdhe)
    .update(new Buffer(from.lineIn, "hex"))
    .update(new Buffer(from.lineOut, "hex"))
    .digest("hex");
  from.decKey = new sjcl.cipher.aes(sjcl.codec.hex.toBits(hex));
  return true;
}

exports.lineize = function(to, packet)
{
  var iv = crypto.randomBytes(16);
  var buf = self.pencode(packet.js,packet.body);

	// now encrypt the packet
  var cipher = sjcl.mode.gcm.encrypt(to.encKey, sjcl.codec.hex.toBits(buf.toString("hex")), sjcl.codec.hex.toBits(iv.toString("hex")), [], 128);
  var cbody = new Buffer(sjcl.codec.hex.fromBits(cipher),"hex");

  var body = Buffer.concat([to.lineInB,iv,cbody]);
	return self.pencode(null,body);
},

exports.delineize = function(from, packet)
{
  if(!packet.body) return "missing body";
  // remove lineid
  packet.body = packet.body.slice(16);
  var iv = sjcl.codec.hex.toBits(packet.body.slice(0,16).toString("hex"));

  try{
    var cipher = sjcl.mode.gcm.decrypt(from.decKey, sjcl.codec.hex.toBits(packet.body.slice(16).toString("hex")), iv, [], 128);    
  }catch(E){
    return E;
  }
  if(!cipher) return "no cipher output";
  var deciphered = self.pdecode(new Buffer(sjcl.codec.hex.fromBits(cipher),"hex"));
	if(!deciphered) return "invalid decrypted packet";

  packet.js = deciphered.js;
  packet.body = deciphered.body;
  return false;
}


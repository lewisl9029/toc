// prefer compiled versions

try {
  var ecc = require("ecc");
}catch(E){
  var ecc = require("ecc-jsbn")
}

try {
  var ursa = require("ursa");
}catch(E){
  var forge = require("node-forge");
}

var crypto = require("crypto");
var cs2a = require("./cs2a.js");
cs2a.crypt(ecc,forge);

// replace these when compiled ursa works and forge won't be used
if(ursa)
{
  cs2a.genkey = function(ret,cbDone,cbStep)
  {
    var kpair = ursa.generatePrivateKey();
    ret["2a"] = str2der(kpair.toPublicPem("utf8")).toString("base64");
    ret["2a_secret"] = str2der(kpair.toPrivatePem("utf8")).toString("base64");
    cbDone();
  }

  cs2a.loadkey = function(id, pub, priv)
  {  
    // take pki or ber format
    if(typeof pub == "string") pub = str2der(pub);
    id.key = pub;
    var pk = ursa.coercePublicKey(der2pem(pub,"PUBLIC"));
    if(!pk) return true;
    if(pk.getModulus().length != 256) return true;
    id.encrypt = function(buf){
      return pk.encrypt(buf, undefined, undefined, ursa.RSA_PKCS1_OAEP_PADDING);
    };
    id.verify = function(a,b){
      return pk.hashAndVerify("sha256", a, b, undefined, ursa.RSA_PKCS1_PADDING);
    };
    if(priv)
    {
      if(typeof priv == "string") priv = str2der(priv);
      var sk = ursa.coercePrivateKey(der2pem(priv,"RSA PRIVATE"));
      id.sign = function(buf){
        return sk.hashAndSign("sha256", buf, undefined, undefined, ursa.RSA_PKCS1_PADDING);
      };
      id.decrypt = function(buf){
        return sk.decrypt(buf, undefined, undefined, ursa.RSA_PKCS1_OAEP_PADDING);
      };
    }
    return false;
  }  
}

Object.keys(cs2a).forEach(function(f){ exports[f] = cs2a[f];});

// ursa is not very flexible!

var PEM_REGEX = /^(-----BEGIN (.*) KEY-----\r?\n([\/+=a-zA-Z0-9\r\n]*)\r?\n-----END \2 KEY-----\r?\n)/m;
function str2der(str)
{
  var r = PEM_REGEX.exec(str);
  var b64 = r ? r[3] : str;
  return new Buffer(b64, "base64");  
}
function der2pem(der,type)
{
  if(!der || !Buffer.isBuffer(der)) return false;
  var b64 = der.toString("base64");
  if(!b64) return false;
  b64 = b64.match(/.{1,60}/g).join("\n");
  return "-----BEGIN "+type+" KEY-----\n"+b64+"\n-----END "+type+" KEY-----\n";  
}
var crypto = require("crypto");

try {
  var ecc = require("ecc");
}catch(E){
  var ecc = require("ecc-jsbn");  
}

var cs1a = require("./cs1a.js");

cs1a.crypt(ecc,function(enc, key, iv, body)
{
  var aes = enc ? crypto.createCipheriv("AES-128-CTR", key, iv) : crypto.createDecipheriv("AES-128-CTR", key, iv);
  return Buffer.concat([aes.update(body), aes.final()]);    
});

Object.keys(cs1a).forEach(function(f){ exports[f] = cs1a[f]; });

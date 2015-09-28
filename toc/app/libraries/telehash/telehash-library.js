"format global";
"exports telehash";

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
      if (typeof window !== "undefined") {
        window.telehash = require('telehash');
      }
},{"telehash":2}],2:[function(require,module,exports){
  var thjs = require("telehash-js");
  exports.debug = thjs.debug;
  exports.info = thjs.info;

  exports.init = function(args, cbDone)
  {
    if(!args) args = {};
    var self = new thjs.switch();

    require("telehash-cs1a").install(self, args);
    if(args.cs2a) require("telehash-cs2a").install(self, args); // slow on most browsers
    require("telehash-http").install(self, args);
    require("telehash-webrtc").install(self, args);

    // extensions
    require("telehash-stream").install(self, args);
    require("telehash-telesocket").install(self, args);
    require("telehash-thtp").install(self, args);
    require("telehash-token").install(self, args);

    function seed()
    {
      require("telehash-seeds").install(self, args);

      self.online(function(err){
        cbDone(err, self);
      });
      return self;
    }

    if(args.id)
    {
      if(typeof args.id == "string" && localStorage && localStorage.getItem(args.id)) args.id = JSON.parse(localStorage.getItem(args.id));
      if(typeof args.id == "object")
      {
        var err;
        if((err = self.load(args.id))) return cbDone("error loading id, "+err+": "+JSON.stringify(args.id));
        return seed();
      }
    }

    self.make(function(err,id){
      if(err) return cbDone("error creating id, "+err);
      if(typeof args.id == "string" && localStorage) localStorage.setItem(args.id, JSON.stringify(id));
      args.id = id;
      self.load(id);
      return seed();
    });

    return self;
  }
},{"telehash-cs1a":3,"telehash-cs2a":10,"telehash-http":18,"telehash-js":20,"telehash-seeds":21,"telehash-stream":23,"telehash-telesocket":24,"telehash-thtp":25,"telehash-token":26,"telehash-webrtc":27}],3:[function(require,module,exports){
  (function (Buffer){
    var crypto = require("crypto");
    var cs1a = require("./cs1a.js");

    var ecc = require("ecc-jsbn");
    require("./forge.min.js"); // PITA not browserify compat
    cs1a.crypt(ecc,function(enc, key, iv, body)
    {
      var cipher = enc ? forge.aes.createEncryptionCipher(key.toString("binary"), "CTR") : forge.aes.createDecryptionCipher(key.toString("binary"), "CTR");
      cipher.start(iv.toString("binary"));
      cipher.update(forge.util.createBuffer(body.toString('binary')));
      cipher.finish();
      return new Buffer(cipher.output.getBytes(), "binary");
    });

    Object.keys(cs1a).forEach(function(f){ exports[f] = cs1a[f]; });

  }).call(this,require("buffer").Buffer)
},{"./cs1a.js":4,"./forge.min.js":5,"buffer":29,"crypto":35,"ecc-jsbn":6}],4:[function(require,module,exports){
  (function (Buffer){
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
  }).call(this,require("buffer").Buffer)
},{"buffer":29,"crypto":35}],5:[function(require,module,exports){
  (function (process){
    (function(){var e,t,n;(function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p,v=t&&t.split("/"),m=l.map,g=/\.js$/,y=m&&m["*"]||{};if(e&&e.charAt(0)===".")if(t){v=v.slice(0,v.length-1),e=e.split("/"),o=e.length-1,l.pkgs&&d(l.pkgs,v[0])&&g.test(e[o])&&(e[o]=e[o].replace(g,"")),e=v.concat(e);for(c=0;c<e.length;c+=1){p=e[c];if(p===".")e.splice(c,1),c-=1;else if(p===".."){if(c===1&&(e[2]===".."||e[0]===".."))break;c>0&&(e.splice(c-1,2),c-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((v||y)&&m){n=e.split("/");for(c=n.length;c>0;c-=1){r=n.slice(0,c).join("/");if(v)for(h=v.length;h>0;h-=1){i=m[v.slice(0,h).join("/")];if(i){i=i[r];if(i){s=i,u=c;break}}}if(s)break;!a&&y&&y[r]&&(a=y[r],f=c)}!s&&a&&(s=a,u=f),s&&(n.splice(0,u,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w=typeof n,E;i=i||e;if(w==="undefined"||w==="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),E=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n?n.apply(a[e],g):undefined;if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!E)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){var c,h;if(typeof e=="string")return u[e]?u[e](t):b(o(e,t).f);if(!e.splice){l=e,l.deps&&s(l.deps,l.callback),h=l.packages;if(l.packages){l.pkgs={};for(c=0;c<h.length;c++)l.pkgs[h[c].name||h[c]]=!0}if(!t)return;t.splice?(e=t,t=n,n=null):e=r}return t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s},s.config=function(e){return s(e)},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}})(),n("node_modules/almond/almond",function(){}),function(){function e(e){var t=e.util=e.util||{};typeof process=="undefined"||!process.nextTick?typeof setImmediate=="function"?(t.setImmediate=setImmediate,t.nextTick=function(e){return setImmediate(e)}):(t.setImmediate=function(e){setTimeout(e,0)},t.nextTick=t.setImmediate):(t.nextTick=process.nextTick,typeof setImmediate=="function"?t.setImmediate=setImmediate:t.setImmediate=t.nextTick),t.isArray=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"},t.isArrayBuffer=function(e){return typeof ArrayBuffer!="undefined"&&e instanceof ArrayBuffer};var n=[];typeof Int8Array!="undefined"&&n.push(Int8Array),typeof Uint8Array!="undefined"&&n.push(Uint8Array),typeof Uint8ClampedArray!="undefined"&&n.push(Uint8ClampedArray),typeof Int16Array!="undefined"&&n.push(Int16Array),typeof Uint16Array!="undefined"&&n.push(Uint16Array),typeof Int32Array!="undefined"&&n.push(Int32Array),typeof Uint32Array!="undefined"&&n.push(Uint32Array),typeof Float32Array!="undefined"&&n.push(Float32Array),typeof Float64Array!="undefined"&&n.push(Float64Array),t.isArrayBufferView=function(e){for(var t=0;t<n.length;++t)if(e instanceof n[t])return!0;return!1},t.ByteBuffer=function(e){this.data="",this.read=0;if(typeof e=="string")this.data=e;else if(t.isArrayBuffer(e)||t.isArrayBufferView(e)){var n=new Uint8Array(e);try{this.data=String.fromCharCode.apply(null,n)}catch(r){for(var i=0;i<n.length;++i)this.putByte(n[i])}}},t.ByteBuffer.prototype.length=function(){return this.data.length-this.read},t.ByteBuffer.prototype.isEmpty=function(){return this.length()<=0},t.ByteBuffer.prototype.putByte=function(e){return this.data+=String.fromCharCode(e),this},t.ByteBuffer.prototype.fillWithByte=function(e,t){e=String.fromCharCode(e);var n=this.data;while(t>0)t&1&&(n+=e),t>>>=1,t>0&&(e+=e);return this.data=n,this},t.ByteBuffer.prototype.putBytes=function(e){return this.data+=e,this},t.ByteBuffer.prototype.putString=function(e){return this.data+=t.encodeUtf8(e),this},t.ByteBuffer.prototype.putInt16=function(e){return this.data+=String.fromCharCode(e>>8&255)+String.fromCharCode(e&255),this},t.ByteBuffer.prototype.putInt24=function(e){return this.data+=String.fromCharCode(e>>16&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(e&255),this},t.ByteBuffer.prototype.putInt32=function(e){return this.data+=String.fromCharCode(e>>24&255)+String.fromCharCode(e>>16&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(e&255),this},t.ByteBuffer.prototype.putInt16Le=function(e){return this.data+=String.fromCharCode(e&255)+String.fromCharCode(e>>8&255),this},t.ByteBuffer.prototype.putInt24Le=function(e){return this.data+=String.fromCharCode(e&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(e>>16&255),this},t.ByteBuffer.prototype.putInt32Le=function(e){return this.data+=String.fromCharCode(e&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(e>>16&255)+String.fromCharCode(e>>24&255),this},t.ByteBuffer.prototype.putInt=function(e,t){do t-=8,this.data+=String.fromCharCode(e>>t&255);while(t>0);return this},t.ByteBuffer.prototype.putSignedInt=function(e,t){return e<0&&(e+=2<<t-1),this.putInt(e,t)},t.ByteBuffer.prototype.putBuffer=function(e){return this.data+=e.getBytes(),this},t.ByteBuffer.prototype.getByte=function(){return this.data.charCodeAt(this.read++)},t.ByteBuffer.prototype.getInt16=function(){var e=this.data.charCodeAt(this.read)<<8^this.data.charCodeAt(this.read+1);return this.read+=2,e},t.ByteBuffer.prototype.getInt24=function(){var e=this.data.charCodeAt(this.read)<<16^this.data.charCodeAt(this.read+1)<<8^this.data.charCodeAt(this.read+2);return this.read+=3,e},t.ByteBuffer.prototype.getInt32=function(){var e=this.data.charCodeAt(this.read)<<24^this.data.charCodeAt(this.read+1)<<16^this.data.charCodeAt(this.read+2)<<8^this.data.charCodeAt(this.read+3);return this.read+=4,e},t.ByteBuffer.prototype.getInt16Le=function(){var e=this.data.charCodeAt(this.read)^this.data.charCodeAt(this.read+1)<<8;return this.read+=2,e},t.ByteBuffer.prototype.getInt24Le=function(){var e=this.data.charCodeAt(this.read)^this.data.charCodeAt(this.read+1)<<8^this.data.charCodeAt(this.read+2)<<16;return this.read+=3,e},t.ByteBuffer.prototype.getInt32Le=function(){var e=this.data.charCodeAt(this.read)^this.data.charCodeAt(this.read+1)<<8^this.data.charCodeAt(this.read+2)<<16^this.data.charCodeAt(this.read+3)<<24;return this.read+=4,e},t.ByteBuffer.prototype.getInt=function(e){var t=0;do t=(t<<8)+this.data.charCodeAt(this.read++),e-=8;while(e>0);return t},t.ByteBuffer.prototype.getSignedInt=function(e){var t=this.getInt(e),n=2<<e-2;return t>=n&&(t-=n<<1),t},t.ByteBuffer.prototype.getBytes=function(e){var t;return e?(e=Math.min(this.length(),e),t=this.data.slice(this.read,this.read+e),this.read+=e):e===0?t="":(t=this.read===0?this.data:this.data.slice(this.read),this.clear()),t},t.ByteBuffer.prototype.bytes=function(e){return typeof e=="undefined"?this.data.slice(this.read):this.data.slice(this.read,this.read+e)},t.ByteBuffer.prototype.at=function(e){return this.data.charCodeAt(this.read+e)},t.ByteBuffer.prototype.setAt=function(e,t){return this.data=this.data.substr(0,this.read+e)+String.fromCharCode(t)+this.data.substr(this.read+e+1),this},t.ByteBuffer.prototype.last=function(){return this.data.charCodeAt(this.data.length-1)},t.ByteBuffer.prototype.copy=function(){var e=t.createBuffer(this.data);return e.read=this.read,e},t.ByteBuffer.prototype.compact=function(){return this.read>0&&(this.data=this.data.slice(this.read),this.read=0),this},t.ByteBuffer.prototype.clear=function(){return this.data="",this.read=0,this},t.ByteBuffer.prototype.truncate=function(e){var t=Math.max(0,this.length()-e);return this.data=this.data.substr(this.read,t),this.read=0,this},t.ByteBuffer.prototype.toHex=function(){var e="";for(var t=this.read;t<this.data.length;++t){var n=this.data.charCodeAt(t);n<16&&(e+="0"),e+=n.toString(16)}return e},t.ByteBuffer.prototype.toString=function(){return t.decodeUtf8(this.bytes())},t.createBuffer=function(e,n){return n=n||"raw",e!==undefined&&n==="utf8"&&(e=t.encodeUtf8(e)),new t.ByteBuffer(e)},t.fillString=function(e,t){var n="";while(t>0)t&1&&(n+=e),t>>>=1,t>0&&(e+=e);return n},t.xorBytes=function(e,t,n){var r="",i="",s="",o=0,u=0;for(;n>0;--n,++o)i=e.charCodeAt(o)^t.charCodeAt(o),u>=10&&(r+=s,s="",u=0),s+=String.fromCharCode(i),++u;return r+=s,r},t.hexToBytes=function(e){var t="",n=0;e.length&!0&&(n=1,t+=String.fromCharCode(parseInt(e[0],16)));for(;n<e.length;n+=2)t+=String.fromCharCode(parseInt(e.substr(n,2),16));return t},t.bytesToHex=function(e){return t.createBuffer(e).toHex()},t.int32ToBytes=function(e){return String.fromCharCode(e>>24&255)+String.fromCharCode(e>>16&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(e&255)};var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",i=[62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,64,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];t.encode64=function(e,t){var n="",i="",s,o,u,a=0;while(a<e.length)s=e.charCodeAt(a++),o=e.charCodeAt(a++),u=e.charCodeAt(a++),n+=r.charAt(s>>2),n+=r.charAt((s&3)<<4|o>>4),isNaN(o)?n+="==":(n+=r.charAt((o&15)<<2|u>>6),n+=isNaN(u)?"=":r.charAt(u&63)),t&&n.length>t&&(i+=n.substr(0,t)+"\r\n",n=n.substr(t));return i+=n,i},t.decode64=function(e){e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");var t="",n,r,s,o,u=0;while(u<e.length)n=i[e.charCodeAt(u++)-43],r=i[e.charCodeAt(u++)-43],s=i[e.charCodeAt(u++)-43],o=i[e.charCodeAt(u++)-43],t+=String.fromCharCode(n<<2|r>>4),s!==64&&(t+=String.fromCharCode((r&15)<<4|s>>2),o!==64&&(t+=String.fromCharCode((s&3)<<6|o)));return t},t.encodeUtf8=function(e){return unescape(encodeURIComponent(e))},t.decodeUtf8=function(e){return decodeURIComponent(escape(e))},t.deflate=function(e,n,r){n=t.decode64(e.deflate(t.encode64(n)).rval);if(r){var i=2,s=n.charCodeAt(1);s&32&&(i=6),n=n.substring(i,n.length-4)}return n},t.inflate=function(e,n,r){var i=e.inflate(t.encode64(n)).rval;return i===null?null:t.decode64(i)};var s=function(e,n,r){if(!e)throw{message:"WebStorage not available."};var i;r===null?i=e.removeItem(n):(r=t.encode64(JSON.stringify(r)),i=e.setItem(n,r));if(typeof i!="undefined"&&i.rval!==!0)throw i.error},o=function(e,n){if(!e)throw{message:"WebStorage not available."};var r=e.getItem(n);if(e.init)if(r.rval===null){if(r.error)throw r.error;r=null}else r=r.rval;return r!==null&&(r=JSON.parse(t.decode64(r))),r},u=function(e,t,n,r){var i=o(e,t);i===null&&(i={}),i[n]=r,s(e,t,i)},a=function(e,t,n){var r=o(e,t);return r!==null&&(r=n in r?r[n]:null),r},f=function(e,t,n){var r=o(e,t);if(r!==null&&n in r){delete r[n];var i=!0;for(var u in r){i=!1;break}i&&(r=null),s(e,t,r)}},l=function(e,t){s(e,t,null)},c=function(e,t,n){var r=null;typeof n=="undefined"&&(n=["web","flash"]);var i,s=!1,o=null;for(var u in n){i=n[u];try{if(i==="flash"||i==="both"){if(t[0]===null)throw{message:"Flash local storage not available."};r=e.apply(this,t),s=i==="flash"}if(i==="web"||i==="both")t[0]=localStorage,r=e.apply(this,t),s=!0}catch(a){o=a}if(s)break}if(!s)throw o;return r};t.setItem=function(e,t,n,r,i){c(u,arguments,i)},t.getItem=function(e,t,n,r){return c(a,arguments,r)},t.removeItem=function(e,t,n,r){c(f,arguments,r)},t.clearItems=function(e,t,n){c(l,arguments,n)},t.parseUrl=function(e){var t=/^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g;t.lastIndex=0;var n=t.exec(e),r=n===null?null:{full:e,scheme:n[1],host:n[2],port:n[3],path:n[4]};return r&&(r.fullHost=r.host,r.port?r.port!==80&&r.scheme==="http"?r.fullHost+=":"+r.port:r.port!==443&&r.scheme==="https"&&(r.fullHost+=":"+r.port):r.scheme==="http"?r.port=80:r.scheme==="https"&&(r.port=443),r.full=r.scheme+"://"+r.fullHost),r};var h=null;t.getQueryVariables=function(e){var t=function(e){var t={},n=e.split("&");for(var r=0;r<n.length;r++){var i=n[r].indexOf("="),s,o;i>0?(s=n[r].substring(0,i),o=n[r].substring(i+1)):(s=n[r],o=null),s in t||(t[s]=[]),!(s in Object.prototype)&&o!==null&&t[s].push(unescape(o))}return t},n;return typeof e=="undefined"?(h===null&&(typeof window=="undefined"?h={}:h=t(window.location.search.substring(1))),n=h):n=t(e),n},t.parseFragment=function(e){var n=e,r="",i=e.indexOf("?");i>0&&(n=e.substring(0,i),r=e.substring(i+1));var s=n.split("/");s.length>0&&s[0]===""&&s.shift();var o=r===""?{}:t.getQueryVariables(r);return{pathString:n,queryString:r,path:s,query:o}},t.makeRequest=function(e){var n=t.parseFragment(e),r={path:n.pathString,query:n.queryString,getPath:function(e){return typeof e=="undefined"?n.path:n.path[e]},getQuery:function(e,t){var r;return typeof e=="undefined"?r=n.query:(r=n.query[e],r&&typeof t!="undefined"&&(r=r[t])),r},getQueryLast:function(e,t){var n,i=r.getQuery(e);return i?n=i[i.length-1]:n=t,n}};return r},t.makeLink=function(e,t,n){e=jQuery.isArray(e)?e.join("/"):e;var r=jQuery.param(t||{});return n=n||"",e+(r.length>0?"?"+r:"")+(n.length>0?"#"+n:"")},t.setPath=function(e,t,n){if(typeof e=="object"&&e!==null){var r=0,i=t.length;while(r<i){var s=t[r++];if(r==i)e[s]=n;else{var o=s in e;if(!o||o&&typeof e[s]!="object"||o&&e[s]===null)e[s]={};e=e[s]}}}},t.getPath=function(e,t,n){var r=0,i=t.length,s=!0;while(s&&r<i&&typeof e=="object"&&e!==null){var o=t[r++];s=o in e,s&&(e=e[o])}return s?e:n},t.deletePath=function(e,t){if(typeof e=="object"&&e!==null){var n=0,r=t.length;while(n<r){var i=t[n++];if(n==r)delete e[i];else{if(!(i in e&&typeof e[i]=="object"&&e[i]!==null))break;e=e[i]}}}},t.isEmpty=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},t.format=function(e){var t=/%./g,n,r,i=0,s=[],o=0;while(n=t.exec(e)){r=e.substring(o,t.lastIndex-2),r.length>0&&s.push(r),o=t.lastIndex;var u=n[0][1];switch(u){case"s":case"o":i<arguments.length?s.push(arguments[i++ +1]):s.push("<?>");break;case"%":s.push("%");break;default:s.push("<%"+u+"?>")}}return s.push(e.substring(o)),s.join("")},t.formatNumber=function(e,t,n,r){var i=e,s=isNaN(t=Math.abs(t))?2:t,o=n===undefined?",":n,u=r===undefined?".":r,a=i<0?"-":"",f=parseInt(i=Math.abs(+i||0).toFixed(s),10)+"",l=f.length>3?f.length%3:0;return a+(l?f.substr(0,l)+u:"")+f.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+u)+(s?o+Math.abs(i-f).toFixed(s).slice(2):"")},t.formatSize=function(e){return e>=1073741824?e=t.formatNumber(e/1073741824,2,".","")+" GiB":e>=1048576?e=t.formatNumber(e/1048576,2,".","")+" MiB":e>=1024?e=t.formatNumber(e/1024,0)+" KiB":e=t.formatNumber(e,0)+" bytes",e},t.bytesFromIP=function(e){return e.indexOf(".")!==-1?t.bytesFromIPv4(e):e.indexOf(":")!==-1?t.bytesFromIPv6(e):null},t.bytesFromIPv4=function(e){e=e.split(".");if(e.length!==4)return null;var n=t.createBuffer();for(var r=0;r<e.length;++r){var i=parseInt(e[r],10);if(isNaN(i))return null;n.putByte(i)}return n.getBytes()},t.bytesFromIPv6=function(e){var n=0;e=e.split(":").filter(function(e){return e.length===0&&++n,!0});var r=(8-e.length+n)*2,i=t.createBuffer();for(var s=0;s<8;++s){if(!e[s]||e[s].length===0){i.fillWithByte(0,r),r=0;continue}var o=t.hexToBytes(e[s]);o.length<2&&i.putByte(0),i.putBytes(o)}return i.getBytes()},t.bytesToIP=function(e){return e.length===4?t.bytesToIPv4(e):e.length===16?t.bytesToIPv6(e):null},t.bytesToIPv4=function(e){if(e.length!==4)return null;var t=[];for(var n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t.join(".")},t.bytesToIPv6=function(e){if(e.length!==16)return null;var n=[],r=[],i=0;for(var s=0;s<e.length;s+=2){var o=t.bytesToHex(e[s]+e[s+1]);while(o[0]==="0"&&o!=="0")o=o.substr(1);if(o==="0"){var u=r[r.length-1],a=n.length;!u||a!==u.end+1?r.push({start:a,end:a}):(u.end=a,u.end-u.start>r[i].end-r[i].start&&(i=r.length-1))}n.push(o)}if(r.length>0){var f=r[i];f.end-f.start>0&&(n.splice(f.start,f.end-f.start+1,""),f.start===0&&n.unshift(""),f.end===7&&n.push(""))}return n.join(":")}}var r="util";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/util",["require","module"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=!1,n=4,r,i,s,o,u,a=function(){t=!0,s=[0,1,2,4,8,16,32,64,128,27,54];var e=new Array(256);for(var n=0;n<128;++n)e[n]=n<<1,e[n+128]=n+128<<1^283;r=new Array(256),i=new Array(256),o=new Array(4),u=new Array(4);for(var n=0;n<4;++n)o[n]=new Array(256),u[n]=new Array(256);var a=0,f=0,l,c,h,p,d,v,m;for(var n=0;n<256;++n){p=f^f<<1^f<<2^f<<3^f<<4,p=p>>8^p&255^99,r[a]=p,i[p]=a,d=e[p],l=e[a],c=e[l],h=e[c],v=d<<24^p<<16^p<<8^(p^d),m=(l^c^h)<<24^(a^h)<<16^(a^c^h)<<8^(a^l^h);for(var g=0;g<4;++g)o[g][a]=v,u[g][p]=m,v=v<<24|v>>>8,m=m<<24|m>>>8;a===0?a=f=1:(a=l^e[e[e[l^h]]],f^=e[e[f]])}},f=function(e,t){var i=e.slice(0),o,a=1,f=i.length,l=f+6+1,c=n*l;for(var h=f;h<c;++h)o=i[h-1],h%f===0?(o=r[o>>>16&255]<<24^r[o>>>8&255]<<16^r[o&255]<<8^r[o>>>24]^s[a]<<24,a++):f>6&&h%f===4&&(o=r[o>>>24]<<24^r[o>>>16&255]<<16^r[o>>>8&255]<<8^r[o&255]),i[h]=i[h-f]^o;if(t){var p,d=u[0],v=u[1],m=u[2],g=u[3],y=i.slice(0),c=i.length;for(var h=0,b=c-n;h<c;h+=n,b-=n)if(h===0||h===c-n)y[h]=i[b],y[h+1]=i[b+3],y[h+2]=i[b+2],y[h+3]=i[b+1];else for(var w=0;w<n;++w)p=i[b+w],y[h+(3&-w)]=d[r[p>>>24]]^v[r[p>>>16&255]]^m[r[p>>>8&255]]^g[r[p&255]];i=y}return i},l=function(e,t,n,s){var a=e.length/4-1,f,l,c,h,p;s?(f=u[0],l=u[1],c=u[2],h=u[3],p=i):(f=o[0],l=o[1],c=o[2],h=o[3],p=r);var d,v,m,g,y,b,w;d=t[0]^e[0],v=t[s?3:1]^e[1],m=t[2]^e[2],g=t[s?1:3]^e[3];var E=3;for(var S=1;S<a;++S)y=f[d>>>24]^l[v>>>16&255]^c[m>>>8&255]^h[g&255]^e[++E],b=f[v>>>24]^l[m>>>16&255]^c[g>>>8&255]^h[d&255]^e[++E],w=f[m>>>24]^l[g>>>16&255]^c[d>>>8&255]^h[v&255]^e[++E],g=f[g>>>24]^l[d>>>16&255]^c[v>>>8&255]^h[m&255]^e[++E],d=y,v=b,m=w;n[0]=p[d>>>24]<<24^p[v>>>16&255]<<16^p[m>>>8&255]<<8^p[g&255]^e[++E],n[s?3:1]=p[v>>>24]<<24^p[m>>>16&255]<<16^p[g>>>8&255]<<8^p[d&255]^e[++E],n[2]=p[m>>>24]<<24^p[g>>>16&255]<<16^p[d>>>8&255]<<8^p[v&255]^e[++E],n[s?1:3]=p[g>>>24]<<24^p[d>>>16&255]<<16^p[v>>>8&255]<<8^p[m&255]^e[++E]},c=function(r,i,s,o,u){function C(){if(o)for(var e=0;e<n;++e)E[e]=b.getInt32();else for(var e=0;e<n;++e)E[e]=x[e]^b.getInt32();l(g,E,S,o);if(o){for(var e=0;e<n;++e)w.putInt32(x[e]^S[e]);x=E.slice(0)}else{for(var e=0;e<n;++e)w.putInt32(S[e]);x=S}}function k(){l(g,E,S,!1);for(var e=0;e<n;++e)E[e]=b.getInt32();for(var e=0;e<n;++e){var t=E[e]^S[e];o||(E[e]=t),w.putInt32(t)}}function L(){l(g,E,S,!1);for(var e=0;e<n;++e)E[e]=b.getInt32();for(var e=0;e<n;++e)w.putInt32(E[e]^S[e]),E[e]=S[e]}function A(){l(g,E,S,!1);for(var e=n-1;e>=0;--e){if(E[e]!==4294967295){++E[e];break}E[e]=0}for(var e=0;e<n;++e)w.putInt32(b.getInt32()^S[e])}var c=null;t||a(),u=(u||"CBC").toUpperCase();if(typeof r!="string"||r.length!==16&&r.length!==24&&r.length!==32){if(e.util.isArray(r)&&(r.length===16||r.length===24||r.length===32)){var h=r,r=e.util.createBuffer();for(var p=0;p<h.length;++p)r.putByte(h[p])}}else r=e.util.createBuffer(r);if(!e.util.isArray(r)){var h=r;r=[];var d=h.length();if(d===16||d===24||d===32){d>>>=2;for(var p=0;p<d;++p)r.push(h.getInt32())}}if(!e.util.isArray(r)||r.length!==4&&r.length!==6&&r.length!==8)return c;var v=["CFB","OFB","CTR"].indexOf(u)!==-1,m=u==="CBC",g=f(r,o&&!v),y=n<<2,b,w,E,S,x,T,N;c={output:null};if(u==="CBC")N=C;else if(u==="CFB")N=k;else if(u==="OFB")N=L;else{if(u!=="CTR")throw{message:'Unsupported block cipher mode of operation: "'+u+'"'};N=A}return c.update=function(e){T||b.putBuffer(e);while(b.length()>=y||b.length()>0&&T)N()},c.finish=function(e){var t=!0,r=b.length()%y;if(!o)if(e)t=e(y,b,o);else if(m){var i=b.length()===y?y:y-b.length();b.fillWithByte(i,i)}t&&(T=!0,c.update());if(o){m&&(t=r===0);if(t)if(e)t=e(y,w,o);else if(m){var s=w.length(),u=w.at(s-1);u>n<<2?t=!1:w.truncate(u)}}return!m&&!e&&r>0&&w.truncate(y-r),t},c.start=function(t,r){t===null&&(t=x.slice(0));if(typeof t=="string"&&t.length===16)t=e.util.createBuffer(t);else if(e.util.isArray(t)&&t.length===16){var i=t,t=e.util.createBuffer();for(var s=0;s<16;++s)t.putByte(i[s])}if(!e.util.isArray(t)){var i=t;t=new Array(4),t[0]=i.getInt32(),t[1]=i.getInt32(),t[2]=i.getInt32(),t[3]=i.getInt32()}b=e.util.createBuffer(),w=r||e.util.createBuffer(),x=t.slice(0),E=new Array(n),S=new Array(n),T=!1,c.output=w;if(["CFB","OFB","CTR"].indexOf(u)!==-1){for(var s=0;s<n;++s)E[s]=x[s];x=null}},i!==null&&c.start(i,s),c};e.aes=e.aes||{},e.aes.startEncrypting=function(e,t,n,r){return c(e,t,n,!1,r)},e.aes.createEncryptionCipher=function(e,t){return c(e,null,null,!1,t)},e.aes.startDecrypting=function(e,t,n,r){return c(e,t,n,!0,r)},e.aes.createDecryptionCipher=function(e,t){return c(e,null,null,!0,t)},e.aes._expandKey=function(e,n){return t||a(),f(e,n)},e.aes._updateBlock=l}var r="aes";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/aes",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.pki=e.pki||{};var t=e.pki.oids=e.oids=e.oids||{};t["1.2.840.113549.1.1.1"]="rsaEncryption",t.rsaEncryption="1.2.840.113549.1.1.1",t["1.2.840.113549.1.1.4"]="md5WithRSAEncryption",t.md5WithRSAEncryption="1.2.840.113549.1.1.4",t["1.2.840.113549.1.1.5"]="sha1WithRSAEncryption",t.sha1WithRSAEncryption="1.2.840.113549.1.1.5",t["1.2.840.113549.1.1.7"]="RSAES-OAEP",t["RSAES-OAEP"]="1.2.840.113549.1.1.7",t["1.2.840.113549.1.1.8"]="mgf1",t.mgf1="1.2.840.113549.1.1.8",t["1.2.840.113549.1.1.9"]="pSpecified",t.pSpecified="1.2.840.113549.1.1.9",t["1.2.840.113549.1.1.10"]="RSASSA-PSS",t["RSASSA-PSS"]="1.2.840.113549.1.1.10",t["1.2.840.113549.1.1.11"]="sha256WithRSAEncryption",t.sha256WithRSAEncryption="1.2.840.113549.1.1.11",t["1.2.840.113549.1.1.12"]="sha384WithRSAEncryption",t.sha384WithRSAEncryption="1.2.840.113549.1.1.12",t["1.2.840.113549.1.1.13"]="sha512WithRSAEncryption",t.sha512WithRSAEncryption="1.2.840.113549.1.1.13",t["1.3.14.3.2.7"]="desCBC",t.desCBC="1.3.14.3.2.7",t["1.3.14.3.2.26"]="sha1",t.sha1="1.3.14.3.2.26",t["2.16.840.1.101.3.4.2.1"]="sha256",t.sha256="2.16.840.1.101.3.4.2.1",t["2.16.840.1.101.3.4.2.2"]="sha384",t.sha384="2.16.840.1.101.3.4.2.2",t["2.16.840.1.101.3.4.2.3"]="sha512",t.sha512="2.16.840.1.101.3.4.2.3",t["1.2.840.113549.2.5"]="md5",t.md5="1.2.840.113549.2.5",t["1.2.840.113549.1.7.1"]="data",t.data="1.2.840.113549.1.7.1",t["1.2.840.113549.1.7.2"]="signedData",t.signedData="1.2.840.113549.1.7.2",t["1.2.840.113549.1.7.3"]="envelopedData",t.envelopedData="1.2.840.113549.1.7.3",t["1.2.840.113549.1.7.4"]="signedAndEnvelopedData",t.signedAndEnvelopedData="1.2.840.113549.1.7.4",t["1.2.840.113549.1.7.5"]="digestedData",t.digestedData="1.2.840.113549.1.7.5",t["1.2.840.113549.1.7.6"]="encryptedData",t.encryptedData="1.2.840.113549.1.7.6",t["1.2.840.113549.1.9.1"]="emailAddress",t.emailAddress="1.2.840.113549.1.9.1",t["1.2.840.113549.1.9.2"]="unstructuredName",t.unstructuredName="1.2.840.113549.1.9.2",t["1.2.840.113549.1.9.3"]="contentType",t.contentType="1.2.840.113549.1.9.3",t["1.2.840.113549.1.9.4"]="messageDigest",t.messageDigest="1.2.840.113549.1.9.4",t["1.2.840.113549.1.9.5"]="signingTime",t.signingTime="1.2.840.113549.1.9.5",t["1.2.840.113549.1.9.6"]="counterSignature",t.counterSignature="1.2.840.113549.1.9.6",t["1.2.840.113549.1.9.7"]="challengePassword",t.challengePassword="1.2.840.113549.1.9.7",t["1.2.840.113549.1.9.8"]="unstructuredAddress",t.unstructuredAddress="1.2.840.113549.1.9.8",t["1.2.840.113549.1.9.20"]="friendlyName",t.friendlyName="1.2.840.113549.1.9.20",t["1.2.840.113549.1.9.21"]="localKeyId",t.localKeyId="1.2.840.113549.1.9.21",t["1.2.840.113549.1.9.22.1"]="x509Certificate",t.x509Certificate="1.2.840.113549.1.9.22.1",t["1.2.840.113549.1.12.10.1.1"]="keyBag",t.keyBag="1.2.840.113549.1.12.10.1.1",t["1.2.840.113549.1.12.10.1.2"]="pkcs8ShroudedKeyBag",t.pkcs8ShroudedKeyBag="1.2.840.113549.1.12.10.1.2",t["1.2.840.113549.1.12.10.1.3"]="certBag",t.certBag="1.2.840.113549.1.12.10.1.3",t["1.2.840.113549.1.12.10.1.4"]="crlBag",t.crlBag="1.2.840.113549.1.12.10.1.4",t["1.2.840.113549.1.12.10.1.5"]="secretBag",t.secretBag="1.2.840.113549.1.12.10.1.5",t["1.2.840.113549.1.12.10.1.6"]="safeContentsBag",t.safeContentsBag="1.2.840.113549.1.12.10.1.6",t["1.2.840.113549.1.5.13"]="pkcs5PBES2",t.pkcs5PBES2="1.2.840.113549.1.5.13",t["1.2.840.113549.1.5.12"]="pkcs5PBKDF2",t.pkcs5PBKDF2="1.2.840.113549.1.5.12",t["1.2.840.113549.1.12.1.1"]="pbeWithSHAAnd128BitRC4",t.pbeWithSHAAnd128BitRC4="1.2.840.113549.1.12.1.1",t["1.2.840.113549.1.12.1.2"]="pbeWithSHAAnd40BitRC4",t.pbeWithSHAAnd40BitRC4="1.2.840.113549.1.12.1.2",t["1.2.840.113549.1.12.1.3"]="pbeWithSHAAnd3-KeyTripleDES-CBC",t["pbeWithSHAAnd3-KeyTripleDES-CBC"]="1.2.840.113549.1.12.1.3",t["1.2.840.113549.1.12.1.4"]="pbeWithSHAAnd2-KeyTripleDES-CBC",t["pbeWithSHAAnd2-KeyTripleDES-CBC"]="1.2.840.113549.1.12.1.4",t["1.2.840.113549.1.12.1.5"]="pbeWithSHAAnd128BitRC2-CBC",t["pbeWithSHAAnd128BitRC2-CBC"]="1.2.840.113549.1.12.1.5",t["1.2.840.113549.1.12.1.6"]="pbewithSHAAnd40BitRC2-CBC",t["pbewithSHAAnd40BitRC2-CBC"]="1.2.840.113549.1.12.1.6",t["1.2.840.113549.3.7"]="des-EDE3-CBC",t["des-EDE3-CBC"]="1.2.840.113549.3.7",t["2.16.840.1.101.3.4.1.2"]="aes128-CBC",t["aes128-CBC"]="2.16.840.1.101.3.4.1.2",t["2.16.840.1.101.3.4.1.22"]="aes192-CBC",t["aes192-CBC"]="2.16.840.1.101.3.4.1.22",t["2.16.840.1.101.3.4.1.42"]="aes256-CBC",t["aes256-CBC"]="2.16.840.1.101.3.4.1.42",t["2.5.4.3"]="commonName",t.commonName="2.5.4.3",t["2.5.4.5"]="serialName",t.serialName="2.5.4.5",t["2.5.4.6"]="countryName",t.countryName="2.5.4.6",t["2.5.4.7"]="localityName",t.localityName="2.5.4.7",t["2.5.4.8"]="stateOrProvinceName",t.stateOrProvinceName="2.5.4.8",t["2.5.4.10"]="organizationName",t.organizationName="2.5.4.10",t["2.5.4.11"]="organizationalUnitName",t.organizationalUnitName="2.5.4.11",t["2.16.840.1.113730.1.1"]="nsCertType",t.nsCertType="2.16.840.1.113730.1.1",t["2.5.29.1"]="authorityKeyIdentifier",t["2.5.29.2"]="keyAttributes",t["2.5.29.3"]="certificatePolicies",t["2.5.29.4"]="keyUsageRestriction",t["2.5.29.5"]="policyMapping",t["2.5.29.6"]="subtreesConstraint",t["2.5.29.7"]="subjectAltName",t["2.5.29.8"]="issuerAltName",t["2.5.29.9"]="subjectDirectoryAttributes",t["2.5.29.10"]="basicConstraints",t["2.5.29.11"]="nameConstraints",t["2.5.29.12"]="policyConstraints",t["2.5.29.13"]="basicConstraints",t["2.5.29.14"]="subjectKeyIdentifier",t.subjectKeyIdentifier="2.5.29.14",t["2.5.29.15"]="keyUsage",t.keyUsage="2.5.29.15",t["2.5.29.16"]="privateKeyUsagePeriod",t["2.5.29.17"]="subjectAltName",t.subjectAltName="2.5.29.17",t["2.5.29.18"]="issuerAltName",t.issuerAltName="2.5.29.18",t["2.5.29.19"]="basicConstraints",t.basicConstraints="2.5.29.19",t["2.5.29.20"]="cRLNumber",t["2.5.29.21"]="cRLReason",t["2.5.29.22"]="expirationDate",t["2.5.29.23"]="instructionCode",t["2.5.29.24"]="invalidityDate",t["2.5.29.25"]="cRLDistributionPoints",t["2.5.29.26"]="issuingDistributionPoint",t["2.5.29.27"]="deltaCRLIndicator",t["2.5.29.28"]="issuingDistributionPoint",t["2.5.29.29"]="certificateIssuer",t["2.5.29.30"]="nameConstraints",t["2.5.29.31"]="cRLDistributionPoints",t["2.5.29.32"]="certificatePolicies",t["2.5.29.33"]="policyMappings",t["2.5.29.34"]="policyConstraints",t["2.5.29.35"]="authorityKeyIdentifier",t["2.5.29.36"]="policyConstraints",t["2.5.29.37"]="extKeyUsage",t.extKeyUsage="2.5.29.37",t["2.5.29.46"]="freshestCRL",t["2.5.29.54"]="inhibitAnyPolicy",t["1.3.6.1.5.5.7.3.1"]="serverAuth",t.serverAuth="1.3.6.1.5.5.7.3.1",t["1.3.6.1.5.5.7.3.2"]="clientAuth",t.clientAuth="1.3.6.1.5.5.7.3.2",t["1.3.6.1.5.5.7.3.3"]="codeSigning",t.codeSigning="1.3.6.1.5.5.7.3.3",t["1.3.6.1.5.5.7.3.4"]="emailProtection",t.emailProtection="1.3.6.1.5.5.7.3.4",t["1.3.6.1.5.5.7.3.8"]="timeStamping",t.timeStamping="1.3.6.1.5.5.7.3.8"}var r="oids";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/oids",["require","module"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.asn1=e.asn1||{};t.Class={UNIVERSAL:0,APPLICATION:64,CONTEXT_SPECIFIC:128,PRIVATE:192},t.Type={NONE:0,BOOLEAN:1,INTEGER:2,BITSTRING:3,OCTETSTRING:4,NULL:5,OID:6,ODESC:7,EXTERNAL:8,REAL:9,ENUMERATED:10,EMBEDDED:11,UTF8:12,ROID:13,SEQUENCE:16,SET:17,PRINTABLESTRING:19,IA5STRING:22,UTCTIME:23,GENERALIZEDTIME:24,BMPSTRING:30},t.create=function(t,n,r,i){if(e.util.isArray(i)){var s=[];for(var o=0;o<i.length;++o)i[o]!==undefined&&s.push(i[o]);i=s}return{tagClass:t,type:n,constructed:r,composed:r||e.util.isArray(i),value:i}};var n=function(e){var t=e.getByte();if(t===128)return undefined;var n,r=t&128;return r?n=e.getInt((t&127)<<3):n=t,n};t.fromDer=function(r,i){i===undefined&&(i=!0),typeof r=="string"&&(r=e.util.createBuffer(r));if(r.length()<2)throw{message:"Too few bytes to parse DER.",bytes:r.length()};var s=r.getByte(),o=s&192,u=s&31,a=n(r);if(r.length()<a){if(i)throw{message:"Too few bytes to read ASN.1 value.",detail:r.length()+" < "+a};a=r.length()}var f,l=(s&32)===32,c=l;if(!c&&o===t.Class.UNIVERSAL&&u===t.Type.BITSTRING&&a>1){var h=r.read,p=r.getByte();if(p===0){s=r.getByte();var d=s&192;if(d===t.Class.UNIVERSAL||d===t.Class.CONTEXT_SPECIFIC)try{var v=n(r);c=v===a-(r.read-h),c&&(++h,--a)}catch(m){}}r.read=h}if(c){f=[];if(a===undefined)for(;;){if(r.bytes(2)===String.fromCharCode(0,0)){r.getBytes(2);break}f.push(t.fromDer(r,i))}else{var g=r.length();while(a>0)f.push(t.fromDer(r,i)),a-=g-r.length(),g=r.length()}}else{if(a===undefined){if(i)throw{message:"Non-constructed ASN.1 object of indefinite length."};a=r.length()}if(u===t.Type.BMPSTRING){f="";for(var y=0;y<a;y+=2)f+=String.fromCharCode(r.getInt16())}else f=r.getBytes(a)}return t.create(o,u,l,f)},t.toDer=function(n){var r=e.util.createBuffer(),i=n.tagClass|n.type,s=e.util.createBuffer();if(n.composed){n.constructed?i|=32:s.putByte(0);for(var o=0;o<n.value.length;++o)n.value[o]!==undefined&&s.putBuffer(t.toDer(n.value[o]))}else if(n.type===t.Type.BMPSTRING)for(var o=0;o<n.value.length;++o)s.putInt16(n.value.charCodeAt(o));else s.putBytes(n.value);r.putByte(i);if(s.length()<=127)r.putByte(s.length()&127);else{var u=s.length(),a="";do a+=String.fromCharCode(u&255),u>>>=8;while(u>0);r.putByte(a.length|128);for(var o=a.length-1;o>=0;--o)r.putByte(a.charCodeAt(o))}return r.putBuffer(s),r},t.oidToDer=function(t){var n=t.split("."),r=e.util.createBuffer();r.putByte(40*parseInt(n[0],10)+parseInt(n[1],10));var i,s,o,u;for(var a=2;a<n.length;++a){i=!0,s=[],o=parseInt(n[a],10);do u=o&127,o>>>=7,i||(u|=128),s.push(u),i=!1;while(o>0);for(var f=s.length-1;f>=0;--f)r.putByte(s[f])}return r},t.derToOid=function(t){var n;typeof t=="string"&&(t=e.util.createBuffer(t));var r=t.getByte();n=Math.floor(r/40)+"."+r%40;var i=0;while(t.length()>0)r=t.getByte(),i<<=7,r&128?i+=r&127:(n+="."+(i+r),i=0);return n},t.utcTimeToDate=function(e){var t=new Date,n=parseInt(e.substr(0,2),10);n=n>=50?1900+n:2e3+n;var r=parseInt(e.substr(2,2),10)-1,i=parseInt(e.substr(4,2),10),s=parseInt(e.substr(6,2),10),o=parseInt(e.substr(8,2),10),u=0;if(e.length>11){var a=e.charAt(10),f=10;a!=="+"&&a!=="-"&&(u=parseInt(e.substr(10,2),10),f+=2)}t.setUTCFullYear(n,r,i),t.setUTCHours(s,o,u,0);if(f){a=e.charAt(f);if(a==="+"||a==="-"){var l=parseInt(e.substr(f+1,2),10),c=parseInt(e.substr(f+4,2),10),h=l*60+c;h*=6e4,a==="+"?t.setTime(+t-h):t.setTime(+t+h)}}return t},t.generalizedTimeToDate=function(e){var t=new Date,n=parseInt(e.substr(0,4),10),r=parseInt(e.substr(4,2),10)-1,i=parseInt(e.substr(6,2),10),s=parseInt(e.substr(8,2),10),o=parseInt(e.substr(10,2),10),u=parseInt(e.substr(12,2),10),a=0,f=0,l=!1;e.charAt(e.length-1)==="Z"&&(l=!0);var c=e.length-5,h=e.charAt(c);if(h==="+"||h==="-"){var p=parseInt(e.substr(c+1,2),10),d=parseInt(e.substr(c+4,2),10);f=p*60+d,f*=6e4,h==="+"&&(f*=-1),l=!0}return e.charAt(14)==="."&&(a=parseFloat(e.substr(14),10)*1e3),l?(t.setUTCFullYear(n,r,i),t.setUTCHours(s,o,u,a),t.setTime(+t+f)):(t.setFullYear(n,r,i),t.setHours(s,o,u,a)),t},t.dateToUtcTime=function(e){var t="",n=[];n.push((""+e.getUTCFullYear()).substr(2)),n.push(""+(e.getUTCMonth()+1)),n.push(""+e.getUTCDate()),n.push(""+e.getUTCHours()),n.push(""+e.getUTCMinutes()),n.push(""+e.getUTCSeconds());for(var r=0;r<n.length;++r)n[r].length<2&&(t+="0"),t+=n[r];return t+="Z",t},t.integerToDer=function(t){var n=e.util.createBuffer();if(t>=-128&&t<128)return n.putSignedInt(t,8);if(t>=-32768&&t<32768)return n.putSignedInt(t,16);if(t>=-8388608&&t<8388608)return n.putSignedInt(t,24);if(t>=-2147483648&&t<2147483648)return n.putSignedInt(t,32);throw{message:"Integer too large; max is 32-bits.",integer:t}},t.derToInteger=function(t){typeof t=="string"&&(t=e.util.createBuffer(t));var n=t.length()*8;if(n>32)throw{message:"Integer too large; max is 32-bits."};return t.getSignedInt(n)},t.validate=function(n,r,i,s){var o=!1;if(n.tagClass!==r.tagClass&&typeof r.tagClass!="undefined"||n.type!==r.type&&typeof r.type!="undefined")s&&(n.tagClass!==r.tagClass&&s.push("["+r.name+"] "+'Expected tag class "'+r.tagClass+'", got "'+n.tagClass+'"'),n.type!==r.type&&s.push("["+r.name+"] "+'Expected type "'+r.type+'", got "'+n.type+'"'));else if(n.constructed===r.constructed||typeof r.constructed=="undefined"){o=!0;if(r.value&&e.util.isArray(r.value)){var u=0;for(var a=0;o&&a<r.value.length;++a)o=r.value[a].optional||!1,n.value[u]&&(o=t.validate(n.value[u],r.value[a],i,s),o?++u:r.value[a].optional&&(o=!0)),!o&&s&&s.push("["+r.name+"] "+'Tag class "'+r.tagClass+'", type "'+r.type+'" expected value length "'+r.value.length+'", got "'+n.value.length+'"')}o&&i&&(r.capture&&(i[r.capture]=n.value),r.captureAsn1&&(i[r.captureAsn1]=n))}else s&&s.push("["+r.name+"] "+'Expected constructed "'+r.constructed+'", got "'+n.constructed+'"');return o};var r=/[^\\u0000-\\u00ff]/;t.prettyPrint=function(n,i,s){var o="";i=i||0,s=s||2,i>0&&(o+="\n");var u="";for(var a=0;a<i*s;++a)u+=" ";o+=u+"Tag: ";switch(n.tagClass){case t.Class.UNIVERSAL:o+="Universal:";break;case t.Class.APPLICATION:o+="Application:";break;case t.Class.CONTEXT_SPECIFIC:o+="Context-Specific:";break;case t.Class.PRIVATE:o+="Private:"}if(n.tagClass===t.Class.UNIVERSAL){o+=n.type;switch(n.type){case t.Type.NONE:o+=" (None)";break;case t.Type.BOOLEAN:o+=" (Boolean)";break;case t.Type.BITSTRING:o+=" (Bit string)";break;case t.Type.INTEGER:o+=" (Integer)";break;case t.Type.OCTETSTRING:o+=" (Octet string)";break;case t.Type.NULL:o+=" (Null)";break;case t.Type.OID:o+=" (Object Identifier)";break;case t.Type.ODESC:o+=" (Object Descriptor)";break;case t.Type.EXTERNAL:o+=" (External or Instance of)";break;case t.Type.REAL:o+=" (Real)";break;case t.Type.ENUMERATED:o+=" (Enumerated)";break;case t.Type.EMBEDDED:o+=" (Embedded PDV)";break;case t.Type.UTF8:o+=" (UTF8)";break;case t.Type.ROID:o+=" (Relative Object Identifier)";break;case t.Type.SEQUENCE:o+=" (Sequence)";break;case t.Type.SET:o+=" (Set)";break;case t.Type.PRINTABLESTRING:o+=" (Printable String)";break;case t.Type.IA5String:o+=" (IA5String (ASCII))";break;case t.Type.UTCTIME:o+=" (UTC time)";break;case t.Type.GENERALIZEDTIME:o+=" (Generalized time)";break;case t.Type.BMPSTRING:o+=" (BMP String)"}}else o+=n.type;o+="\n",o+=u+"Constructed: "+n.constructed+"\n";if(n.composed){var f=0,l="";for(var a=0;a<n.value.length;++a)n.value[a]!==undefined&&(f+=1,l+=t.prettyPrint(n.value[a],i+1,s),a+1<n.value.length&&(l+=","));o+=u+"Sub values: "+f+l}else{o+=u+"Value: ";if(n.type===t.Type.OID){var c=t.derToOid(n.value);o+=c,e.pki&&e.pki.oids&&c in e.pki.oids&&(o+=" ("+e.pki.oids[c]+")")}if(n.type===t.Type.INTEGER)try{o+=t.derToInteger(n.value)}catch(h){o+="0x"+e.util.bytesToHex(n.value)}else r.test(n.value)?o+="0x"+e.util.createBuffer(n.value,"utf8").toHex():n.value.length===0?o+="[null]":o+=n.value}return o}}var r="asn1";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/asn1",["require","module","./util","./oids"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.md5=e.md5||{};e.md=e.md||{},e.md.algorithms=e.md.algorithms||{},e.md.md5=e.md.algorithms.md5=t;var n=null,r=null,i=null,s=null,o=!1,u=function(){n=String.fromCharCode(128),n+=e.util.fillString(String.fromCharCode(0),64),r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1,6,11,0,5,10,15,4,9,14,3,8,13,2,7,12,5,8,11,14,1,4,7,10,13,0,3,6,9,12,15,2,0,7,14,5,12,3,10,1,8,15,6,13,4,11,2,9],i=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21],s=new Array(64);for(var t=0;t<64;++t)s[t]=Math.floor(Math.abs(Math.sin(t+1))*4294967296);o=!0},a=function(e,t,n){var o,u,a,f,l,c,h,p,d=n.length();while(d>=64){u=e.h0,a=e.h1,f=e.h2,l=e.h3;for(p=0;p<16;++p)t[p]=n.getInt32Le(),c=l^a&(f^l),o=u+c+s[p]+t[p],h=i[p],u=l,l=f,f=a,a+=o<<h|o>>>32-h;for(;p<32;++p)c=f^l&(a^f),o=u+c+s[p]+t[r[p]],h=i[p],u=l,l=f,f=a,a+=o<<h|o>>>32-h;for(;p<48;++p)c=a^f^l,o=u+c+s[p]+t[r[p]],h=i[p],u=l,l=f,f=a,a+=o<<h|o>>>32-h;for(;p<64;++p)c=f^(a|~l),o=u+c+s[p]+t[r[p]],h=i[p],u=l,l=f,f=a,a+=o<<h|o>>>32-h;e.h0=e.h0+u&4294967295,e.h1=e.h1+a&4294967295,e.h2=e.h2+f&4294967295,e.h3=e.h3+l&4294967295,d-=64}};t.create=function(){o||u();var t=null,r=e.util.createBuffer(),i=new Array(16),s={algorithm:"md5",blockLength:64,digestLength:16,messageLength:0};return s.start=function(){return s.messageLength=0,r=e.util.createBuffer(),t={h0:1732584193,h1:4023233417,h2:2562383102,h3:271733878},s},s.start(),s.update=function(n,o){return o==="utf8"&&(n=e.util.encodeUtf8(n)),s.messageLength+=n.length,r.putBytes(n),a(t,i,r),(r.read>2048||r.length()===0)&&r.compact(),s},s.digest=function(){var o=s.messageLength,u=e.util.createBuffer();u.putBytes(r.bytes()),u.putBytes(n.substr(0,64-(o+8)%64)),u.putInt32Le(o<<3&4294967295),u.putInt32Le(o>>>29&255);var f={h0:t.h0,h1:t.h1,h2:t.h2,h3:t.h3};a(f,i,u);var l=e.util.createBuffer();return l.putInt32Le(f.h0),l.putInt32Le(f.h1),l.putInt32Le(f.h2),l.putInt32Le(f.h3),l},s}}var r="md5";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/md5",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.sha1=e.sha1||{};e.md=e.md||{},e.md.algorithms=e.md.algorithms||{},e.md.sha1=e.md.algorithms.sha1=t;var n=null,r=!1,i=function(){n=String.fromCharCode(128),n+=e.util.fillString(String.fromCharCode(0),64),r=!0},s=function(e,t,n){var r,i,s,o,u,a,f,l,c=n.length();while(c>=64){i=e.h0,s=e.h1,o=e.h2,u=e.h3,a=e.h4;for(l=0;l<16;++l)r=n.getInt32(),t[l]=r,f=u^s&(o^u),r=(i<<5|i>>>27)+f+a+1518500249+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;for(;l<20;++l)r=t[l-3]^t[l-8]^t[l-14]^t[l-16],r=r<<1|r>>>31,t[l]=r,f=u^s&(o^u),r=(i<<5|i>>>27)+f+a+1518500249+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;for(;l<32;++l)r=t[l-3]^t[l-8]^t[l-14]^t[l-16],r=r<<1|r>>>31,t[l]=r,f=s^o^u,r=(i<<5|i>>>27)+f+a+1859775393+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;for(;l<40;++l)r=t[l-6]^t[l-16]^t[l-28]^t[l-32],r=r<<2|r>>>30,t[l]=r,f=s^o^u,r=(i<<5|i>>>27)+f+a+1859775393+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;for(;l<60;++l)r=t[l-6]^t[l-16]^t[l-28]^t[l-32],r=r<<2|r>>>30,t[l]=r,f=s&o|u&(s^o),r=(i<<5|i>>>27)+f+a+2400959708+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;for(;l<80;++l)r=t[l-6]^t[l-16]^t[l-28]^t[l-32],r=r<<2|r>>>30,t[l]=r,f=s^o^u,r=(i<<5|i>>>27)+f+a+3395469782+r,a=u,u=o,o=s<<30|s>>>2,s=i,i=r;e.h0+=i,e.h1+=s,e.h2+=o,e.h3+=u,e.h4+=a,c-=64}};t.create=function(){r||i();var t=null,o=e.util.createBuffer(),u=new Array(80),a={algorithm:"sha1",blockLength:64,digestLength:20,messageLength:0};return a.start=function(){return a.messageLength=0,o=e.util.createBuffer(),t={h0:1732584193,h1:4023233417,h2:2562383102,h3:271733878,h4:3285377520},a},a.start(),a.update=function(n,r){return r==="utf8"&&(n=e.util.encodeUtf8(n)),a.messageLength+=n.length,o.putBytes(n),s(t,u,o),(o.read>2048||o.length()===0)&&o.compact(),a},a.digest=function(){var r=a.messageLength,i=e.util.createBuffer();i.putBytes(o.bytes()),i.putBytes(n.substr(0,64-(r+8)%64)),i.putInt32(r>>>29&255),i.putInt32(r<<3&4294967295);var f={h0:t.h0,h1:t.h1,h2:t.h2,h3:t.h3,h4:t.h4};s(f,u,i);var l=e.util.createBuffer();return l.putInt32(f.h0),l.putInt32(f.h1),l.putInt32(f.h2),l.putInt32(f.h3),l.putInt32(f.h4),l},a}}var r="sha1";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/sha1",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.sha256=e.sha256||{};e.md=e.md||{},e.md.algorithms=e.md.algorithms||{},e.md.sha256=e.md.algorithms.sha256=t;var n=null,r=!1,i=null,s=function(){n=String.fromCharCode(128),n+=e.util.fillString(String.fromCharCode(0),64),i=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],r=!0},o=function(e,t,n){var r,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b=n.length();while(b>=64){for(l=0;l<16;++l)t[l]=n.getInt32();for(;l<64;++l)r=t[l-2],r=(r>>>17|r<<15)^(r>>>19|r<<13)^r>>>10,s=t[l-15],s=(s>>>7|s<<25)^(s>>>18|s<<14)^s>>>3,t[l]=r+t[l-7]+s+t[l-16]&4294967295;c=e.h0,h=e.h1,p=e.h2,d=e.h3,v=e.h4,m=e.h5,g=e.h6,y=e.h7;for(l=0;l<64;++l)u=(v>>>6|v<<26)^(v>>>11|v<<21)^(v>>>25|v<<7),a=g^v&(m^g),o=(c>>>2|c<<30)^(c>>>13|c<<19)^(c>>>22|c<<10),f=c&h|p&(c^h),r=y+u+a+i[l]+t[l],s=o+f,y=g,g=m,m=v,v=d+r&4294967295,d=p,p=h,h=c,c=r+s&4294967295;e.h0=e.h0+c&4294967295,e.h1=e.h1+h&4294967295,e.h2=e.h2+p&4294967295,e.h3=e.h3+d&4294967295,e.h4=e.h4+v&4294967295,e.h5=e.h5+m&4294967295,e.h6=e.h6+g&4294967295,e.h7=e.h7+y&4294967295,b-=64}};t.create=function(){r||s();var t=null,i=e.util.createBuffer(),u=new Array(64),a={algorithm:"sha256",blockLength:64,digestLength:32,messageLength:0};return a.start=function(){return a.messageLength=0,i=e.util.createBuffer(),t={h0:1779033703,h1:3144134277,h2:1013904242,h3:2773480762,h4:1359893119,h5:2600822924,h6:528734635,h7:1541459225},a},a.start(),a.update=function(n,r){return r==="utf8"&&(n=e.util.encodeUtf8(n)),a.messageLength+=n.length,i.putBytes(n),o(t,u,i),(i.read>2048||i.length()===0)&&i.compact(),a},a.digest=function(){var r=a.messageLength,s=e.util.createBuffer();s.putBytes(i.bytes()),s.putBytes(n.substr(0,64-(r+8)%64)),s.putInt32(r>>>29&255),s.putInt32(r<<3&4294967295);var f={h0:t.h0,h1:t.h1,h2:t.h2,h3:t.h3,h4:t.h4,h5:t.h5,h6:t.h6,h7:t.h7};o(f,u,s);var l=e.util.createBuffer();return l.putInt32(f.h0),l.putInt32(f.h1),l.putInt32(f.h2),l.putInt32(f.h3),l.putInt32(f.h4),l.putInt32(f.h5),l.putInt32(f.h6),l.putInt32(f.h7),l},a}}var r="sha256";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/sha256",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.md=e.md||{},e.md.algorithms={md5:e.md5,sha1:e.sha1,sha256:e.sha256},e.md.md5=e.md5,e.md.sha1=e.sha1,e.md.sha256=e.sha256}var r="md";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/md",["require","module","./md5","./sha1","./sha256"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.hmac=e.hmac||{};t.create=function(){var t=null,n=null,r=null,i=null,s={};return s.start=function(s,o){if(s!==null)if(typeof s=="string"){s=s.toLowerCase();if(!(s in e.md.algorithms))throw'Unknown hash algorithm "'+s+'"';n=e.md.algorithms[s].create()}else n=s;if(o===null)o=t;else{if(typeof o=="string")o=e.util.createBuffer(o);else if(e.util.isArray(o)){var u=o;o=e.util.createBuffer();for(var a=0;a<u.length;++a)o.putByte(u[a])}var f=o.length();f>n.blockLength&&(n.start(),n.update(o.bytes()),o=n.digest()),r=e.util.createBuffer(),i=e.util.createBuffer(),f=o.length();for(var a=0;a<f;++a){var u=o.at(a);r.putByte(54^u),i.putByte(92^u)}if(f<n.blockLength){var u=n.blockLength-f;for(var a=0;a<u;++a)r.putByte(54),i.putByte(92)}t=o,r=r.bytes(),i=i.bytes()}n.start(),n.update(r)},s.update=function(e){n.update(e)},s.getMac=function(){var e=n.digest().bytes();return n.start(),n.update(i),n.update(e),n.digest()},s.digest=s.getMac,s}}var r="hmac";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/hmac",["require","module","./md","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function n(e){var t=e.name+": ",n=[];for(var r=0;r<e.values.length;++r)n.push(e.values[r].replace(/^(\S+\r\n)/,function(e,t){return" "+t}));t+=n.join(",")+"\r\n";var i=0,s=-1;for(var r=0;r<t.length;++r,++i)if(i>65&&s!==-1){var o=t[s];o===","?(++s,t=t.substr(0,s)+"\r\n "+t.substr(s)):t=t.substr(0,s)+"\r\n"+o+t.substr(s+1),i=r-s-1,s=-1,++r}else if(t[r]===" "||t[r]==="	"||t[r]===",")s=r;return t}function r(e){return e.replace(/^\s+/,"")}var t=e.pem=e.pem||{};t.encode=function(t,r){r=r||{};var i="-----BEGIN "+t.type+"-----\r\n",s;t.procType&&(s={name:"Proc-Type",values:[String(t.procType.version),t.procType.type]},i+=n(s)),t.contentDomain&&(s={name:"Content-Domain",values:[t.contentDomain]},i+=n(s)),t.dekInfo&&(s={name:"DEK-Info",values:[t.dekInfo.algorithm]},t.dekInfo.parameters&&s.values.push(t.dekInfo.parameters),i+=n(s));if(t.headers)for(var o=0;o<t.headers.length;++o)i+=n(t.headers[o]);return t.procType&&(i+="\r\n"),i+=e.util.encode64(t.body,r.maxline||64)+"\r\n",i+="-----END "+t.type+"-----\r\n",i},t.decode=function(t){var n=[],i=/\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g,s=/([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/,o=/\r?\n/,u;for(;;){u=i.exec(t);if(!u)break;var a={type:u[1],procType:null,contentDomain:null,dekInfo:null,headers:[],body:e.util.decode64(u[3])};n.push(a);if(!u[2])continue;var f=u[2].split(o),l=0;while(u&&l<f.length){var c=f[l].replace(/\s+$/,"");for(var h=l+1;h<f.length;++h){var p=f[h];if(!/\s/.test(p[0]))break;c+=p,l=h}u=c.match(s);if(u){var d={name:u[1],values:[]},v=u[2].split(",");for(var m=0;m<v.length;++m)d.values.push(r(v[m]));if(!a.procType){if(d.name!=="Proc-Type")throw{message:'Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".'};if(d.values.length!==2)throw{message:'Invalid PEM formatted message. The "Proc-Type" header must have two subfields.'};a.procType={version:v[0],type:v[1]}}else if(!a.contentDomain&&d.name==="Content-Domain")a.contentDomain=v[0]||"";else if(!a.dekInfo&&d.name==="DEK-Info"){if(d.values.length===0)throw{message:'Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.'};a.dekInfo={algorithm:v[0],parameters:v[1]||null}}else a.headers.push(d)}++l}if(a.procType==="ENCRYPTED"&&!a.dekInfo)throw{message:'Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".'}}if(n.length===0)throw{message:"Invalid PEM formatted message."};return n}}var r="pem";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pem",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function f(e){var t=[0,4,536870912,536870916,65536,65540,536936448,536936452,512,516,536871424,536871428,66048,66052,536936960,536936964],n=[0,1,1048576,1048577,67108864,67108865,68157440,68157441,256,257,1048832,1048833,67109120,67109121,68157696,68157697],r=[0,8,2048,2056,16777216,16777224,16779264,16779272,0,8,2048,2056,16777216,16777224,16779264,16779272],i=[0,2097152,134217728,136314880,8192,2105344,134225920,136323072,131072,2228224,134348800,136445952,139264,2236416,134356992,136454144],s=[0,262144,16,262160,0,262144,16,262160,4096,266240,4112,266256,4096,266240,4112,266256],o=[0,1024,32,1056,0,1024,32,1056,33554432,33555456,33554464,33555488,33554432,33555456,33554464,33555488],u=[0,268435456,524288,268959744,2,268435458,524290,268959746,0,268435456,524288,268959744,2,268435458,524290,268959746],a=[0,65536,2048,67584,536870912,536936448,536872960,536938496,131072,196608,133120,198656,537001984,537067520,537004032,537069568],f=[0,262144,0,262144,2,262146,2,262146,33554432,33816576,33554432,33816576,33554434,33816578,33554434,33816578],l=[0,268435456,8,268435464,0,268435456,8,268435464,1024,268436480,1032,268436488,1024,268436480,1032,268436488],c=[0,32,0,32,1048576,1048608,1048576,1048608,8192,8224,8192,8224,1056768,1056800,1056768,1056800],h=[0,16777216,512,16777728,2097152,18874368,2097664,18874880,67108864,83886080,67109376,83886592,69206016,85983232,69206528,85983744],p=[0,4096,134217728,134221824,524288,528384,134742016,134746112,16,4112,134217744,134221840,524304,528400,134742032,134746128],d=[0,4,256,260,0,4,256,260,1,5,257,261,1,5,257,261],v=e.length()>8?3:1,m=[],g=[0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],y=0,b;for(var w=0;w<v;w++){var E=e.getInt32(),S=e.getInt32();b=(E>>>4^S)&252645135,S^=b,E^=b<<4,b=(S>>>-16^E)&65535,E^=b,S^=b<<-16,b=(E>>>2^S)&858993459,S^=b,E^=b<<2,b=(S>>>-16^E)&65535,E^=b,S^=b<<-16,b=(E>>>1^S)&1431655765,S^=b,E^=b<<1,b=(S>>>8^E)&16711935,E^=b,S^=b<<8,b=(E>>>1^S)&1431655765,S^=b,E^=b<<1,b=E<<8|S>>>20&240,E=S<<24|S<<8&16711680|S>>>8&65280|S>>>24&240,S=b;for(var x=0;x<g.length;x++){g[x]?(E=E<<2|E>>>26,S=S<<2|S>>>26):(E=E<<1|E>>>27,S=S<<1|S>>>27),E&=-15,S&=-15;var T=t[E>>>28]|n[E>>>24&15]|r[E>>>20&15]|i[E>>>16&15]|s[E>>>12&15]|o[E>>>8&15]|u[E>>>4&15],N=a[S>>>28]|f[S>>>24&15]|l[S>>>20&15]|c[S>>>16&15]|h[S>>>12&15]|p[S>>>8&15]|d[S>>>4&15];b=(N>>>16^T)&65535,m[y++]=T^b,m[y++]=N^b<<16}}return m}var t=[16843776,0,65536,16843780,16842756,66564,4,65536,1024,16843776,16843780,1024,16778244,16842756,16777216,4,1028,16778240,16778240,66560,66560,16842752,16842752,16778244,65540,16777220,16777220,65540,0,1028,66564,16777216,65536,16843780,4,16842752,16843776,16777216,16777216,1024,16842756,65536,66560,16777220,1024,4,16778244,66564,16843780,65540,16842752,16778244,16777220,1028,66564,16843776,1028,16778240,16778240,0,65540,66560,0,16842756],n=[-2146402272,-2147450880,32768,1081376,1048576,32,-2146435040,-2147450848,-2147483616,-2146402272,-2146402304,-2147483648,-2147450880,1048576,32,-2146435040,1081344,1048608,-2147450848,0,-2147483648,32768,1081376,-2146435072,1048608,-2147483616,0,1081344,32800,-2146402304,-2146435072,32800,0,1081376,-2146435040,1048576,-2147450848,-2146435072,-2146402304,32768,-2146435072,-2147450880,32,-2146402272,1081376,32,32768,-2147483648,32800,-2146402304,1048576,-2147483616,1048608,-2147450848,-2147483616,1048608,1081344,0,-2147450880,32800,-2147483648,-2146435040,-2146402272,1081344],r=[520,134349312,0,134348808,134218240,0,131592,134218240,131080,134217736,134217736,131072,134349320,131080,134348800,520,134217728,8,134349312,512,131584,134348800,134348808,131592,134218248,131584,131072,134218248,8,134349320,512,134217728,134349312,134217728,131080,520,131072,134349312,134218240,0,512,131080,134349320,134218240,134217736,512,0,134348808,134218248,131072,134217728,134349320,8,131592,131584,134217736,134348800,134218248,520,134348800,131592,8,134348808,131584],i=[8396801,8321,8321,128,8396928,8388737,8388609,8193,0,8396800,8396800,8396929,129,0,8388736,8388609,1,8192,8388608,8396801,128,8388608,8193,8320,8388737,1,8320,8388736,8192,8396928,8396929,129,8388736,8388609,8396800,8396929,129,0,0,8396800,8320,8388736,8388737,1,8396801,8321,8321,128,8396929,129,1,8192,8388609,8193,8396928,8388737,8193,8320,8388608,8396801,128,8388608,8192,8396928],s=[256,34078976,34078720,1107296512,524288,256,1073741824,34078720,1074266368,524288,33554688,1074266368,1107296512,1107820544,524544,1073741824,33554432,1074266112,1074266112,0,1073742080,1107820800,1107820800,33554688,1107820544,1073742080,0,1107296256,34078976,33554432,1107296256,524544,524288,1107296512,256,33554432,1073741824,34078720,1107296512,1074266368,33554688,1073741824,1107820544,34078976,1074266368,256,33554432,1107820544,1107820800,524544,1107296256,1107820800,34078720,0,1074266112,1107296256,524544,33554688,1073742080,524288,0,1074266112,34078976,1073742080],o=[536870928,541065216,16384,541081616,541065216,16,541081616,4194304,536887296,4210704,4194304,536870928,4194320,536887296,536870912,16400,0,4194320,536887312,16384,4210688,536887312,16,541065232,541065232,0,4210704,541081600,16400,4210688,541081600,536870912,536887296,16,541065232,4210688,541081616,4194304,16400,536870928,4194304,536887296,536870912,16400,536870928,541081616,4210688,541065216,4210704,541081600,0,541065232,16,16384,541065216,4210704,16384,4194320,536887312,0,541081600,536870912,4194320,536887312],u=[2097152,69206018,67110914,0,2048,67110914,2099202,69208064,69208066,2097152,0,67108866,2,67108864,69206018,2050,67110912,2099202,2097154,67110912,67108866,69206016,69208064,2097154,69206016,2048,2050,69208066,2099200,2,67108864,2099200,67108864,2099200,2097152,67110914,67110914,69206018,69206018,2,2097154,67108864,67110912,2097152,69208064,2050,2099202,69208064,2050,67108866,69208066,69206016,2099200,0,2,69208066,0,2099202,69206016,2048,67108866,67110912,2048,2097154],a=[268439616,4096,262144,268701760,268435456,268439616,64,268435456,262208,268697600,268701760,266240,268701696,266304,4096,64,268697600,268435520,268439552,4160,266240,262208,268697664,268701696,4160,0,0,268697664,268435520,268439552,266304,262144,266304,262144,268701696,4096,64,268697664,4096,266304,268439552,64,268435520,268697600,268697664,268435456,262144,268439616,0,268701760,262208,268435520,268697600,268439552,268439616,0,268701760,266240,266240,4160,4160,262208,268435456,268701696],l=function(l,c){typeof l=="string"&&(l.length===8||l.length===24)&&(l=e.util.createBuffer(l));var h=f(l),p=1,d=0,v=0,m=0,g=0,y=!1,b=null,w=null,E=h.length===32?3:9,S;E===3?S=c?[0,32,2]:[30,-2,-2]:S=c?[0,32,2,62,30,-2,64,96,2]:[94,62,-2,32,64,2,30,-2,-2];var x=null;return x={start:function(t,n){t?(typeof t=="string"&&t.length===8&&(t=e.util.createBuffer(t)),p=1,d=t.getInt32(),m=t.getInt32()):p=0,y=!1,b=e.util.createBuffer(),w=n||e.util.createBuffer(),x.output=w},update:function(e){y||b.putBuffer(e);while(b.length()>=8){var f,l=b.getInt32(),x=b.getInt32();p===1&&(c?(l^=d,x^=m):(v=d,g=m,d=l,m=x)),f=(l>>>4^x)&252645135,x^=f,l^=f<<4,f=(l>>>16^x)&65535,x^=f,l^=f<<16,f=(x>>>2^l)&858993459,l^=f,x^=f<<2,f=(x>>>8^l)&16711935,l^=f,x^=f<<8,f=(l>>>1^x)&1431655765,x^=f,l^=f<<1,l=l<<1|l>>>31,x=x<<1|x>>>31;for(var T=0;T<E;T+=3){var N=S[T+1],C=S[T+2];for(var k=S[T];k!=N;k+=C){var L=x^h[k],A=(x>>>4|x<<28)^h[k+1];f=l,l=x,x=f^(n[L>>>24&63]|i[L>>>16&63]|o[L>>>8&63]|a[L&63]|t[A>>>24&63]|r[A>>>16&63]|s[A>>>8&63]|u[A&63])}f=l,l=x,x=f}l=l>>>1|l<<31,x=x>>>1|x<<31,f=(l>>>1^x)&1431655765,x^=f,l^=f<<1,f=(x>>>8^l)&16711935,l^=f,x^=f<<8,f=(x>>>2^l)&858993459,l^=f,x^=f<<2,f=(l>>>16^x)&65535,x^=f,l^=f<<16,f=(l>>>4^x)&252645135,x^=f,l^=f<<4,p===1&&(c?(d=l,m=x):(l^=v,x^=g)),w.putInt32(l),w.putInt32(x)}},finish:function(e){var t=!0;if(c)if(e)t=e(8,b,!c);else{var n=b.length()===8?8:8-b.length();b.fillWithByte(n,n)}t&&(y=!0,x.update());if(!c){t=b.length()===0;if(t)if(e)t=e(8,w,!c);else{var r=w.length(),i=w.at(r-1);i>r?t=!1:w.truncate(i)}}return t}},x};e.des=e.des||{},e.des.startEncrypting=function(e,t,n){var r=l(e,!0);return r.start(t,n),r},e.des.createEncryptionCipher=function(e){return l(e,!0)},e.des.startDecrypting=function(e,t,n){var r=l(e,!1);return r.start(t,n),r},e.des.createDecryptionCipher=function(e){return l(e,!1)}}var r="des";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/des",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.pkcs5=e.pkcs5||{};e.pbkdf2=t.pbkdf2=function(t,n,r,i,s){if(typeof s=="undefined"||s===null)s=e.md.sha1.create();var o=s.digestLength;if(i>4294967295*o)throw{message:"Derived key is too long."};var u=Math.ceil(i/o),a=i-(u-1)*o,f=e.hmac.create();f.start(s,t);var l="",c,h,p;for(var d=1;d<=u;++d){f.start(null,null),f.update(n),f.update(e.util.int32ToBytes(d)),c=p=f.digest().getBytes();for(var v=2;v<=r;++v)f.start(null,null),f.update(p),h=f.digest().getBytes(),c=e.util.xorBytes(c,h,o),p=h;l+=d<u?c:c.substr(0,a)}return l}}var r="pbkdf2";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pbkdf2",["require","module","./hmac","./md","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var n=typeof process!="undefined"&&process.versions&&process.versions.node,r=null;!e.disableNativeCode&&n&&(r=t("crypto"));var i=e.prng=e.prng||{};i.create=function(t){function u(e){if(n.pools[0].messageLength>=32)return f(),e();var t=32-n.pools[0].messageLength<<5;n.seedFile(t,function(t,r){if(t)return e(t);n.collect(r),f(),e()})}function a(){if(n.pools[0].messageLength>=32)return f();var e=32-n.pools[0].messageLength<<5;n.collect(n.seedFileSync(e)),f()}function f(){var t=e.md.sha1.create();t.update(n.pools[0].digest().getBytes()),n.pools[0].start();var r=1;for(var i=1;i<32;++i)r=r===31?2147483648:r<<2,r%n.reseeds===0&&(t.update(n.pools[i].digest().getBytes()),n.pools[i].start());var s=t.digest().getBytes();t.start(),t.update(s);var o=t.digest().getBytes();n.key=n.plugin.formatKey(s),n.seed=n.plugin.formatSeed(o),++n.reseeds,n.generated=0,n.time=+(new Date)}function l(t){var n=null;if(typeof window!="undefined"){var r=window.crypto||window.msCrypto;r&&r.getRandomValues&&(n=function(e){return r.getRandomValues(e)})}var i=e.util.createBuffer();if(n)while(i.length()<t){var s=Math.max(1,Math.min(t-i.length(),65536)/4),o=new Uint32Array(Math.floor(s));try{n(o);for(var u=0;u<o.length;++u)i.putInt32(o[u])}catch(a){if(!(typeof QuotaExceededError!="undefined"&&a instanceof QuotaExceededError))throw a}}if(i.length()<t){var f,l,c,h=Math.floor(Math.random()*65536);while(i.length()<t){l=16807*(h&65535),f=16807*(h>>16),l+=(f&32767)<<16,l+=f>>15,l=(l&2147483647)+(l>>31),h=l&4294967295;for(var u=0;u<3;++u)c=h>>>(u<<3),c^=Math.floor(Math.random()*256),i.putByte(String.fromCharCode(c&255))}}return i.getBytes(t)}var n={plugin:t,key:null,seed:null,time:null,reseeds:0,generated:0},i=t.md,s=new Array(32);for(var o=0;o<32;++o)s[o]=i.create();return n.pools=s,n.pool=0,n.generate=function(t,r){function l(c){if(c)return r(c);if(f.length()>=t)return r(null,f.getBytes(t));if(n.generated>=1048576){var h=+(new Date);if(n.time===null||h-n.time>100)n.key=null}if(n.key===null)return u(l);var p=i(n.key,n.seed);n.generated+=p.length,f.putBytes(p),n.key=o(i(n.key,s(n.seed))),n.seed=a(i(n.key,n.seed)),e.util.setImmediate(l)}if(!r)return n.generateSync(t);var i=n.plugin.cipher,s=n.plugin.increment,o=n.plugin.formatKey,a=n.plugin.formatSeed,f=e.util.createBuffer();l()},n.generateSync=function(t){var r=n.plugin.cipher,i=n.plugin.increment,s=n.plugin.formatKey,o=n.plugin.formatSeed,u=e.util.createBuffer();while(u.length()<t){if(n.generated>=1048576){var f=+(new Date);if(n.time===null||f-n.time>100)n.key=null}n.key===null&&a();var l=r(n.key,n.seed);n.generated+=l.length,u.putBytes(l),n.key=s(r(n.key,i(n.seed))),n.seed=o(r(n.key,n.seed))}return u.getBytes(t)},r?(n.seedFile=function(e,t){r.randomBytes(e,function(e,n){if(e)return t(e);t(null,n.toString())})},n.seedFileSync=function(e){return r.randomBytes(e).toString()}):(n.seedFile=function(e,t){try{t(null,l(e))}catch(n){t(n)}},n.seedFileSync=l),n.collect=function(e){var t=e.length;for(var r=0;r<t;++r)n.pools[n.pool].update(e.substr(r,1)),n.pool=n.pool===31?0:n.pool+1},n.collectInt=function(e,t){var r="";for(var i=0;i<t;i+=8)r+=String.fromCharCode(e>>i&255);n.collect(r)},n.registerWorker=function(e){if(e===self)n.seedFile=function(e,t){function n(e){var r=e.data;r.forge&&r.forge.prng&&(self.removeEventListener("message",n),t(r.forge.prng.err,r.forge.prng.bytes))}self.addEventListener("message",n),self.postMessage({forge:{prng:{needed:e}}})};else{function t(t){var r=t.data;r.forge&&r.forge.prng&&n.seedFile(r.forge.prng.needed,function(t,n){e.postMessage({forge:{prng:{err:t,bytes:n}}})})}e.addEventListener("message",t)}},n}}var r="prng";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/prng",["require","module","./md","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){if(e.random&&e.random.getBytes)return;(function(t){var n={},r=new Array(4),i=e.util.createBuffer();n.formatKey=function(t){var n=e.util.createBuffer(t);return t=new Array(4),t[0]=n.getInt32(),t[1]=n.getInt32(),t[2]=n.getInt32(),t[3]=n.getInt32(),e.aes._expandKey(t,!1)},n.formatSeed=function(t){var n=e.util.createBuffer(t);return t=new Array(4),t[0]=n.getInt32(),t[1]=n.getInt32(),t[2]=n.getInt32(),t[3]=n.getInt32(),t},n.cipher=function(t,n){return e.aes._updateBlock(t,n,r,!1),i.putInt32(r[0]),i.putInt32(r[1]),i.putInt32(r[2]),i.putInt32(r[3]),i.getBytes()},n.increment=function(e){return++e[3],e},n.md=e.md.sha1;var s=e.prng.create(n),o=typeof process!="undefined"&&process.versions&&process.versions.node,u=null;if(typeof window!="undefined"){var a=window.crypto||window.msCrypto;a&&a.getRandomValues&&(u=function(e){return a.getRandomValues(e)})}if(e.disableNativeCode||!o&&!u){typeof window=="undefined"||window.document===undefined,s.collectInt(+(new Date),32);if(typeof navigator!="undefined"){var f="";for(var l in navigator)try{typeof navigator[l]=="string"&&(f+=navigator[l])}catch(c){}s.collect(f),f=null}t&&(t().mousemove(function(e){s.collectInt(e.clientX,16),s.collectInt(e.clientY,16)}),t().keypress(function(e){s.collectInt(e.charCode,8)}))}if(!e.random)e.random=s;else for(var l in s)e.random[l]=s[l];e.random.getBytes=function(t,n){return e.random.generate(t,n)},e.random.getBytesSync=function(t){return e.random.generate(t)}})(typeof jQuery!="undefined"?jQuery:null)}var r="random";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/random",["require","module","./aes","./md","./prng","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=[217,120,249,196,25,221,181,237,40,233,253,121,74,160,216,157,198,126,55,131,43,118,83,142,98,76,100,136,68,139,251,162,23,154,89,245,135,179,79,19,97,69,109,141,9,129,125,50,189,143,64,235,134,183,123,11,240,149,33,34,92,107,78,130,84,214,101,147,206,96,178,28,115,86,192,20,167,140,241,220,18,117,202,31,59,190,228,209,66,61,212,48,163,60,182,38,111,191,14,218,70,105,7,87,39,242,29,155,188,148,67,3,248,17,199,246,144,239,62,231,6,195,213,47,200,102,30,215,8,232,234,222,128,82,238,247,132,170,114,172,53,77,106,42,150,26,210,113,90,21,73,116,75,159,208,94,4,24,164,236,194,224,65,110,15,81,203,204,36,145,175,80,161,244,112,57,153,124,58,133,35,184,180,122,252,2,54,91,37,85,151,49,45,93,250,152,227,138,146,174,5,223,41,16,103,108,186,201,211,0,230,207,225,158,168,44,99,22,1,63,88,226,137,169,13,56,52,27,171,51,255,176,187,72,12,95,185,177,205,46,197,243,219,71,229,165,156,119,10,166,32,104,254,127,193,173],n=[1,2,3,5],r=function(e,t){return e<<t&65535|(e&65535)>>16-t},i=function(e,t){return(e&65535)>>t|e<<16-t&65535};e.rc2=e.rc2||{},e.rc2.expandKey=function(n,r){typeof n=="string"&&(n=e.util.createBuffer(n)),r=r||128;var i=n,s=n.length(),o=r,u=Math.ceil(o/8),a=255>>(o&7),f;for(f=s;f<128;f++)i.putByte(t[i.at(f-1)+i.at(f-s)&255]);i.setAt(128-u,t[i.at(128-u)&a]);for(f=127-u;f>=0;f--)i.setAt(f,t[i.at(f+1)^i.at(f+u)]);return i};var s=function(t,s,o){var u=!1,a=null,f=null,l=null,c,h,p,d,v=[];t=e.rc2.expandKey(t,s);for(p=0;p<64;p++)v.push(t.getInt16Le());o?(c=function(e){for(p=0;p<4;p++)e[p]+=v[d]+(e[(p+3)%4]&e[(p+2)%4])+(~e[(p+3)%4]&e[(p+1)%4]),e[p]=r(e[p],n[p]),d++},h=function(e){for(p=0;p<4;p++)e[p]+=v[e[(p+3)%4]&63]}):(c=function(e){for(p=3;p>=0;p--)e[p]=i(e[p],n[p]),e[p]-=v[d]+(e[(p+3)%4]&e[(p+2)%4])+(~e[(p+3)%4]&e[(p+1)%4]),d--},h=function(e){for(p=3;p>=0;p--)e[p]-=v[e[(p+3)%4]&63]});var m=function(e){var t=[];for(p=0;p<4;p++){var n=a.getInt16Le();l!==null&&(o?n^=l.getInt16Le():l.putInt16Le(n)),t.push(n&65535)}d=o?0:63;for(var r=0;r<e.length;r++)for(var i=0;i<e[r][0];i++)e[r][1](t);for(p=0;p<4;p++)l!==null&&(o?l.putInt16Le(t[p]):t[p]^=l.getInt16Le()),f.putInt16Le(t[p])},g=null;return g={start:function(t,n){t&&typeof t=="string"&&(t=e.util.createBuffer(t)),u=!1,a=e.util.createBuffer(),f=n||new e.util.createBuffer,l=t,g.output=f},update:function(e){u||a.putBuffer(e);while(a.length()>=8)m([[5,c],[1,h],[6,c],[1,h],[5,c]])},finish:function(e){var t=!0;if(o)if(e)t=e(8,a,!o);else{var n=a.length()===8?8:8-a.length();a.fillWithByte(n,n)}t&&(u=!0,g.update());if(!o){t=a.length()===0;if(t)if(e)t=e(8,f,!o);else{var r=f.length(),i=f.at(r-1);i>r?t=!1:f.truncate(i)}}return t}},g};e.rc2.startEncrypting=function(t,n,r){var i=e.rc2.createEncryptionCipher(t,128);return i.start(n,r),i},e.rc2.createEncryptionCipher=function(e,t){return s(e,t,!0)},e.rc2.startDecrypting=function(t,n,r){var i=e.rc2.createDecryptionCipher(t,128);return i.start(n,r),i},e.rc2.createDecryptionCipher=function(e,t){return s(e,t,!1)}}var r="rc2";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/rc2",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function i(e,t,n){this.data=[],e!=null&&("number"==typeof e?this.fromNumber(e,t,n):t==null&&"string"!=typeof e?this.fromString(e,256):this.fromString(e,t))}function s(){return new i(null)}function o(e,t,n,r,i,s){while(--s>=0){var o=t*this.data[e++]+n.data[r]+i;i=Math.floor(o/67108864),n.data[r++]=o&67108863}return i}function u(e,t,n,r,i,s){var o=t&32767,u=t>>15;while(--s>=0){var a=this.data[e]&32767,f=this.data[e++]>>15,l=u*a+f*o;a=o*a+((l&32767)<<15)+n.data[r]+(i&1073741823),i=(a>>>30)+(l>>>15)+u*f+(i>>>30),n.data[r++]=a&1073741823}return i}function a(e,t,n,r,i,s){var o=t&16383,u=t>>14;while(--s>=0){var a=this.data[e]&16383,f=this.data[e++]>>14,l=u*a+f*o;a=o*a+((l&16383)<<14)+n.data[r]+i,i=(a>>28)+(l>>14)+u*f,n.data[r++]=a&268435455}return i}function d(e){return l.charAt(e)}function v(e,t){var n=c[e.charCodeAt(t)];return n==null?-1:n}function m(e){for(var t=this.t-1;t>=0;--t)e.data[t]=this.data[t];e.t=this.t,e.s=this.s}function g(e){this.t=1,this.s=e<0?-1:0,e>0?this.data[0]=e:e<-1?this.data[0]=e+this.DV:this.t=0}function y(e){var t=s();return t.fromInt(e),t}function b(e,t){var n;if(t==16)n=4;else if(t==8)n=3;else if(t==256)n=8;else if(t==2)n=1;else if(t==32)n=5;else{if(t!=4){this.fromRadix(e,t);return}n=2}this.t=0,this.s=0;var r=e.length,s=!1,o=0;while(--r>=0){var u=n==8?e[r]&255:v(e,r);if(u<0){e.charAt(r)=="-"&&(s=!0);continue}s=!1,o==0?this.data[this.t++]=u:o+n>this.DB?(this.data[this.t-1]|=(u&(1<<this.DB-o)-1)<<o,this.data[this.t++]=u>>this.DB-o):this.data[this.t-1]|=u<<o,o+=n,o>=this.DB&&(o-=this.DB)}n==8&&(e[0]&128)!=0&&(this.s=-1,o>0&&(this.data[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),s&&i.ZERO.subTo(this,this)}function w(){var e=this.s&this.DM;while(this.t>0&&this.data[this.t-1]==e)--this.t}function E(e){if(this.s<0)return"-"+this.negate().toString(e);var t;if(e==16)t=4;else if(e==8)t=3;else if(e==2)t=1;else if(e==32)t=5;else{if(e!=4)return this.toRadix(e);t=2}var n=(1<<t)-1,r,i=!1,s="",o=this.t,u=this.DB-o*this.DB%t;if(o-->0){u<this.DB&&(r=this.data[o]>>u)>0&&(i=!0,s=d(r));while(o>=0)u<t?(r=(this.data[o]&(1<<u)-1)<<t-u,r|=this.data[--o]>>(u+=this.DB-t)):(r=this.data[o]>>(u-=t)&n,u<=0&&(u+=this.DB,--o)),r>0&&(i=!0),i&&(s+=d(r))}return i?s:"0"}function S(){var e=s();return i.ZERO.subTo(this,e),e}function x(){return this.s<0?this.negate():this}function T(e){var t=this.s-e.s;if(t!=0)return t;var n=this.t;t=n-e.t;if(t!=0)return this.s<0?-t:t;while(--n>=0)if((t=this.data[n]-e.data[n])!=0)return t;return 0}function N(e){var t=1,n;return(n=e>>>16)!=0&&(e=n,t+=16),(n=e>>8)!=0&&(e=n,t+=8),(n=e>>4)!=0&&(e=n,t+=4),(n=e>>2)!=0&&(e=n,t+=2),(n=e>>1)!=0&&(e=n,t+=1),t}function C(){return this.t<=0?0:this.DB*(this.t-1)+N(this.data[this.t-1]^this.s&this.DM)}function k(e,t){var n;for(n=this.t-1;n>=0;--n)t.data[n+e]=this.data[n];for(n=e-1;n>=0;--n)t.data[n]=0;t.t=this.t+e,t.s=this.s}function L(e,t){for(var n=e;n<this.t;++n)t.data[n-e]=this.data[n];t.t=Math.max(this.t-e,0),t.s=this.s}function A(e,t){var n=e%this.DB,r=this.DB-n,i=(1<<r)-1,s=Math.floor(e/this.DB),o=this.s<<n&this.DM,u;for(u=this.t-1;u>=0;--u)t.data[u+s+1]=this.data[u]>>r|o,o=(this.data[u]&i)<<n;for(u=s-1;u>=0;--u)t.data[u]=0;t.data[s]=o,t.t=this.t+s+1,t.s=this.s,t.clamp()}function O(e,t){t.s=this.s;var n=Math.floor(e/this.DB);if(n>=this.t){t.t=0;return}var r=e%this.DB,i=this.DB-r,s=(1<<r)-1;t.data[0]=this.data[n]>>r;for(var o=n+1;o<this.t;++o)t.data[o-n-1]|=(this.data[o]&s)<<i,t.data[o-n]=this.data[o]>>r;r>0&&(t.data[this.t-n-1]|=(this.s&s)<<i),t.t=this.t-n,t.clamp()}function M(e,t){var n=0,r=0,i=Math.min(e.t,this.t);while(n<i)r+=this.data[n]-e.data[n],t.data[n++]=r&this.DM,r>>=this.DB;if(e.t<this.t){r-=e.s;while(n<this.t)r+=this.data[n],t.data[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{r+=this.s;while(n<e.t)r-=e.data[n],t.data[n++]=r&this.DM,r>>=this.DB;r-=e.s}t.s=r<0?-1:0,r<-1?t.data[n++]=this.DV+r:r>0&&(t.data[n++]=r),t.t=n,t.clamp()}function _(e,t){var n=this.abs(),r=e.abs(),s=n.t;t.t=s+r.t;while(--s>=0)t.data[s]=0;for(s=0;s<r.t;++s)t.data[s+n.t]=n.am(0,r.data[s],t,s,0,n.t);t.s=0,t.clamp(),this.s!=e.s&&i.ZERO.subTo(t,t)}function D(e){var t=this.abs(),n=e.t=2*t.t;while(--n>=0)e.data[n]=0;for(n=0;n<t.t-1;++n){var r=t.am(n,t.data[n],e,2*n,0,1);(e.data[n+t.t]+=t.am(n+1,2*t.data[n],e,2*n+1,r,t.t-n-1))>=t.DV&&(e.data[n+t.t]-=t.DV,e.data[n+t.t+1]=1)}e.t>0&&(e.data[e.t-1]+=t.am(n,t.data[n],e,2*n,0,1)),e.s=0,e.clamp()}function P(e,t,n){var r=e.abs();if(r.t<=0)return;var o=this.abs();if(o.t<r.t){t!=null&&t.fromInt(0),n!=null&&this.copyTo(n);return}n==null&&(n=s());var u=s(),a=this.s,f=e.s,l=this.DB-N(r.data[r.t-1]);l>0?(r.lShiftTo(l,u),o.lShiftTo(l,n)):(r.copyTo(u),o.copyTo(n));var c=u.t,h=u.data[c-1];if(h==0)return;var p=h*(1<<this.F1)+(c>1?u.data[c-2]>>this.F2:0),d=this.FV/p,v=(1<<this.F1)/p,m=1<<this.F2,g=n.t,y=g-c,b=t==null?s():t;u.dlShiftTo(y,b),n.compareTo(b)>=0&&(n.data[n.t++]=1,n.subTo(b,n)),i.ONE.dlShiftTo(c,b),b.subTo(u,u);while(u.t<c)u.data[u.t++]=0;while(--y>=0){var w=n.data[--g]==h?this.DM:Math.floor(n.data[g]*d+(n.data[g-1]+m)*v);if((n.data[g]+=u.am(0,w,n,y,0,c))<w){u.dlShiftTo(y,b),n.subTo(b,n);while(n.data[g]<--w)n.subTo(b,n)}}t!=null&&(n.drShiftTo(c,t),a!=f&&i.ZERO.subTo(t,t)),n.t=c,n.clamp(),l>0&&n.rShiftTo(l,n),a<0&&i.ZERO.subTo(n,n)}function H(e){var t=s();return this.abs().divRemTo(e,null,t),this.s<0&&t.compareTo(i.ZERO)>0&&e.subTo(t,t),t}function B(e){this.m=e}function j(e){return e.s<0||e.compareTo(this.m)>=0?e.mod(this.m):e}function F(e){return e}function I(e){e.divRemTo(this.m,null,e)}function q(e,t,n){e.multiplyTo(t,n),this.reduce(n)}function R(e,t){e.squareTo(t),this.reduce(t)}function U(){if(this.t<1)return 0;var e=this.data[0];if((e&1)==0)return 0;var t=e&3;return t=t*(2-(e&15)*t)&15,t=t*(2-(e&255)*t)&255,t=t*(2-((e&65535)*t&65535))&65535,t=t*(2-e*t%this.DV)%this.DV,t>0?this.DV-t:-t}function z(e){this.m=e,this.mp=e.invDigit(),this.mpl=this.mp&32767,this.mph=this.mp>>15,this.um=(1<<e.DB-15)-1,this.mt2=2*e.t}function W(e){var t=s();return e.abs().dlShiftTo(this.m.t,t),t.divRemTo(this.m,null,t),e.s<0&&t.compareTo(i.ZERO)>0&&this.m.subTo(t,t),t}function X(e){var t=s();return e.copyTo(t),this.reduce(t),t}function V(e){while(e.t<=this.mt2)e.data[e.t++]=0;for(var t=0;t<this.m.t;++t){var n=e.data[t]&32767,r=n*this.mpl+((n*this.mph+(e.data[t]>>15)*this.mpl&this.um)<<15)&e.DM;n=t+this.m.t,e.data[n]+=this.m.am(0,r,e,t,0,this.m.t);while(e.data[n]>=e.DV)e.data[n]-=e.DV,e.data[++n]++}e.clamp(),e.drShiftTo(this.m.t,e),e.compareTo(this.m)>=0&&e.subTo(this.m,e)}function $(e,t){e.squareTo(t),this.reduce(t)}function J(e,t,n){e.multiplyTo(t,n),this.reduce(n)}function K(){return(this.t>0?this.data[0]&1:this.s)==0}function Q(e,t){if(e>4294967295||e<1)return i.ONE;var n=s(),r=s(),o=t.convert(this),u=N(e)-1;o.copyTo(n);while(--u>=0){t.sqrTo(n,r);if((e&1<<u)>0)t.mulTo(r,o,n);else{var a=n;n=r,r=a}}return t.revert(n)}function G(e,t){var n;return e<256||t.isEven()?n=new B(t):n=new z(t),this.exp(e,n)}function Y(){var e=s();return this.copyTo(e),e}function Z(){if(this.s<0){if(this.t==1)return this.data[0]-this.DV;if(this.t==0)return-1}else{if(this.t==1)return this.data[0];if(this.t==0)return 0}return(this.data[1]&(1<<32-this.DB)-1)<<this.DB|this.data[0]}function et(){return this.t==0?this.s:this.data[0]<<24>>24}function tt(){return this.t==0?this.s:this.data[0]<<16>>16}function nt(e){return Math.floor(Math.LN2*this.DB/Math.log(e))}function rt(){return this.s<0?-1:this.t<=0||this.t==1&&this.data[0]<=0?0:1}function it(e){e==null&&(e=10);if(this.signum()==0||e<2||e>36)return"0";var t=this.chunkSize(e),n=Math.pow(e,t),r=y(n),i=s(),o=s(),u="";this.divRemTo(r,i,o);while(i.signum()>0)u=(n+o.intValue()).toString(e).substr(1)+u,i.divRemTo(r,i,o);return o.intValue().toString(e)+u}function st(e,t){this.fromInt(0),t==null&&(t=10);var n=this.chunkSize(t),r=Math.pow(t,n),s=!1,o=0,u=0;for(var a=0;a<e.length;++a){var f=v(e,a);if(f<0){e.charAt(a)=="-"&&this.signum()==0&&(s=!0);continue}u=t*u+f,++o>=n&&(this.dMultiply(r),this.dAddOffset(u,0),o=0,u=0)}o>0&&(this.dMultiply(Math.pow(t,o)),this.dAddOffset(u,0)),s&&i.ZERO.subTo(this,this)}function ot(e,t,n){if("number"==typeof t)if(e<2)this.fromInt(1);else{this.fromNumber(e,n),this.testBit(e-1)||this.bitwiseTo(i.ONE.shiftLeft(e-1),dt,this),this.isEven()&&this.dAddOffset(1,0);while(!this.isProbablePrime(t))this.dAddOffset(2,0),this.bitLength()>e&&this.subTo(i.ONE.shiftLeft(e-1),this)}else{var r=new Array,s=e&7;r.length=(e>>3)+1,t.nextBytes(r),s>0?r[0]&=(1<<s)-1:r[0]=0,this.fromString(r,256)}}function ut(){var e=this.t,t=new Array;t[0]=this.s;var n=this.DB-e*this.DB%8,r,i=0;if(e-->0){n<this.DB&&(r=this.data[e]>>n)!=(this.s&this.DM)>>n&&(t[i++]=r|this.s<<this.DB-n);while(e>=0){n<8?(r=(this.data[e]&(1<<n)-1)<<8-n,r|=this.data[--e]>>(n+=this.DB-8)):(r=this.data[e]>>(n-=8)&255,n<=0&&(n+=this.DB,--e)),(r&128)!=0&&(r|=-256),i==0&&(this.s&128)!=(r&128)&&++i;if(i>0||r!=this.s)t[i++]=r}}return t}function at(e){return this.compareTo(e)==0}function ft(e){return this.compareTo(e)<0?this:e}function lt(e){return this.compareTo(e)>0?this:e}function ct(e,t,n){var r,i,s=Math.min(e.t,this.t);for(r=0;r<s;++r)n.data[r]=t(this.data[r],e.data[r]);if(e.t<this.t){i=e.s&this.DM;for(r=s;r<this.t;++r)n.data[r]=t(this.data[r],i);n.t=this.t}else{i=this.s&this.DM;for(r=s;r<e.t;++r)n.data[r]=t(i,e.data[r]);n.t=e.t}n.s=t(this.s,e.s),n.clamp()}function ht(e,t){return e&t}function pt(e){var t=s();return this.bitwiseTo(e,ht,t),t}function dt(e,t){return e|t}function vt(e){var t=s();return this.bitwiseTo(e,dt,t),t}function mt(e,t){return e^t}function gt(e){var t=s();return this.bitwiseTo(e,mt,t),t}function yt(e,t){return e&~t}function bt(e){var t=s();return this.bitwiseTo(e,yt,t),t}function wt(){var e=s();for(var t=0;t<this.t;++t)e.data[t]=this.DM&~this.data[t];return e.t=this.t,e.s=~this.s,e}function Et(e){var t=s();return e<0?this.rShiftTo(-e,t):this.lShiftTo(e,t),t}function St(e){var t=s();return e<0?this.lShiftTo(-e,t):this.rShiftTo(e,t),t}function xt(e){if(e==0)return-1;var t=0;return(e&65535)==0&&(e>>=16,t+=16),(e&255)==0&&(e>>=8,t+=8),(e&15)==0&&(e>>=4,t+=4),(e&3)==0&&(e>>=2,t+=2),(e&1)==0&&++t,t}function Tt(){for(var e=0;e<this.t;++e)if(this.data[e]!=0)return e*this.DB+xt(this.data[e]);return this.s<0?this.t*this.DB:-1}function Nt(e){var t=0;while(e!=0)e&=e-1,++t;return t}function Ct(){var e=0,t=this.s&this.DM;for(var n=0;n<this.t;++n)e+=Nt(this.data[n]^t);return e}function kt(e){var t=Math.floor(e/this.DB);return t>=this.t?this.s!=0:(this.data[t]&1<<e%this.DB)!=0}function Lt(e,t){var n=i.ONE.shiftLeft(e);return this.bitwiseTo(n,t,n),n}function At(e){return this.changeBit(e,dt)}function Ot(e){return this.changeBit(e,yt)}function Mt(e){return this.changeBit(e,mt)}function _t(e,t){var n=0,r=0,i=Math.min(e.t,this.t);while(n<i)r+=this.data[n]+e.data[n],t.data[n++]=r&this.DM,r>>=this.DB;if(e.t<this.t){r+=e.s;while(n<this.t)r+=this.data[n],t.data[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{r+=this.s;while(n<e.t)r+=e.data[n],t.data[n++]=r&this.DM,r>>=this.DB;r+=e.s}t.s=r<0?-1:0,r>0?t.data[n++]=r:r<-1&&(t.data[n++]=this.DV+r),t.t=n,t.clamp()}function Dt(e){var t=s();return this.addTo(e,t),t}function Pt(e){var t=s();return this.subTo(e,t),t}function Ht(e){var t=s();return this.multiplyTo(e,t),t}function Bt(e){var t=s();return this.divRemTo(e,t,null),t}function jt(e){var t=s();return this.divRemTo(e,null,t),t}function Ft(e){var t=s(),n=s();return this.divRemTo(e,t,n),new Array(t,n)}function It(e){this.data[this.t]=this.am(0,e-1,this,0,0,this.t),++this.t,this.clamp()}function qt(e,t){if(e==0)return;while(this.t<=t)this.data[this.t++]=0;this.data[t]+=e;while(this.data[t]>=this.DV)this.data[t]-=this.DV,++t>=this.t&&(this.data[this.t++]=0),++this.data[t]}function Rt(){}function Ut(e){return e}function zt(e,t,n){e.multiplyTo(t,n)}function Wt(e,t){e.squareTo(t)}function Xt(e){return this.exp(e,new Rt)}function Vt(e,t,n){var r=Math.min(this.t+e.t,t);n.s=0,n.t=r;while(r>0)n.data[--r]=0;var i;for(i=n.t-this.t;r<i;++r)n.data[r+this.t]=this.am(0,e.data[r],n,r,0,this.t);for(i=Math.min(e.t,t);r<i;++r)this.am(0,e.data[r],n,r,0,t-r);n.clamp()}function $t(e,t,n){--t;var r=n.t=this.t+e.t-t;n.s=0;while(--r>=0)n.data[r]=0;for(r=Math.max(t-this.t,0);r<e.t;++r)n.data[this.t+r-t]=this.am(t-r,e.data[r],n,0,0,this.t+r-t);n.clamp(),n.drShiftTo(1,n)}function Jt(e){this.r2=s(),this.q3=s(),i.ONE.dlShiftTo(2*e.t,this.r2),this.mu=this.r2.divide(e),this.m=e}function Kt(e){if(e.s<0||e.t>2*this.m.t)return e.mod(this.m);if(e.compareTo(this.m)<0)return e;var t=s();return e.copyTo(t),this.reduce(t),t}function Qt(e){return e}function Gt(e){e.drShiftTo(this.m.t-1,this.r2),e.t>this.m.t+1&&(e.t=this.m.t+1,e.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);while(e.compareTo(this.r2)<0)e.dAddOffset(1,this.m.t+1);e.subTo(this.r2,e);while(e.compareTo(this.m)>=0)e.subTo(this.m,e)}function Yt(e,t){e.squareTo(t),this.reduce(t)}function Zt(e,t,n){e.multiplyTo(t,n),this.reduce(n)}function en(e,t){var n=e.bitLength(),r,i=y(1),o;if(n<=0)return i;n<18?r=1:n<48?r=3:n<144?r=4:n<768?r=5:r=6,n<8?o=new B(t):t.isEven()?o=new Jt(t):o=new z(t);var u=new Array,a=3,f=r-1,l=(1<<r)-1;u[1]=o.convert(this);if(r>1){var c=s();o.sqrTo(u[1],c);while(a<=l)u[a]=s(),o.mulTo(c,u[a-2],u[a]),a+=2}var h=e.t-1,p,d=!0,v=s(),m;n=N(e.data[h])-1;while(h>=0){n>=f?p=e.data[h]>>n-f&l:(p=(e.data[h]&(1<<n+1)-1)<<f-n,h>0&&(p|=e.data[h-1]>>this.DB+n-f)),a=r;while((p&1)==0)p>>=1,--a;(n-=a)<0&&(n+=this.DB,--h);if(d)u[p].copyTo(i),d=!1;else{while(a>1)o.sqrTo(i,v),o.sqrTo(v,i),a-=2;a>0?o.sqrTo(i,v):(m=i,i=v,v=m),o.mulTo(v,u[p],i)}while(h>=0&&(e.data[h]&1<<n)==0)o.sqrTo(i,v),m=i,i=v,v=m,--n<0&&(n=this.DB-1,--h)}return o.revert(i)}function tn(e){var t=this.s<0?this.negate():this.clone(),n=e.s<0?e.negate():e.clone();if(t.compareTo(n)<0){var r=t;t=n,n=r}var i=t.getLowestSetBit(),s=n.getLowestSetBit();if(s<0)return t;i<s&&(s=i),s>0&&(t.rShiftTo(s,t),n.rShiftTo(s,n));while(t.signum()>0)(i=t.getLowestSetBit())>0&&t.rShiftTo(i,t),(i=n.getLowestSetBit())>0&&n.rShiftTo(i,n),t.compareTo(n)>=0?(t.subTo(n,t),t.rShiftTo(1,t)):(n.subTo(t,n),n.rShiftTo(1,n));return s>0&&n.lShiftTo(s,n),n}function nn(e){if(e<=0)return 0;var t=this.DV%e,n=this.s<0?e-1:0;if(this.t>0)if(t==0)n=this.data[0]%e;else for(var r=this.t-1;r>=0;--r)n=(t*n+this.data[r])%e;return n}function rn(e){var t=e.isEven();if(this.isEven()&&t||e.signum()==0)return i.ZERO;var n=e.clone(),r=this.clone(),s=y(1),o=y(0),u=y(0),a=y(1);while(n.signum()!=0){while(n.isEven()){n.rShiftTo(1,n);if(t){if(!s.isEven()||!o.isEven())s.addTo(this,s),o.subTo(e,o);s.rShiftTo(1,s)}else o.isEven()||o.subTo(e,o);o.rShiftTo(1,o)}while(r.isEven()){r.rShiftTo(1,r);if(t){if(!u.isEven()||!a.isEven())u.addTo(this,u),a.subTo(e,a);u.rShiftTo(1,u)}else a.isEven()||a.subTo(e,a);a.rShiftTo(1,a)}n.compareTo(r)>=0?(n.subTo(r,n),t&&s.subTo(u,s),o.subTo(a,o)):(r.subTo(n,r),t&&u.subTo(s,u),a.subTo(o,a))}return r.compareTo(i.ONE)!=0?i.ZERO:a.compareTo(e)>=0?a.subtract(e):a.signum()<0?(a.addTo(e,a),a.signum()<0?a.add(e):a):a}function un(e){var t,n=this.abs();if(n.t==1&&n.data[0]<=sn[sn.length-1]){for(t=0;t<sn.length;++t)if(n.data[0]==sn[t])return!0;return!1}if(n.isEven())return!1;t=1;while(t<sn.length){var r=sn[t],i=t+1;while(i<sn.length&&r<on)r*=sn[i++];r=n.modInt(r);while(t<i)if(r%sn[t++]==0)return!1}return n.millerRabin(e)}function an(e){var t=this.subtract(i.ONE),n=t.getLowestSetBit();if(n<=0)return!1;var r=t.shiftRight(n),s=fn(),o;for(var u=0;u<e;++u){do o=new i(this.bitLength(),s);while(o.compareTo(i.ONE)<=0||o.compareTo(t)>=0);var a=o.modPow(r,this);if(a.compareTo(i.ONE)!=0&&a.compareTo(t)!=0){var f=1;while(f++<n&&a.compareTo(t)!=0){a=a.modPowInt(2,this);if(a.compareTo(i.ONE)==0)return!1}if(a.compareTo(t)!=0)return!1}}return!0}function fn(){return{nextBytes:function(e){for(var t=0;t<e.length;++t)e[t]=Math.floor(Math.random()*255)}}}var t,n=0xdeadbeefcafe,r=(n&16777215)==15715070;typeof navigator=="undefined"?(i.prototype.am=a,t=28):r&&navigator.appName=="Microsoft Internet Explorer"?(i.prototype.am=u,t=30):r&&navigator.appName!="Netscape"?(i.prototype.am=o,t=26):(i.prototype.am=a,t=28),i.prototype.DB=t,i.prototype.DM=(1<<t)-1,i.prototype.DV=1<<t;var f=52;i.prototype.FV=Math.pow(2,f),i.prototype.F1=f-t,i.prototype.F2=2*t-f;var l="0123456789abcdefghijklmnopqrstuvwxyz",c=new Array,h,p;h="0".charCodeAt(0);for(p=0;p<=9;++p)c[h++]=p;h="a".charCodeAt(0);for(p=10;p<36;++p)c[h++]=p;h="A".charCodeAt(0);for(p=10;p<36;++p)c[h++]=p;B.prototype.convert=j,B.prototype.revert=F,B.prototype.reduce=I,B.prototype.mulTo=q,B.prototype.sqrTo=R,z.prototype.convert=W,z.prototype.revert=X,z.prototype.reduce=V,z.prototype.mulTo=J,z.prototype.sqrTo=$,i.prototype.copyTo=m,i.prototype.fromInt=g,i.prototype.fromString=b,i.prototype.clamp=w,i.prototype.dlShiftTo=k,i.prototype.drShiftTo=L,i.prototype.lShiftTo=A,i.prototype.rShiftTo=O,i.prototype.subTo=M,i.prototype.multiplyTo=_,i.prototype.squareTo=D,i.prototype.divRemTo=P,i.prototype.invDigit=U,i.prototype.isEven=K,i.prototype.exp=Q,i.prototype.toString=E,i.prototype.negate=S,i.prototype.abs=x,i.prototype.compareTo=T,i.prototype.bitLength=C,i.prototype.mod=H,i.prototype.modPowInt=G,i.ZERO=y(0),i.ONE=y(1),Rt.prototype.convert=Ut,Rt.prototype.revert=Ut,Rt.prototype.mulTo=zt,Rt.prototype.sqrTo=Wt,Jt.prototype.convert=Kt,Jt.prototype.revert=Qt,Jt.prototype.reduce=Gt,Jt.prototype.mulTo=Zt,Jt.prototype.sqrTo=Yt;var sn=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509],on=(1<<26)/sn[sn.length-1];i.prototype.chunkSize=nt,i.prototype.toRadix=it,i.prototype.fromRadix=st,i.prototype.fromNumber=ot,i.prototype.bitwiseTo=ct,i.prototype.changeBit=Lt,i.prototype.addTo=_t,i.prototype.dMultiply=It,i.prototype.dAddOffset=qt,i.prototype.multiplyLowerTo=Vt,i.prototype.multiplyUpperTo=$t,i.prototype.modInt=nn,i.prototype.millerRabin=an,i.prototype.clone=Y,i.prototype.intValue=Z,i.prototype.byteValue=et,i.prototype.shortValue=tt,i.prototype.signum=rt,i.prototype.toByteArray=ut,i.prototype.equals=at,i.prototype.min=ft,i.prototype.max=lt,i.prototype.and=pt,i.prototype.or=vt,i.prototype.xor=gt,i.prototype.andNot=bt,i.prototype.not=wt,i.prototype.shiftLeft=Et,i.prototype.shiftRight=St,i.prototype.getLowestSetBit=Tt,i.prototype.bitCount=Ct,i.prototype.testBit=kt,i.prototype.setBit=At,i.prototype.clearBit=Ot,i.prototype.flipBit=Mt,i.prototype.add=Dt,i.prototype.subtract=Pt,i.prototype.multiply=Ht,i.prototype.divide=Bt,i.prototype.remainder=jt,i.prototype.divideAndRemainder=Ft,i.prototype.modPow=en,i.prototype.modInverse=rn,i.prototype.pow=Xt,i.prototype.gcd=tn,i.prototype.isProbablePrime=un,e.jsbn=e.jsbn||{},e.jsbn.BigInteger=i}var r="jsbn";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/jsbn",["require","module"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function n(e,t,n){var r="",i=Math.ceil(t/n.digestLength);for(var s=0;s<i;++s){var o=String.fromCharCode(s>>24&255,s>>16&255,s>>8&255,s&255);n.start(),n.update(e+o),r+=n.digest().getBytes()}return r.substring(0,t)}var t=e.pkcs1=e.pkcs1||{};t.encode_rsa_oaep=function(t,r,i){var s=undefined,o=undefined,u=undefined;typeof i=="string"?(s=i,o=arguments[3]||undefined,u=arguments[4]||undefined):i&&(s=i.label||undefined,o=i.seed||undefined,u=i.md||undefined),u?u.start():u=e.md.sha1.create();var a=Math.ceil(t.n.bitLength()/8),f=a-2*u.digestLength-2;if(r.length>f)throw{message:"RSAES-OAEP input message length is too long.",length:r.length,maxLength:f};s||(s=""),u.update(s,"raw");var l=u.digest(),c="",h=f-r.length;for(var p=0;p<h;p++)c+="\0";var d=l.getBytes()+c+""+r;if(!o)o=e.random.getBytes(u.digestLength);else if(o.length!==u.digestLength)throw{message:"Invalid RSAES-OAEP seed. The seed length must match the digest length.",seedLength:o.length,digestLength:u.digestLength};var v=n(o,a-u.digestLength-1,u),m=e.util.xorBytes(d,v,d.length),g=n(m,u.digestLength,u),y=e.util.xorBytes(o,g,o.length);return"\0"+y+m},t.decode_rsa_oaep=function(t,r,i){var s=undefined,o=undefined;typeof i=="string"?(s=i,o=arguments[3]||undefined):i&&(s=i.label||undefined,o=i.md||undefined);var u=Math.ceil(t.n.bitLength()/8);if(r.length!==u)throw{message:"RSAES-OAEP encoded message length is invalid.",length:r.length,expectedLength:u};o===undefined?o=e.md.sha1.create():o.start();if(u<2*o.digestLength+2)throw{message:"RSAES-OAEP key is too short for the hash function."};s||(s=""),o.update(s,"raw");var a=o.digest().getBytes(),f=r.charAt(0),l=r.substring(1,o.digestLength+1),c=r.substring(1+o.digestLength),h=n(c,o.digestLength,o),p=e.util.xorBytes(l,h,l.length),d=n(p,u-o.digestLength-1,o),v=e.util.xorBytes(c,d,c.length),m=v.substring(0,o.digestLength),g=f!=="\0";for(var y=0;y<o.digestLength;++y)g|=a.charAt(y)!==m.charAt(y);var b=1,w=o.digestLength;for(var E=o.digestLength;E<v.length;E++){var S=v.charCodeAt(E),x=S&1^1,T=b?65534:0;g|=S&T,b&=x,w+=b}if(g||v.charCodeAt(w)!==1)throw{message:"Invalid RSAES-OAEP padding."};return v.substring(w+1)}}var r="pkcs1";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pkcs1",["require","module","./util","./random","./sha1"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function c(t,n,r){var i=e.util.createBuffer(),s=Math.ceil(n.n.bitLength()/8);if(t.length>s-11)throw{message:"Message is too long for PKCS#1 v1.5 padding.",length:t.length,max:s-11};i.putByte(0),i.putByte(r);var o=s-3-t.length,u;if(r===0||r===1){u=r===0?0:255;for(var a=0;a<o;++a)i.putByte(u)}else while(o>0){var f=0,l=e.random.getBytes(o);for(var a=0;a<o;++a)u=l.charCodeAt(a),u===0?++f:i.putByte(u);o=f}return i.putByte(0),i.putBytes(t),i}function h(t,n,r,i){var s=Math.ceil(n.n.bitLength()/8),o=e.util.createBuffer(t),u=o.getByte(),a=o.getByte();if(u!==0||r&&a!==0&&a!==1||!r&&a!=2||r&&a===0&&typeof i=="undefined")throw{message:"Encryption block is invalid."};var f=0;if(a===0){f=s-3-i;for(var l=0;l<f;++l)if(o.getByte()!==0)throw{message:"Encryption block is invalid."}}else if(a===1){f=0;while(o.length()>1){if(o.getByte()!==255){--o.read;break}++f}}else if(a===2){f=0;while(o.length()>1){if(o.getByte()===0){--o.read;break}++f}}var c=o.getByte();if(c!==0||f!==s-3-o.length())throw{message:"Encryption block is invalid."};return o.getBytes()}function p(n,i,s){function p(){d(n.pBits,function(e,t){if(e)return s(e);n.p=t,d(n.qBits,v)})}function d(e,r){function p(){var r=e-1,i=new t(e,n.rng);return i.testBit(r)||i.bitwiseTo(t.ONE.shiftLeft(r),h,i),i.dAddOffset(31-i.mod(c).byteValue(),0),i}function v(s){if(d)return;--o;var u=s.data;if(u.found){for(var c=0;c<i.length;++c)i[c].terminate();return d=!0,r(null,new t(u.prime,16))}l.bitLength()>e&&(l=p());var h=l.toString(16);s.target.postMessage({e:n.eInt,hex:h,workLoad:a}),l.dAddOffset(f,0)}var i=[];for(var s=0;s<u;++s)i[s]=new Worker("./forge/prime.worker.js");var o=u,l=p();for(var s=0;s<u;++s)i[s].addEventListener("message",v);var d=!1}function v(e,i){n.q=i;if(n.p.compareTo(n.q)<0){var o=n.p;n.p=n.q,n.q=o}n.p1=n.p.subtract(t.ONE),n.q1=n.q.subtract(t.ONE),n.phi=n.p1.multiply(n.q1);if(n.phi.gcd(n.e).compareTo(t.ONE)!==0){n.p=n.q=null,p();return}n.n=n.p.multiply(n.q);if(n.n.bitLength()!==n.bits){n.q=null,d(n.qBits,v);return}var u=n.e.modInverse(n.phi);n.keys={privateKey:r.rsa.setPrivateKey(n.n,n.e,u,n.p,n.q,u.mod(n.p1),u.mod(n.q1),n.q.modInverse(n.p)),publicKey:r.rsa.setPublicKey(n.n,n.e)},s(null,n.keys)}typeof i=="function"&&(s=i,i={});if(typeof Worker=="undefined"){function o(){if(r.rsa.stepKeyPairGenerationState(n,10))return s(null,n.keys);e.util.setImmediate(o)}return o()}var u=i.workers||2,a=i.workLoad||100,f=a*30/8,l=i.workerScript||"forge/prime.worker.js",c=new t(null);c.fromInt(30);var h=function(e,t){return e|t};p()}function d(t){var n=t.toString(16);return n[0]>="8"&&(n="00"+n),e.util.hexToBytes(n)}function v(e){return e<=100?27:e<=150?18:e<=200?15:e<=250?12:e<=300?9:e<=350?8:e<=400?7:e<=500?6:e<=600?5:e<=800?4:e<=1250?3:2}if(typeof t=="undefined")var t=e.jsbn.BigInteger;var n=e.asn1;e.pki=e.pki||{},e.pki.rsa=e.rsa=e.rsa||{};var r=e.pki,i=[6,4,2,4,2,4,6,2],s={name:"PrivateKeyInfo",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"PrivateKeyInfo.version",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyVersion"},{name:"PrivateKeyInfo.privateKeyAlgorithm",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"AlgorithmIdentifier.algorithm",tagClass:n.Class.UNIVERSAL,type:n.Type.OID,constructed:!1,capture:"privateKeyOid"}]},{name:"PrivateKeyInfo",tagClass:n.Class.UNIVERSAL,type:n.Type.OCTETSTRING,constructed:!1,capture:"privateKey"}]},o={name:"RSAPrivateKey",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"RSAPrivateKey.version",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyVersion"},{name:"RSAPrivateKey.modulus",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyModulus"},{name:"RSAPrivateKey.publicExponent",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyPublicExponent"},{name:"RSAPrivateKey.privateExponent",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyPrivateExponent"},{name:"RSAPrivateKey.prime1",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyPrime1"},{name:"RSAPrivateKey.prime2",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyPrime2"},{name:"RSAPrivateKey.exponent1",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyExponent1"},{name:"RSAPrivateKey.exponent2",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyExponent2"},{name:"RSAPrivateKey.coefficient",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"privateKeyCoefficient"}]},u={name:"RSAPublicKey",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"RSAPublicKey.modulus",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"publicKeyModulus"},{name:"RSAPublicKey.exponent",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"publicKeyExponent"}]},a=e.pki.rsa.publicKeyValidator={name:"SubjectPublicKeyInfo",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,captureAsn1:"subjectPublicKeyInfo",value:[{name:"SubjectPublicKeyInfo.AlgorithmIdentifier",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"AlgorithmIdentifier.algorithm",tagClass:n.Class.UNIVERSAL,type:n.Type.OID,constructed:!1,capture:"publicKeyOid"}]},{name:"SubjectPublicKeyInfo.subjectPublicKey",tagClass:n.Class.UNIVERSAL,type:n.Type.BITSTRING,constructed:!1,value:[{name:"SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,optional:!0,captureAsn1:"rsaPublicKey"}]}]},f=function(e){var t;if(e.algorithm in r.oids){t=r.oids[e.algorithm];var i=n.oidToDer(t).getBytes(),s=n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[]),o=n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[]);o.value.push(n.create(n.Class.UNIVERSAL,n.Type.OID,!1,i)),o.value.push(n.create(n.Class.UNIVERSAL,n.Type.NULL,!1,""));var u=n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,e.digest().getBytes());return s.value.push(o),s.value.push(u),n.toDer(s).getBytes()}throw{message:"Unknown message digest algorithm.",algorithm:e.algorithm}},l=function(e,n,r){var i;if(r)i=e.modPow(n.e,n.n);else if(!n.p||!n.q)i=e.modPow(n.d,n.n);else{n.dP||(n.dP=n.d.mod(n.p.subtract(t.ONE))),n.dQ||(n.dQ=n.d.mod(n.q.subtract(t.ONE))),n.qInv||(n.qInv=n.q.modInverse(n.p));var s=e.mod(n.p).modPow(n.dP,n.p),o=e.mod(n.q).modPow(n.dQ,n.q);while(s.compareTo(o)<0)s=s.add(n.p);i=s.subtract(o).multiply(n.qInv).mod(n.p).multiply(n.q).add(o)}return i};r.rsa.encrypt=function(n,r,i){var s=i,o,u=Math.ceil(r.n.bitLength()/8);i!==!1&&i!==!0?(s=i===2,o=c(n,r,i)):(o=e.util.createBuffer(),o.putBytes(n));var a=new t(o.toHex(),16),f=l(a,r,s),h=f.toString(16),p=e.util.createBuffer(),d=u-Math.ceil(h.length/2);while(d>0)p.putByte(0),--d;return p.putBytes(e.util.hexToBytes(h)),p.getBytes()},r.rsa.decrypt=function(n,r,i,s){var o=Math.ceil(r.n.bitLength()/8);if(n.length!==o)throw{message:"Encrypted message length is invalid.",length:n.length,expected:o};var u=new t(e.util.createBuffer(n).toHex(),16);if(u.compareTo(r.n)>=0)throw{message:"Encrypted message is invalid."};var a=l(u,r,i),f=a.toString(16),c=e.util.createBuffer(),p=o-Math.ceil(f.length/2);while(p>0)c.putByte(0),--p;return c.putBytes(e.util.hexToBytes(f)),s!==!1?h(c.getBytes(),r,i):c.getBytes()},r.rsa.createKeyPairGenerationState=function(n,r){typeof n=="string"&&(n=parseInt(n,10)),n=n||2048;var i={nextBytes:function(t){var n=e.random.getBytes(t.length);for(var r=0;r<t.length;++r)t[r]=n.charCodeAt(r)}},s={state:0,bits:n,rng:i,eInt:r||65537,e:new t(null),p:null,q:null,qBits:n>>1,pBits:n-(n>>1),pqState:0,num:null,keys:null};return s.e.fromInt(s.eInt),s},r.rsa.stepKeyPairGenerationState=function(e,n){var s=new t(null);s.fromInt(30);var o=0,u=function(e,t){return e|t},a=+(new Date),f,l=0;while(e.keys===null&&(n<=0||l<n)){if(e.state===0){var c=e.p===null?e.pBits:e.qBits,h=c-1;e.pqState===0?(e.num=new t(c,e.rng),e.num.testBit(h)||e.num.bitwiseTo(t.ONE.shiftLeft(h),u,e.num),e.num.dAddOffset(31-e.num.mod(s).byteValue(),0),o=0,++e.pqState):e.pqState===1?e.num.bitLength()>c?e.pqState=0:e.num.isProbablePrime(v(e.num.bitLength()))?++e.pqState:e.num.dAddOffset(i[o++%8],0):e.pqState===2?e.pqState=e.num.subtract(t.ONE).gcd(e.e).compareTo(t.ONE)===0?3:0:e.pqState===3&&(e.pqState=0,e.p===null?e.p=e.num:e.q=e.num,e.p!==null&&e.q!==null&&++e.state,e.num=null)}else if(e.state===1)e.p.compareTo(e.q)<0&&(e.num=e.p,e.p=e.q,e.q=e.num),++e.state;else if(e.state===2)e.p1=e.p.subtract(t.ONE),e.q1=e.q.subtract(t.ONE),e.phi=e.p1.multiply(e.q1),++e.state;else if(e.state===3)e.phi.gcd(e.e).compareTo(t.ONE)===0?++e.state:(e.p=null,e.q=null,e.state=0);else if(e.state===4)e.n=e.p.multiply(e.q),e.n.bitLength()===e.bits?++e.state:(e.q=null,e.state=0);else if(e.state===5){var p=e.e.modInverse(e.phi);e.keys={privateKey:r.rsa.setPrivateKey(e.n,e.e,p,e.p,e.q,p.mod(e.p1),p.mod(e.q1),e.q.modInverse(e.p)),publicKey:r.rsa.setPublicKey(e.n,e.e)}}f=+(new Date),l+=f-a,a=f}return e.keys!==null},r.rsa.generateKeyPair=function(e,t,n,i){arguments.length===1?typeof e=="object"?(n=e,e=undefined):typeof e=="function"&&(i=e,e=undefined):arguments.length===2?(typeof e=="number"?typeof t=="function"?i=t:n=t:(n=e,i=t,e=undefined),t=undefined):arguments.length===3&&(typeof t=="number"?typeof n=="function"&&(i=n,n=undefined):(i=n,n=t,t=undefined)),n=n||{},e===undefined&&(e=n.bits||2048),t===undefined&&(t=n.e||65537);var s=r.rsa.createKeyPairGenerationState(e,t);if(!i)return r.rsa.stepKeyPairGenerationState(s,0),s.keys;p(s,n,i)},r.setRsaPublicKey=r.rsa.setPublicKey=function(t,i){var s={n:t,e:i};return s.encrypt=function(t,n,i){typeof n=="string"?n=n.toUpperCase():n===undefined&&(n="RSAES-PKCS1-V1_5");if(n==="RSAES-PKCS1-V1_5")n={encode:function(e,t,n){return c(e,t,2).getBytes()}};else if(n==="RSA-OAEP"||n==="RSAES-OAEP")n={encode:function(t,n){return e.pkcs1.encode_rsa_oaep(n,t,i)}};else{if(["RAW","NONE","NULL",null].indexOf(n)===-1)throw{message:'Unsupported encryption scheme: "'+n+'".'};n={encode:function(e){return e}}}var o=n.encode(t,s,!0);return r.rsa.encrypt(o,s,!0)},s.verify=function(e,t,i){typeof i=="string"?i=i.toUpperCase():i===undefined&&(i="RSASSA-PKCS1-V1_5");if(i==="RSASSA-PKCS1-V1_5")i={verify:function(e,t){t=h(t,s,!0);var r=n.fromDer(t);return e===r.value[1].value}};else if(i==="NONE"||i==="NULL"||i===null)i={verify:function(e,t){return t=h(t,s,!0),e===t}};var o=r.rsa.decrypt(t,s,!0,!1);return i.verify(e,o,s.n.bitLength())},s},r.setRsaPrivateKey=r.rsa.setPrivateKey=function(t,n,i,s,o,u,a,l){var c={n:t,e:n,d:i,p:s,q:o,dP:u,dQ:a,qInv:l};return c.decrypt=function(t,n,i){typeof n=="string"?n=n.toUpperCase():n===undefined&&(n="RSAES-PKCS1-V1_5");var s=r.rsa.decrypt(t,c,!1,!1);if(n==="RSAES-PKCS1-V1_5")n={decode:h};else if(n==="RSA-OAEP"||n==="RSAES-OAEP")n={decode:function(t,n){return e.pkcs1.decode_rsa_oaep(n,t,i)}};else{if(["RAW","NONE","NULL",null].indexOf(n)===-1)throw{message:'Unsupported encryption scheme: "'+n+'".'};n={decode:function(e){return e}}}return n.decode(s,c,!1)},c.sign=function(e,t){var n=!1;typeof t=="string"&&(t=t.toUpperCase());if(t===undefined||t==="RSASSA-PKCS1-V1_5")t={encode:f},n=1;else if(t==="NONE"||t==="NULL"||t===null)t={encode:function(){return e}},n=1;var i=t.encode(e,c.n.bitLength());return r.rsa.encrypt(i,c,n)},c},r.wrapRsaPrivateKey=function(e){return n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,n.integerToDer(0).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(r.oids.rsaEncryption).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.NULL,!1,"")]),n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,n.toDer(e).getBytes())])},r.wrapRsaPrivateKey=function(e){return n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,n.integerToDer(0).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(r.oids.rsaEncryption).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.NULL,!1,"")]),n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,n.toDer(e).getBytes())])},r.privateKeyFromAsn1=function(i){var u={},a=[];n.validate(i,s,u,a)&&(i=n.fromDer(e.util.createBuffer(u.privateKey))),u={},a=[];if(!n.validate(i,o,u,a))throw{message:"Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.",errors:a};var f,l,c,h,p,d,v,m;return f=e.util.createBuffer(u.privateKeyModulus).toHex(),l=e.util.createBuffer(u.privateKeyPublicExponent).toHex(),c=e.util.createBuffer(u.privateKeyPrivateExponent).toHex(),h=e.util.createBuffer(u.privateKeyPrime1).toHex(),p=e.util.createBuffer(u.privateKeyPrime2).toHex(),d=e.util.createBuffer(u.privateKeyExponent1).toHex(),v=e.util.createBuffer(u.privateKeyExponent2).toHex(),m=e.util.createBuffer(u.privateKeyCoefficient).toHex(),r.setRsaPrivateKey(new t(f,16),new t(l,16),new t(c,16),new t(h,16),new t(p,16),new t(d,16),new t(v,16),new t(m,16))},r.privateKeyToAsn1=r.privateKeyToRSAPrivateKey=function(e){return n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,n.integerToDer(0).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.n)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.e)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.d)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.p)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.q)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.dP)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.dQ)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.qInv))])},r.publicKeyFromAsn1=function(i){var s={},o=[];if(n.validate(i,a,s,o)){var f=n.derToOid(s.publicKeyOid);if(f!==r.oids.rsaEncryption)throw{message:"Cannot read public key. Unknown OID.",oid:f};i=s.rsaPublicKey}o=[];if(!n.validate(i,u,s,o))throw{message:"Cannot read public key. ASN.1 object does not contain an RSAPublicKey.",errors:o};var l=e.util.createBuffer(s.publicKeyModulus).toHex(),c=e.util.createBuffer(s.publicKeyExponent).toHex();return r.setRsaPublicKey(new t(l,16),new t(c,16))},r.publicKeyToAsn1=r.publicKeyToSubjectPublicKeyInfo=function(e){return n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(r.oids.rsaEncryption).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.NULL,!1,"")]),n.create(n.Class.UNIVERSAL,n.Type.BITSTRING,!1,[r.publicKeyToRSAPublicKey(e)])])},r.publicKeyToRSAPublicKey=function(e){return n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.n)),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,d(e.e))])}}var r="rsa";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/rsa",["require","module","./asn1","./oids","./random","./util","./jsbn","./pkcs1"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function a(e,t,n){var r=[f(e+t)];for(var i=16,s=1;i<n;++s,i+=16)r.push(f(r[s-1]+e+t));return r.join("").substr(0,n)}function f(t){return e.md.md5.create().update(t).digest().getBytes()}if(typeof t=="undefined")var t=e.jsbn.BigInteger;var n=e.asn1,r=e.pki=e.pki||{};r.pbe=e.pbe=e.pbe||{};var i=r.oids,s={name:"EncryptedPrivateKeyInfo",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"EncryptedPrivateKeyInfo.encryptionAlgorithm",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"AlgorithmIdentifier.algorithm",tagClass:n.Class.UNIVERSAL,type:n.Type.OID,constructed:!1,capture:"encryptionOid"},{name:"AlgorithmIdentifier.parameters",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,captureAsn1:"encryptionParams"}]},{name:"EncryptedPrivateKeyInfo.encryptedData",tagClass:n.Class.UNIVERSAL,type:n.Type.OCTETSTRING,constructed:!1,capture:"encryptedData"}]},o={name:"PBES2Algorithms",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"PBES2Algorithms.keyDerivationFunc",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"PBES2Algorithms.keyDerivationFunc.oid",tagClass:n.Class.UNIVERSAL,type:n.Type.OID,constructed:!1,capture:"kdfOid"},{name:"PBES2Algorithms.params",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"PBES2Algorithms.params.salt",tagClass:n.Class.UNIVERSAL,type:n.Type.OCTETSTRING,constructed:!1,capture:"kdfSalt"},{name:"PBES2Algorithms.params.iterationCount",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,onstructed:!0,capture:"kdfIterationCount"}]}]},{name:"PBES2Algorithms.encryptionScheme",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"PBES2Algorithms.encryptionScheme.oid",tagClass:n.Class.UNIVERSAL,type:n.Type.OID,constructed:!1,capture:"encOid"},{name:"PBES2Algorithms.encryptionScheme.iv",tagClass:n.Class.UNIVERSAL,type:n.Type.OCTETSTRING,constructed:!1,capture:"encIv"}]}]},u={name:"pkcs-12PbeParams",tagClass:n.Class.UNIVERSAL,type:n.Type.SEQUENCE,constructed:!0,value:[{name:"pkcs-12PbeParams.salt",tagClass:n.Class.UNIVERSAL,type:n.Type.OCTETSTRING,constructed:!1,capture:"salt"},{name:"pkcs-12PbeParams.iterations",tagClass:n.Class.UNIVERSAL,type:n.Type.INTEGER,constructed:!1,capture:"iterations"}]};r.encryptPrivateKeyInfo=function(t,s,o){o=o||{},o.saltSize=o.saltSize||8,o.count=o.count||2048,o.algorithm=o.algorithm||"aes128";var u=e.random.getBytes(o.saltSize),a=o.count,f=n.integerToDer(a),l,c,h;if(o.algorithm.indexOf("aes")===0){var p;if(o.algorithm==="aes128")l=16,p=i["aes128-CBC"];else if(o.algorithm==="aes192")l=24,p=i["aes192-CBC"];else{if(o.algorithm!=="aes256")throw{message:"Cannot encrypt private key. Unknown encryption algorithm.",algorithm:o.algorithm};l=32,p=i["aes256-CBC"]}var d=e.pkcs5.pbkdf2(s,u,a,l),v=e.random.getBytes(16),m=e.aes.createEncryptionCipher(d);m.start(v),m.update(n.toDer(t)),m.finish(),h=m.output.getBytes(),c=n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(i.pkcs5PBES2).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(i.pkcs5PBKDF2).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,u),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,f.getBytes())])]),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(p).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,v)])])])}else{if(o.algorithm!=="3des")throw{message:"Cannot encrypt private key. Unknown encryption algorithm.",algorithm:o.algorithm};l=24;var g=new e.util.ByteBuffer(u),d=r.pbe.generatePkcs12Key(s,g,1,a,l),v=r.pbe.generatePkcs12Key(s,g,2,a,l),m=e.des.createEncryptionCipher(d);m.start(v),m.update(n.toDer(t)),m.finish(),h=m.output.getBytes(),c=n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OID,!1,n.oidToDer(i["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,u),n.create(n.Class.UNIVERSAL,n.Type.INTEGER,!1,f.getBytes())])])}var y=n.create(n.Class.UNIVERSAL,n.Type.SEQUENCE,!0,[c,n.create(n.Class.UNIVERSAL,n.Type.OCTETSTRING,!1,h)]);return y},r.decryptPrivateKeyInfo=function(t,i){var o=null,u={},a=[];if(!n.validate(t,s,u,a))throw{message:"Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.",errors:a};var f=n.derToOid(u.encryptionOid),l=r.pbe.getCipher(f,u.encryptionParams,i),c=e.util.createBuffer(u.encryptedData);return l.update(c),l.finish()&&(o=n.fromDer(l.output)),o},r.encryptedPrivateKeyToPem=function(t,r){var i={type:"ENCRYPTED PRIVATE KEY",body:n.toDer(t).getBytes()};return e.pem.encode(i,{maxline:r})},r.encryptedPrivateKeyFromPem=function(t){var r=e.pem.decode(t)[0];if(r.type!=="ENCRYPTED PRIVATE KEY")throw{message:'Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".',headerType:r.type};if(r.procType&&r.procType.type==="ENCRYPTED")throw{message:"Could not convert encrypted private key from PEM; PEM is encrypted."};return n.fromDer(r.body)},r.encryptRsaPrivateKey=function(t,i,s){s=s||{};if(!s.legacy){var o=r.wrapRsaPrivateKey(r.privateKeyToAsn1(t));return o=r.encryptPrivateKeyInfo(o,i,s),r.encryptedPrivateKeyToPem(o)}var u,f,l,c;switch(s.algorithm){case"aes128":u="AES-128-CBC",l=16,f=e.random.getBytes(16),c=e.aes.createEncryptionCipher;break;case"aes192":u="AES-192-CBC",l=24,f=e.random.getBytes(16),c=e.aes.createEncryptionCipher;break;case"aes256":u="AES-256-CBC",l=32,f=e.random.getBytes(16),c=e.aes.createEncryptionCipher;break;case"3des":u="DES-EDE3-CBC",l=24,f=e.random.getBytes(8),c=e.des.createEncryptionCipher;break;default:throw{message:'Could not encrypt RSA private key; unsupported encryption algorithm "'+s.algorithm+'".',algorithm:s.algorithm}}var h=a(i,f.substr(0,8),l),p=c(h);p.start(f),p.update(n.toDer(r.privateKeyToAsn1(t))),p.finish();var d={type:"RSA PRIVATE KEY",procType:{version:"4",type:"ENCRYPTED"},dekInfo:{algorithm:u,parameters:e.util.bytesToHex(f).toUpperCase()},body:p.output.getBytes()};return e.pem.encode(d)},r.decryptRsaPrivateKey=function(t,i){var s=null,o=e.pem.decode(t)[0];if(o.type!=="ENCRYPTED PRIVATE KEY"&&o.type!=="PRIVATE KEY"&&o.type!=="RSA PRIVATE KEY")throw{message:'Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".',headerType:o.type};if(o.procType&&o.procType.type==="ENCRYPTED"){var u,f;switch(o.dekInfo.algorithm){case"DES-EDE3-CBC":u=24,f=e.des.createDecryptionCipher;break;case"AES-128-CBC":u=16,f=e.aes.createDecryptionCipher;break;case"AES-192-CBC":u=24,f=e.aes.createDecryptionCipher;break;case"AES-256-CBC":u=32,f=e.aes.createDecryptionCipher;break;case"RC2-40-CBC":u=5,f=function(t){return e.rc2.createDecryptionCipher(t,40)};break;case"RC2-64-CBC":u=8,f=function(t){return e.rc2.createDecryptionCipher(t,64)};break;case"RC2-128-CBC":u=16,f=function(t){return e.rc2.createDecryptionCipher(t,128)};break;default:throw{message:'Could not decrypt private key; unsupported encryption algorithm "'+o.dekInfo.algorithm+'".',algorithm:o.dekInfo.algorithm}}var l=e.util.hexToBytes(o.dekInfo.parameters),c=a(i,l.substr(0,8),u),h=f(c);h.start(l),h.update(e.util.createBuffer(o.body));if(!h.finish())return s;s=h.output.getBytes()}else s=o.body;return o.type==="ENCRYPTED PRIVATE KEY"?s=r.decryptPrivateKeyInfo(n.fromDer(s),i):s=n.fromDer(s),s!==null&&(s=r.privateKeyFromAsn1(s)),s},r.pbe.generatePkcs12Key=function(t,n,r,i,s,o){var u,a;if(typeof o=="undefined"||o===null)o=e.md.sha1.create();var f=o.digestLength,l=o.blockLength,c=new e.util.ByteBuffer,h=new e.util.ByteBuffer;for(a=0;a<t.length;a++)h.putInt16(t.charCodeAt(a));h.putInt16(0);var p=h.length(),d=n.length(),v=new e.util.ByteBuffer;v.fillWithByte(r,l);var m=l*Math.ceil(d/l),g=new e.util.ByteBuffer;for(a=0;a<m;a++)g.putByte(n.at(a%d));var y=l*Math.ceil(p/l),b=new e.util.ByteBuffer;for(a=0;a<y;a++)b.putByte(h.at(a%p));var w=g;w.putBuffer(b);var E=Math.ceil(s/f);for(var S=1;S<=E;S++){var x=new e.util.ByteBuffer;x.putBytes(v.bytes()),x.putBytes(w.bytes());for(var T=0;T<i;T++)o.start(),o.update(x.getBytes()),x=o.digest();var N=new e.util.ByteBuffer;for(a=0;a<l;a++)N.putByte(x.at(a%f));var C=Math.ceil(d/l)+Math.ceil(p/l),k=new e.util.ByteBuffer;for(u=0;u<C;u++){var L=new e.util.ByteBuffer(w.getBytes(l)),A=511;for(a=N.length()-1;a>=0;a--)A>>=8,A+=N.at(a)+L.at(a),L.setAt(a,A&255);k.putBuffer(L)}w=k,c.putBuffer(x)}return c.truncate(c.length()-s),c},r.pbe.getCipher=function(e,t,n){switch(e){case r.oids.pkcs5PBES2:return r.pbe.getCipherForPBES2(e,t,n);case r.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:case r.oids["pbewithSHAAnd40BitRC2-CBC"]:return r.pbe.getCipherForPKCS12PBE(e,t,n);default:throw{message:"Cannot read encrypted PBE data block. Unsupported OID.",oid:e,supportedOids:["pkcs5PBES2","pbeWithSHAAnd3-KeyTripleDES-CBC","pbewithSHAAnd40BitRC2-CBC"]}}},r.pbe.getCipherForPBES2=function(t,i,s){var u={},a=[];if(!n.validate(i,o,u,a))throw{message:"Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.",errors:a};t=n.derToOid(u.kdfOid);if(t!==r.oids.pkcs5PBKDF2)throw{message:"Cannot read encrypted private key. Unsupported key derivation function OID.",oid:t,supportedOids:["pkcs5PBKDF2"]};t=n.derToOid(u.encOid);if(t!==r.oids["aes128-CBC"]&&t!==r.oids["aes192-CBC"]&&t!==r.oids["aes256-CBC"])throw{message:"Cannot read encrypted private key. Unsupported encryption scheme OID.",oid:t,supportedOids:["aes128-CBC","aes192-CBC","aes256-CBC"]};var f=u.kdfSalt,l=e.util.createBuffer(u.kdfIterationCount);l=l.getInt(l.length()<<3);var c;t===r.oids["aes128-CBC"]?c=16:t===r.oids["aes192-CBC"]?c=24:t===r.oids["aes256-CBC"]&&(c=32);var h=e.pkcs5.pbkdf2(s,f,l,c),p=u.encIv,d=e.aes.createDecryptionCipher(h);return d.start(p),d},r.pbe.getCipherForPKCS12PBE=function(t,i,s){var o={},a=[];if(!n.validate(i,u,o,a))throw{message:"Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.",errors:a};var f=e.util.createBuffer(o.salt),l=e.util.createBuffer(o.iterations);l=l.getInt(l.length()<<3);var c,h,p;switch(t){case r.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:c=24,h=8,p=e.des.startDecrypting;break;case r.oids["pbewithSHAAnd40BitRC2-CBC"]:c=5,h=8,p=function(t,n){var r=e.rc2.createDecryptionCipher(t,40);return r.start(n,null),r};break;default:throw{message:"Cannot read PKCS #12 PBE data block. Unsupported OID.",oid:t}}var d=r.pbe.generatePkcs12Key(s,f,1,l,c),v=r.pbe.generatePkcs12Key(s,f,2,l,h);return p(d,v)}}var r="pbe";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pbe",["require","module","./aes","./asn1","./des","./md","./oids","./pem","./pbkdf2","./random","./rc2","./rsa","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.asn1,n=e.pkcs7asn1=e.pkcs7asn1||{};e.pkcs7=e.pkcs7||{},e.pkcs7.asn1=n;var r={name:"ContentInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"ContentInfo.ContentType",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"contentType"},{name:"ContentInfo.content",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,constructed:!0,optional:!0,captureAsn1:"content"}]};n.contentInfoValidator=r;var i={name:"EncryptedContentInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"EncryptedContentInfo.contentType",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"contentType"},{name:"EncryptedContentInfo.contentEncryptionAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"encAlgorithm"},{name:"EncryptedContentInfo.contentEncryptionAlgorithm.parameter",tagClass:t.Class.UNIVERSAL,captureAsn1:"encParameter"}]},{name:"EncryptedContentInfo.encryptedContent",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,capture:"encryptedContent"}]};n.envelopedDataValidator={name:"EnvelopedData",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"EnvelopedData.Version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"version"},{name:"EnvelopedData.RecipientInfos",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,constructed:!0,captureAsn1:"recipientInfos"}].concat(i)},n.encryptedDataValidator={name:"EncryptedData",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"EncryptedData.Version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"version"}].concat(i)};var s={name:"SignerInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"SignerInfo.Version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1},{name:"SignerInfo.IssuerAndSerialNumber",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0},{name:"SignerInfo.DigestAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0},{name:"SignerInfo.AuthenticatedAttributes",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,constructed:!0,optional:!0,capture:"authenticatedAttributes"},{name:"SignerInfo.DigestEncryptionAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0},{name:"SignerInfo.EncryptedDigest",tagClass:t.Class.UNIVERSAL,type:t.Type.OCTETSTRING,constructed:!1,capture:"signature"},{name:"SignerInfo.UnauthenticatedAttributes",tagClass:t.Class.CONTEXT_SPECIFIC,type:1,constructed:!0,optional:!0}]};n.signedDataValidator={name:"SignedData",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"SignedData.Version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"version"},{name:"SignedData.DigestAlgorithms",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,constructed:!0,captureAsn1:"digestAlgorithms"},r,{name:"SignedData.Certificates",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,optional:!0,captureAsn1:"certificates"},{name:"SignedData.CertificateRevocationLists",tagClass:t.Class.CONTEXT_SPECIFIC,type:1,optional:!0,captureAsn1:"crls"},{name:"SignedData.SignerInfos",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,capture:"signerInfos",optional:!0,value:[s]}]},n.recipientInfoValidator={name:"RecipientInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"RecipientInfo.version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"version"},{name:"RecipientInfo.issuerAndSerial",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"RecipientInfo.issuerAndSerial.issuer",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"issuer"},{name:"RecipientInfo.issuerAndSerial.serialNumber",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"serial"}]},{name:"RecipientInfo.keyEncryptionAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"RecipientInfo.keyEncryptionAlgorithm.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"encAlgorithm"},{name:"RecipientInfo.keyEncryptionAlgorithm.parameter",tagClass:t.Class.UNIVERSAL,constructed:!1,captureAsn1:"encParameter"}]},{name:"RecipientInfo.encryptedKey",tagClass:t.Class.UNIVERSAL,type:t.Type.OCTETSTRING,constructed:!1,capture:"encKey"}]}}var r="pkcs7asn1";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pkcs7asn1",["require","module","./asn1","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.mgf=e.mgf||{};var t=e.mgf.mgf1=e.mgf1=e.mgf1||{};t.create=function(t){var n={generate:function(n,r){var i=new e.util.ByteBuffer,s=Math.ceil(r/t.digestLength);for(var o=0;o<s;o++){var u=new e.util.ByteBuffer;u.putInt32(o),t.start(),t.update(n+u.getBytes()),i.putBuffer(t.digest())}return i.truncate(i.length()-r),i.getBytes()}};return n}}var r="mgf1";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/mgf1",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.mgf=e.mgf||{},e.mgf.mgf1=e.mgf1}var r="mgf";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/mgf",["require","module","./mgf1"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.pss=e.pss||{};t.create=function(t,n,r){var i=t.digestLength,s={};return s.verify=function(s,o,u){var a,f=u-1,l=Math.ceil(f/8);o=o.substr(-l);if(l<i+r+2)throw{message:"Inconsistent parameters to PSS signature verification."};if(o.charCodeAt(l-1)!==188)throw{message:"Encoded message does not end in 0xBC."};var c=l-i-1,h=o.substr(0,c),p=o.substr(c,i),d=65280>>8*l-f&255;if((h.charCodeAt(0)&d)!==0)throw{message:"Bits beyond keysize not zero as expected."};var v=n.generate(p,c),m="";for(a=0;a<c;a++)m+=String.fromCharCode(h.charCodeAt(a)^v.charCodeAt(a));m=String.fromCharCode(m.charCodeAt(0)&~d)+m.substr(1);var g=l-i-r-2;for(a=0;a<g;a++)if(m.charCodeAt(a)!==0)throw{message:"Leftmost octets not zero as expected"};if(m.charCodeAt(g)!==1)throw{message:"Inconsistent PSS signature, 0x01 marker not found"};var y=m.substr(-r),b=new e.util.ByteBuffer;b.fillWithByte(0,8),b.putBytes(s),b.putBytes(y),t.start(),t.update(b.getBytes());var w=t.digest().getBytes();return p===w},s.encode=function(s,o){var u,a=o-1,f=Math.ceil(a/8),l=s.digest().getBytes();if(f<i+r+2)throw{message:"Message is too long to encrypt"};var c=e.random.getBytes(r),h=new e.util.ByteBuffer;h.fillWithByte(0,8),h.putBytes(l),h.putBytes(c),t.start(),t.update(h.getBytes());var p=t.digest().getBytes(),d=new e.util.ByteBuffer;d.fillWithByte(0,f-r-i-2),d.putByte(1),d.putBytes(c);var v=d.getBytes(),m=f-i-1,g=n.generate(p,m),y="";for(u=0;u<m;u++)y+=String.fromCharCode(v.charCodeAt(u)^g.charCodeAt(u));var b=65280>>8*f-a&255;return y=String.fromCharCode(y.charCodeAt(0)&~b)+y.substr(1),y+p+String.fromCharCode(188)},s}}var r="pss";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pss",["require","module","./random","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function l(e,t){typeof t=="string"&&(t={shortName:t});var n=null,r;for(var i=0;n===null&&i<e.attributes.length;++i)r=e.attributes[i],t.type&&t.type===r.type?n=r:t.name&&t.name===r.name?n=r:t.shortName&&t.shortName===r.shortName&&(n=r);return n}function p(n){var r=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]),i,s,o=n.attributes;for(var u=0;u<o.length;++u){i=o[u];var a=i.value,f=t.Type.PRINTABLESTRING;"valueTagClass"in i&&(f=i.valueTagClass,f===t.Type.UTF8&&(a=e.util.encodeUtf8(a))),s=t.create(t.Class.UNIVERSAL,t.Type.SET,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(i.type).getBytes()),t.create(t.Class.UNIVERSAL,f,!1,a)])]),r.value.push(s)}return r}function d(e){var n=t.create(t.Class.CONTEXT_SPECIFIC,3,!0,[]),r=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]);n.value.push(r);var i,s;for(var o=0;o<e.length;++o){i=e[o],s=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]),r.value.push(s),s.value.push(t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(i.id).getBytes())),i.critical&&s.value.push(t.create(t.Class.UNIVERSAL,t.Type.BOOLEAN,!1,String.fromCharCode(255)));var u=i.value;typeof i.value!="string"&&(u=t.toDer(u).getBytes()),s.value.push(t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,u))}return n}function v(n){var r={};for(var i=0;i<n.length;++i){var s=n[i];console.log("attr",s);if(s.shortName&&(s.valueTagClass===t.Type.UTF8||s.valueTagClass===t.Type.PRINTABLESTRING||s.valueTagClass===t.Type.IA5String)){var o=s.value;s.valueTagClass===t.Type.UTF8&&(o=e.util.encodeUtf8(s.value)),s.shortName in r?e.util.isArray(r[s.shortName])?r[s.shortName].push(o):r[s.shortName]=[r[s.shortName],o]:r[s.shortName]=o}}return r}function m(e){var t;for(var r=0;r<e.length;++r){t=e[r],typeof t.name=="undefined"&&(t.type&&t.type in n.oids?t.name=n.oids[t.type]:t.shortName&&t.shortName in i&&(t.name=n.oids[i[t.shortName]]));if(typeof t.type=="undefined"){if(!(t.name&&t.name in n.oids))throw{message:"Attribute type not specified.",attribute:t};t.type=n.oids[t.name]}typeof t.shortName=="undefined"&&t.name&&t.name in i&&(t.shortName=i[t.name]);if(typeof t.value=="undefined")throw{message:"Attribute value not specified.",attribute:t}}}function g(e,n){switch(e){case r["RSASSA-PSS"]:var i=[];return n.hash.algorithmOid!==undefined&&i.push(t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.hash.algorithmOid).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.NULL,!1,"")])])),n.mgf.algorithmOid!==undefined&&i.push(t.create(t.Class.CONTEXT_SPECIFIC,1,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.mgf.algorithmOid).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.mgf.hash.algorithmOid).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.NULL,!1,"")])])])),n.saltLength!==undefined&&i.push(t.create(t.Class.CONTEXT_SPECIFIC,2,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(n.saltLength).getBytes())])),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,i);default:return t.create(t.Class.UNIVERSAL,t.Type.NULL,!1,"")}}function y(n){var r=t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[]);if(n.attributes.length===0)return r;var i=n.attributes;for(var s=0;s<i.length;++s){var o=i[s],u=o.value,a=t.Type.UTF8;"valueTagClass"in o&&(a=o.valueTagClass),a===t.Type.UTF8&&(u=e.util.encodeUtf8(u));var f=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(o.type).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,[t.create(t.Class.UNIVERSAL,a,!1,u)])]);r.value.push(f)}return r}var t=e.asn1,n=e.pki=e.pki||{},r=n.oids,i={};i.CN=r.commonName,i.commonName="CN",i.C=r.countryName,i.countryName="C",i.L=r.localityName,i.localityName="L",i.ST=r.stateOrProvinceName,i.stateOrProvinceName="ST",i.O=r.organizationName,i.organizationName="O",i.OU=r.organizationalUnitName,i.organizationalUnitName="OU",i.E=r.emailAddress,i.emailAddress="E";var s=e.pki.rsa.publicKeyValidator,o={name:"Certificate",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"Certificate.TBSCertificate",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"tbsCertificate",value:[{name:"Certificate.TBSCertificate.version",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,constructed:!0,optional:!0,value:[{name:"Certificate.TBSCertificate.version.integer",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"certVersion"}]},{name:"Certificate.TBSCertificate.serialNumber",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"certSerialNumber"},{name:"Certificate.TBSCertificate.signature",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"Certificate.TBSCertificate.signature.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"certinfoSignatureOid"},{name:"Certificate.TBSCertificate.signature.parameters",tagClass:t.Class.UNIVERSAL,optional:!0,captureAsn1:"certinfoSignatureParams"}]},{name:"Certificate.TBSCertificate.issuer",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"certIssuer"},{name:"Certificate.TBSCertificate.validity",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"Certificate.TBSCertificate.validity.notBefore (utc)",tagClass:t.Class.UNIVERSAL,type:t.Type.UTCTIME,constructed:!1,optional:!0,capture:"certValidity1UTCTime"},{name:"Certificate.TBSCertificate.validity.notBefore (generalized)",tagClass:t.Class.UNIVERSAL,type:t.Type.GENERALIZEDTIME,constructed:!1,optional:!0,capture:"certValidity2GeneralizedTime"},{name:"Certificate.TBSCertificate.validity.notAfter (utc)",tagClass:t.Class.UNIVERSAL,type:t.Type.UTCTIME,constructed:!1,optional:!0,capture:"certValidity3UTCTime"},{name:"Certificate.TBSCertificate.validity.notAfter (generalized)",tagClass:t.Class.UNIVERSAL,type:t.Type.GENERALIZEDTIME,constructed:!1,optional:!0,capture:"certValidity4GeneralizedTime"}]},{name:"Certificate.TBSCertificate.subject",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"certSubject"},s,{name:"Certificate.TBSCertificate.issuerUniqueID",tagClass:t.Class.CONTEXT_SPECIFIC,type:1,constructed:!0,optional:!0,value:[{name:"Certificate.TBSCertificate.issuerUniqueID.id",tagClass:t.Class.UNIVERSAL,type:t.Type.BITSTRING,constructed:!1,capture:"certIssuerUniqueId"}]},{name:"Certificate.TBSCertificate.subjectUniqueID",tagClass:t.Class.CONTEXT_SPECIFIC,type:2,constructed:!0,optional:!0,value:[{name:"Certificate.TBSCertificate.subjectUniqueID.id",tagClass:t.Class.UNIVERSAL,type:t.Type.BITSTRING,constructed:!1,capture:"certSubjectUniqueId"}]},{name:"Certificate.TBSCertificate.extensions",tagClass:t.Class.CONTEXT_SPECIFIC,type:3,constructed:!0,captureAsn1:"certExtensions",optional:!0}]},{name:"Certificate.signatureAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"Certificate.signatureAlgorithm.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"certSignatureOid"},{name:"Certificate.TBSCertificate.signature.parameters",tagClass:t.Class.UNIVERSAL,optional:!0,captureAsn1:"certSignatureParams"}]},{name:"Certificate.signatureValue",tagClass:t.Class.UNIVERSAL,type:t.Type.BITSTRING,constructed:!1,capture:"certSignature"}]},u={name:"rsapss",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"rsapss.hashAlgorithm",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,constructed:!0,value:[{name:"rsapss.hashAlgorithm.AlgorithmIdentifier",tagClass:t.Class.UNIVERSAL,type:t.Class.SEQUENCE,constructed:!0,optional:!0,value:[{name:"rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"hashOid"}]}]},{name:"rsapss.maskGenAlgorithm",tagClass:t.Class.CONTEXT_SPECIFIC,type:1,constructed:!0,value:[{name:"rsapss.maskGenAlgorithm.AlgorithmIdentifier",tagClass:t.Class.UNIVERSAL,type:t.Class.SEQUENCE,constructed:!0,optional:!0,value:[{name:"rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"maskGenOid"},{name:"rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"maskGenHashOid"}]}]}]},{name:"rsapss.saltLength",tagClass:t.Class.CONTEXT_SPECIFIC,type:2,optional:!0,value:[{name:"rsapss.saltLength.saltLength",tagClass:t.Class.UNIVERSAL,type:t.Class.INTEGER,constructed:!1,capture:"saltLength"}]},{name:"rsapss.trailerField",tagClass:t.Class.CONTEXT_SPECIFIC,type:3,optional:!0,value:[{name:"rsapss.trailer.trailer",tagClass:t.Class.UNIVERSAL,type:t.Class.INTEGER,constructed:!1,capture:"trailer"}]}]},a={name:"CertificationRequestInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"certificationRequestInfo",value:[{name:"CertificationRequestInfo.integer",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"certificationRequestInfoVersion"},{name:"CertificationRequestInfo.subject",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"certificationRequestInfoSubject"},s,{name:"CertificationRequestInfo.attributes",tagClass:t.Class.CONTEXT_SPECIFIC,type:0,constructed:!0,optional:!0,capture:"certificationRequestInfoAttributes",value:[{name:"CertificationRequestInfo.attributes",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"CertificationRequestInfo.attributes.type",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1},{name:"CertificationRequestInfo.attributes.value",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,constructed:!0}]}]}]},f={name:"CertificationRequest",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,captureAsn1:"csr",value:[a,{name:"CertificationRequest.signatureAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"CertificationRequest.signatureAlgorithm.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"csrSignatureOid"},{name:"CertificationRequest.signatureAlgorithm.parameters",tagClass:t.Class.UNIVERSAL,optional:!0,captureAsn1:"csrSignatureParams"}]},{name:"CertificationRequest.signature",tagClass:t.Class.UNIVERSAL,type:t.Type.BITSTRING,constructed:!1,capture:"csrSignature"}]};n.RDNAttributesAsArray=function(e,n){var s=[],o,u,a;for(var f=0;f<e.value.length;++f){o=e.value[f];for(var l=0;l<o.value.length;++l)a={},u=o.value[l],a.type=t.derToOid(u.value[0].value),a.value=u.value[1].value,a.valueTagClass=u.value[1].type,a.type in r&&(a.name=r[a.type],a.name in i&&(a.shortName=i[a.name])),n&&(n.update(a.type),n.update(a.value)),s.push(a)}return s},n.CRIAttributesAsArray=function(e){var n=[];for(var s=0;s<e.length;++s){var o=e[s],u=t.derToOid(o.value[0].value),a=o.value[1].value;for(var f=0;f<a.length;++f){var l={};l.type=u,l.value=a[f].value,l.valueTagClass=a[f].type,l.type in r&&(l.name=r[l.type],l.name in i&&(l.shortName=i[l.name])),n.push(l)}}return n};var c=function(n){var i=[],s,o,u;for(var a=0;a<n.value.length;++a){u=n.value[a];for(var f=0;f<u.value.length;++f){o=u.value[f],s={},s.id=t.derToOid(o.value[0].value),s.critical=!1,o.value[1].type===t.Type.BOOLEAN?(s.critical=o.value[1].value.charCodeAt(0)!==0,s.value=o.value[2].value):s.value=o.value[1].value;if(s.id in r){s.name=r[s.id];if(s.name==="keyUsage"){var l=t.fromDer(s.value),c=0,h=0;l.value.length>1&&(c=l.value.charCodeAt(1),h=l.value.length>2?l.value.charCodeAt(2):0),s.digitalSignature=(c&128)===128,s.nonRepudiation=(c&64)===64,s.keyEncipherment=(c&32)===32,s.dataEncipherment=(c&16)===16,s.keyAgreement=(c&8)===8,s.keyCertSign=(c&4)===4,s.cRLSign=(c&2)===2,s.encipherOnly=(c&1)===1,s.decipherOnly=(h&128)===128}else if(s.name==="basicConstraints"){var l=t.fromDer(s.value);l.value.length>0&&l.value[0].type===t.Type.BOOLEAN?s.cA=l.value[0].value.charCodeAt(0)!==0:s.cA=!1;var p=null;l.value.length>0&&l.value[0].type===t.Type.INTEGER?p=l.value[0].value:l.value.length>1&&(p=l.value[1].value),p!==null&&(s.pathLenConstraint=t.derToInteger(p))}else if(s.name==="extKeyUsage"){var l=t.fromDer(s.value);for(var d=0;d<l.value.length;++d){var v=t.derToOid(l.value[d].value);v in r?s[r[v]]=!0:s[v]=!0}}else if(s.name==="nsCertType"){var l=t.fromDer(s.value),c=0;l.value.length>1&&(c=l.value.charCodeAt(1)),s.client=(c&128)===128,s.server=(c&64)===64,s.email=(c&32)===32,s.objsign=(c&16)===16,s.reserved=(c&8)===8,s.sslCA=(c&4)===4,s.emailCA=(c&2)===2,s.objCA=(c&1)===1}else if(s.name==="subjectAltName"||s.name==="issuerAltName"){s.altNames=[];var m,l=t.fromDer(s.value);for(var g=0;g<l.value.length;++g){m=l.value[g];var y={type:m.type,value:m.value};s.altNames.push(y);switch(m.type){case 1:case 2:case 6:break;case 7:y.ip=e.util.bytesToIP(m.value);break;case 8:y.oid=t.derToOid(m.value);break;default:}}}else if(s.name==="subjectKeyIdentifier"){var l=t.fromDer(s.value);s.subjectKeyIdentifier=e.util.bytesToHex(l.value)}}i.push(s)}}return i},h=function(e,n,i){var s={};if(e!==r["RSASSA-PSS"])return s;i&&(s={hash:{algorithmOid:r.sha1},mgf:{algorithmOid:r.mgf1,hash:{algorithmOid:r.sha1}},saltLength:20});var o={},a=[];if(!t.validate(n,u,o,a))throw{message:"Cannot read RSASSA-PSS parameter block.",errors:a};return o.hashOid!==undefined&&(s.hash=s.hash||{},s.hash.algorithmOid=t.derToOid(o.hashOid)),o.maskGenOid!==undefined&&(s.mgf=s.mgf||{},s.mgf.algorithmOid=t.derToOid(o.maskGenOid),s.mgf.hash=s.mgf.hash||{},s.mgf.hash.algorithmOid=t.derToOid(o.maskGenHashOid)),o.saltLength!==undefined&&(s.saltLength=o.saltLength.charCodeAt(0)),s};n.certificateFromPem=function(r,i,s){var o=e.pem.decode(r)[0];if(o.type!=="CERTIFICATE"&&o.type!=="X509 CERTIFICATE"&&o.type!=="TRUSTED CERTIFICATE")throw{message:'Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".',headerType:o.type};if(o.procType&&o.procType.type==="ENCRYPTED")throw{message:"Could not convert certificate from PEM; PEM is encrypted."};var u=t.fromDer(o.body,s);return n.certificateFromAsn1(u,i)},n.certificateToPem=function(r,i){var s={type:"CERTIFICATE",body:t.toDer(n.certificateToAsn1(r)).getBytes()};return e.pem.encode(s,{maxline:i})},n.publicKeyFromPem=function(r){var i=e.pem.decode(r)[0];if(i.type!=="PUBLIC KEY"&&i.type!=="RSA PUBLIC KEY")throw{message:'Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".',headerType:i.type};if(i.procType&&i.procType.type==="ENCRYPTED")throw{message:"Could not convert public key from PEM; PEM is encrypted."};var s=t.fromDer(i.body);return n.publicKeyFromAsn1(s)},n.publicKeyToPem=function(r,i){var s={type:"PUBLIC KEY",body:t.toDer(n.publicKeyToAsn1(r)).getBytes()};return e.pem.encode(s,{maxline:i})},n.publicKeyToRSAPublicKeyPem=function(r,i){var s={type:"RSA PUBLIC KEY",body:t.toDer(n.publicKeyToRSAPublicKey(r)).getBytes()};return e.pem.encode(s,{maxline:i})},n.certificationRequestFromPem=function(r,i,s){var o=e.pem.decode(r)[0];if(o.type!=="CERTIFICATE REQUEST")throw{message:'Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".',headerType:o.type};if(o.procType&&o.procType.type==="ENCRYPTED")throw{message:"Could not convert certification request from PEM; PEM is encrypted."};var u=t.fromDer(o.body,s);return n.certificationRequestFromAsn1(u,i)},n.certificationRequestToPem=function(r,i){var s={type:"CERTIFICATE REQUEST",body:t.toDer(n.certificationRequestToAsn1(r)).getBytes()};return e.pem.encode(s,{maxline:i})},n.createCertificate=function(){var i={};return i.version=2,i.serialNumber="00",i.signatureOid=null,i.signature=null,i.siginfo={},i.siginfo.algorithmOid=null,i.validity={},i.validity.notBefore=new Date,i.validity.notAfter=new Date,i.issuer={},i.issuer.getField=function(e){return l(i.issuer,e)},i.issuer.addField=function(e){m([e]),i.issuer.attributes.push(e)},i.issuer.attributes=[],i.issuer.hash=null,i.subject={},i.subject.getField=function(e){return l(i.subject,e)},i.subject.addField=function(e){m([e]),i.subject.attributes.push(e)},i.subject.attributes=[],i.subject.hash=null,i.extensions=[],i.publicKey=null,i.md=null,i.setSubject=function(e,t){m(e),i.subject.attributes=e,delete i.subject.uniqueId,t&&(i.subject.uniqueId=t),i.subject.hash=null},i.setIssuer=function(e,t){m(e),i.issuer.attributes=e,delete i.issuer.uniqueId,t&&(i.issuer.uniqueId=t),i.issuer.hash=null},i.setExtensions=function(s){var o;for(var u=0;u<s.length;++u){o=s[u],typeof o.name=="undefined"&&o.id&&o.id in n.oids&&(o.name=n.oids[o.id]);if(typeof o.id=="undefined"){if(!(o.name&&o.name in n.oids))throw{message:"Extension ID not specified.",extension:o};o.id=n.oids[o.name]}if(typeof o.value=="undefined"){if(o.name==="keyUsage"){var a=0,f=0,l=0;o.digitalSignature&&(f|=128,a=7),o.nonRepudiation&&(f|=64,a=6),o.keyEncipherment&&(f|=32,a=5),o.dataEncipherment&&(f|=16,a=4),o.keyAgreement&&(f|=8,a=3),o.keyCertSign&&(f|=4,a=2),o.cRLSign&&(f|=2,a=1),o.encipherOnly&&(f|=1,a=0),o.decipherOnly&&(l|=128,a=7);var c=String.fromCharCode(a);l!==0?c+=String.fromCharCode(f)+String.fromCharCode(l):f!==0&&(c+=String.fromCharCode(f)),o.value=t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,c)}else if(o.name==="basicConstraints")o.value=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]),o.cA&&o.value.value.push(t.create(t.Class.UNIVERSAL,t.Type.BOOLEAN,!1,String.fromCharCode(255))),"pathLenConstraint"in o&&o.value.value.push(t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(o.pathLenConstraint).getBytes()));else if(o.name==="extKeyUsage"){o.value=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]);var h=o.value.value;for(var p in o){if(o[p]!==!0)continue;p in r?h.push(t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(r[p]).getBytes())):p.indexOf(".")!==-1&&h.push(t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(p).getBytes()))}}else if(o.name==="nsCertType"){var a=0,f=0;o.client&&(f|=128,a=7),o.server&&(f|=64,a=6),o.email&&(f|=32,a=5),o.objsign&&(f|=16,a=4),o.reserved&&(f|=8,a=3),o.sslCA&&(f|=4,a=2),o.emailCA&&(f|=2,a=1),o.objCA&&(f|=1,a=0);var c=String.fromCharCode(a);f!==0&&(c+=String.fromCharCode(f)),o.value=t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,c)}else if(o.name==="subjectAltName"||o.name==="issuerAltName"){o.value=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[]);var d;for(var v=0;v<o.altNames.length;++v){d=o.altNames[v];var c=d.value;if(d.type===7&&d.ip){c=e.util.bytesFromIP(d.ip);if(c===null)throw{message:'Extension "ip" value is not a valid IPv4 or IPv6 address.',extension:o}}else d.type===8&&(d.oid?c=t.oidToDer(t.oidToDer(d.oid)):c=t.oidToDer(c));o.value.value.push(t.create(t.Class.CONTEXT_SPECIFIC,d.type,!1,c))}}else if(o.name==="subjectKeyIdentifier"){var m=i.generateSubjectKeyIdentifier();o.subjectKeyIdentifier=m.toHex(),o.value=t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,m.getBytes())}if(typeof o.value=="undefined")throw{message:"Extension value not specified.",extension:o}}}i.extensions=s},i.getExtension=function(e){typeof e=="string"&&(e={name:e});var t=null,n;for(var r=0;t===null&&r<i.extensions.length;++r)n=i.extensions[r],e.id&&n.id===e.id?t=n:e.name&&n.name===e.name&&(t=n);return t},i.sign=function(s,o){i.md=o||e.md.sha1.create();var u=r[i.md.algorithm+"WithRSAEncryption"];if(!u)throw{message:"Could not compute certificate digest. Unknown message digest algorithm OID.",algorithm:i.md.algorithm};i.signatureOid=i.siginfo.algorithmOid=u,i.tbsCertificate=n.getTBSCertificate(i);var a=t.toDer(i.tbsCertificate);i.md.update(a.getBytes()),i.signature=s.sign(i.md)},i.verify=function(s){var o=!1;if(!i.issued(s)){var u=s.issuer,a=i.subject;throw{message:"The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.",expectedIssuer:u.attributes,actualIssuer:a.attributes}}var f=s.md;if(f===null){if(s.signatureOid in r){var l=r[s.signatureOid];switch(l){case"sha1WithRSAEncryption":f=e.md.sha1.create();break;case"md5WithRSAEncryption":f=e.md.md5.create();break;case"sha256WithRSAEncryption":f=e.md.sha256.create();break;case"RSASSA-PSS":f=e.md.sha256.create()}}if(f===null)throw{message:"Could not compute certificate digest. Unknown signature OID.",signatureOid:s.signatureOid};var c=s.tbsCertificate||n.getTBSCertificate(s),h=t.toDer(c);f.update(h.getBytes())}if(f!==null){var p=undefined;switch(s.signatureOid){case r.sha1WithRSAEncryption:p=undefined;break;case r["RSASSA-PSS"]:var d,v;d=r[s.signatureParameters.mgf.hash.algorithmOid];if(d===undefined||e.md[d]===undefined)throw{message:"Unsupported MGF hash function.",oid:s.signatureParameters.mgf.hash.algorithmOid,name:d};v=r[s.signatureParameters.mgf.algorithmOid];if(v===undefined||e.mgf[v]===undefined)throw{message:"Unsupported MGF function.",oid:s.signatureParameters.mgf.algorithmOid,name:v};v=e.mgf[v].create(e.md[d].create()),d=r[s.signatureParameters.hash.algorithmOid];if(d===undefined||e.md[d]===undefined)throw{message:"Unsupported RSASSA-PSS hash function.",oid:s.signatureParameters.hash.algorithmOid,name:d};p=e.pss.create(e.md[d].create(),v,s.signatureParameters.saltLength)}o=i.publicKey.verify(f.digest().getBytes(),s.signature,p)}return o},i.isIssuer=function(e){var t=!1,n=i.issuer,r=e.subject;if(n.hash&&r.hash)t=n.hash===r.hash;else if(n.attributes.length===r.attributes.length){t=!0;var s,o;for(var u=0;t&&u<n.attributes.length;++u){s=n.attributes[u],o=r.attributes[u];if(s.type!==o.type||s.value!==o.value)t=!1}}return t},i.issued=function(e){return e.isIssuer(i)},i.generateSubjectKeyIdentifier=function(){var r=t.toDer(n.publicKeyToRSAPublicKey(i.publicKey)),s=e.md.sha1.create();return s.update(r.getBytes()),s.digest()},i.verifySubjectKeyIdentifier=function(){var t=r.subjectKeyIdentifier;for(var n=0;n<i.extensions.length;++n){var s=i.extensions[n];if(s.id===t){var o=i.generateSubjectKeyIdentifier().getBytes();return e.util.hexToBytes(s.subjectKeyIdentifier)===o}}return!1},i},n.certificateFromAsn1=function(i,s){var u={},a=[];if(!t.validate(i,o,u,a))throw{message:"Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.",errors:a};if(typeof u.certSignature!="string"){var f="\0";for(var p=0;p<u.certSignature.length;++p)f+=t.toDer(u.certSignature[p]).getBytes();u.certSignature=f}var d=t.derToOid(u.publicKeyOid);if(d!==n.oids.rsaEncryption)throw{message:"Cannot read public key. OID is not RSA."};var v=n.createCertificate();v.version=u.certVersion?u.certVersion.charCodeAt(0):0;var g=e.util.createBuffer(u.certSerialNumber);v.serialNumber=g.toHex(),v.signatureOid=e.asn1.derToOid(u.certSignatureOid),v.signatureParameters=h(v.signatureOid,u.certSignatureParams,!0),v.siginfo.algorithmOid=e.asn1.derToOid(u.certinfoSignatureOid),v.siginfo.parameters=h(v.siginfo.algorithmOid,u.certinfoSignatureParams,!1);var y=e.util.createBuffer(u.certSignature);++y.read,v.signature=y.getBytes();var b=[];u.certValidity1UTCTime!==undefined&&b.push(t.utcTimeToDate(u.certValidity1UTCTime)),u.certValidity2GeneralizedTime!==undefined&&b.push(t.generalizedTimeToDate(u.certValidity2GeneralizedTime)),u.certValidity3UTCTime!==undefined&&b.push(t.utcTimeToDate(u.certValidity3UTCTime)),u.certValidity4GeneralizedTime!==undefined&&b.push(t.generalizedTimeToDate(u.certValidity4GeneralizedTime));if(b.length>2)throw{message:"Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate."};if(b.length<2)throw{message:"Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime."};v.validity.notBefore=b[0],v.validity.notAfter=b[1],v.tbsCertificate=u.tbsCertificate;if(s){v.md=null;if(v.signatureOid in r){var d=r[v.signatureOid];switch(d){case"sha1WithRSAEncryption":v.md=e.md.sha1.create();break;case"md5WithRSAEncryption":v.md=e.md.md5.create();break;case"sha256WithRSAEncryption":v.md=e.md.sha256.create();break;case"RSASSA-PSS":v.md=e.md.sha256.create()}}if(v.md===null)throw{message:"Could not compute certificate digest. Unknown signature OID.",signatureOid:v.signatureOid};var w=t.toDer(v.tbsCertificate);v.md.update(w.getBytes())}var E=e.md.sha1.create();v.issuer.getField=function(e){return l(v.issuer,e)},v.issuer.addField=function(e){m([e]),v.issuer.attributes.push(e)},v.issuer.attributes=n.RDNAttributesAsArray(u.certIssuer,E),u.certIssuerUniqueId&&(v.issuer.uniqueId=u.certIssuerUniqueId),v.issuer.hash=E.digest().toHex();var S=e.md.sha1.create();return v.subject.getField=function(e){return l(v.subject,e)},v.subject.addField=function(e){m([e]),v.subject.attributes.push(e)},v.subject.attributes=n.RDNAttributesAsArray(u.certSubject,S),u.certSubjectUniqueId&&(v.subject.uniqueId=u.certSubjectUniqueId),v.subject.hash=S.digest().toHex(),u.certExtensions?v.extensions=c(u.certExtensions):v.extensions=[],v.publicKey=n.publicKeyFromAsn1(u.subjectPublicKeyInfo),v},n.certificationRequestFromAsn1=function(i,s){var o={},u=[];if(!t.validate(i,f,o,u))throw{message:"Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.",errors:u};if(typeof o.csrSignature!="string"){var a="\0";for(var c=0;c<o.csrSignature.length;++c)a+=t.toDer(o.csrSignature[c]).getBytes();o.csrSignature=a}var p=t.derToOid(o.publicKeyOid);if(p!==n.oids.rsaEncryption)throw{message:"Cannot read public key. OID is not RSA."};var d=n.createCertificationRequest();d.version=o.csrVersion?o.csrVersion.charCodeAt(0):0,d.signatureOid=e.asn1.derToOid(o.csrSignatureOid),d.signatureParameters=h(d.signatureOid,o.csrSignatureParams,!0),d.siginfo.algorithmOid=e.asn1.derToOid(o.csrSignatureOid),d.siginfo.parameters=h(d.siginfo.algorithmOid,o.csrSignatureParams,!1);var v=e.util.createBuffer(o.csrSignature);++v.read,d.signature=v.getBytes(),d.certificationRequestInfo=o.certificationRequestInfo;if(s){d.md=null;if(d.signatureOid in r){var p=r[d.signatureOid];switch(p){case"sha1WithRSAEncryption":d.md=e.md.sha1.create();break;case"md5WithRSAEncryption":d.md=e.md.md5.create();break;case"sha256WithRSAEncryption":d.md=e.md.sha256.create();break;case"RSASSA-PSS":d.md=e.md.sha256.create()}}if(d.md===null)throw{message:"Could not compute certification request digest. Unknown signature OID.",signatureOid:d.signatureOid};var g=t.toDer(d.certificationRequestInfo);d.md.update(g.getBytes())}var y=e.md.sha1.create();return d.subject.getField=function(e){return l(d.subject,e)},d.subject.addField=function(e){m([e]),d.subject.attributes.push(e)},d.subject.attributes=n.RDNAttributesAsArray(o.certificationRequestInfoSubject,y),d.subject.hash=y.digest().toHex(),d.publicKey=n.publicKeyFromAsn1(o.subjectPublicKeyInfo),d.getAttribute=function(e){return l(d.attributes,e)},d.addAttribute=function(e){m([e]),d.attributes.push(e)},d.attributes=n.CRIAttributesAsArray(o.certificationRequestInfoAttributes),d},n.createCertificationRequest=function(){var i={};return i.version=0,i.signatureOid=null,i.signature=null,i.siginfo={},i.siginfo.algorithmOid=null,i.subject={},i.subject.getField=function(e){return l(i.subject,e)},i.subject.addField=function(e){m([e]),i.subject.attributes.push(e)},i.subject.attributes=[],i.subject.hash=null,i.publicKey=null,i.attributes=[],i.getAttribute=function(e){return l(i.attributes,e)},i.addAttribute=function(e){m([e]),i.attributes.push(e)},i.md=null,i.setSubject=function(e){m(e),i.subject.attributes=e,i.subject.hash=null},i.setAttributes=function(e){m(e),i.attributes=e},i.sign=function(s,o){i.md=o||e.md.sha1.create();var u=r[i.md.algorithm+"WithRSAEncryption"];if(!u)throw{message:"Could not compute certification request digest. Unknown message digest algorithm OID.",algorithm:i.md.algorithm};i.signatureOid=i.siginfo.algorithmOid=u,i.certificationRequestInfo=n.getCertificationRequestInfo(i);var a=t.toDer(i.certificationRequestInfo);i.md.update(a.getBytes()),i.signature=s.sign(i.md)},i.verify=function(){var s=!1,o=i.md;if(o===null){if(i.signatureOid in r){var u=r[i.signatureOid];switch(u){case"sha1WithRSAEncryption":o=e.md.sha1.create();break;case"md5WithRSAEncryption":o=e.md.md5.create();break;case"sha256WithRSAEncryption":o=e.md.sha256.create();break;case"RSASSA-PSS":o=e.md.sha256.create()}}if(o===null)throw{message:"Could not compute certification request digest. Unknown signature OID.",signatureOid:i.signatureOid};var a=i.certificationRequestInfo||n.getCertificationRequestInfo(i),f=t.toDer(a);o.update(f.getBytes())}if(o!==null){var l;switch(i.signatureOid){case r.sha1WithRSAEncryption:break;case r["RSASSA-PSS"]:var c,h;c=r[i.signatureParameters.mgf.hash.algorithmOid];if(c===undefined||e.md[c]===undefined)throw{message:"Unsupported MGF hash function.",oid:i.signatureParameters.mgf.hash.algorithmOid,name:c};h=r[i.signatureParameters.mgf.algorithmOid];if(h===undefined||e.mgf[h]===undefined)throw{message:"Unsupported MGF function.",oid:i.signatureParameters.mgf.algorithmOid,name:h};h=e.mgf[h].create(e.md[c].create()),c=r[i.signatureParameters.hash.algorithmOid];if(c===undefined||e.md[c]===undefined)throw{message:"Unsupported RSASSA-PSS hash function.",oid:i.signatureParameters.hash.algorithmOid,name:c};l=e.pss.create(e.md[c].create(),h,i.signatureParameters.saltLength)}s=i.publicKey.verify(o.digest().getBytes(),i.signature,l)}return s},i},n.getTBSCertificate=function(r){var i=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(r.version).getBytes())]),t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,e.util.hexToBytes(r.serialNumber)),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(r.siginfo.algorithmOid).getBytes()),g(r.siginfo.algorithmOid,r.siginfo.parameters)]),p(r.issuer),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.UTCTIME,!1,t.dateToUtcTime(r.validity.notBefore)),t.create(t.Class.UNIVERSAL,t.Type.UTCTIME,!1,t.dateToUtcTime(r.validity.notAfter))]),p(r.subject),n.publicKeyToAsn1(r.publicKey)]);return r.issuer.uniqueId&&i.value.push(t.create(t.Class.CONTEXT_SPECIFIC,1,!0,[t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,String.fromCharCode(0)+r.issuer.uniqueId)])),r.subject.uniqueId&&i.value.push(t.create(t.Class.CONTEXT_SPECIFIC,2,!0,[t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,String.fromCharCode(0)+r.subject.uniqueId)])),r.extensions.length>0&&i.value.push(d(r.extensions)),i},n.getCertificationRequestInfo=function(e){var r=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(e.version).getBytes()),p(e.subject),n.publicKeyToAsn1(e.publicKey),y(e)]);return r},n.distinguishedNameToAsn1=function(e){return p(e)},n.certificateToAsn1=function(e){var r=e.tbsCertificate||n.getTBSCertificate(e);return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[r,t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(e.signatureOid).getBytes()),g(e.signatureOid,e.signatureParameters)]),t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,String.fromCharCode(0)+e.signature)])},n.certificationRequestToAsn1=function(e){var r=e.certificationRequestInfo||n.getCertificationRequestInfo(e);return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[r,t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(e.signatureOid).getBytes()),g(e.signatureOid,e.signatureParameters)]),t.create(t.Class.UNIVERSAL,t.Type.BITSTRING,!1,String.fromCharCode(0)+e.signature)])},n.createCaStore=function(t){var r={certs:{}};r.getIssuer=function(t){var i=null;if(!t.issuer.hash){var s=e.md.sha1.create();t.issuer.attributes=n.RDNAttributesAsArray(p(t.issuer),s),t.issuer.hash=s.digest().toHex()}if(t.issuer.hash in r.certs){i=r.certs[t.issuer.hash];if(e.util.isArray(i))throw{message:"Resolving multiple issuer matches not implemented yet."}}return i},r.addCertificate=function(t){typeof t=="string"&&(t=e.pki.certificateFromPem(t));if(!t.subject.hash){var i=e.md.sha1.create();t.subject.attributes=n.RDNAttributesAsArray(p(t.subject),i),t.subject.hash=i.digest().toHex()}if(t.subject.hash in r.certs){var s=r.certs[t.subject.hash];e.util.isArray(s)||(s=[s]),s.push(t)}else r.certs[t.subject.hash]=t};if(t)for(var i=0;i<t.length;++i){var s=t[i];r.addCertificate(s)}return r},n.certificateError={bad_certificate:"forge.pki.BadCertificate",unsupported_certificate:"forge.pki.UnsupportedCertificate",certificate_revoked:"forge.pki.CertificateRevoked",certificate_expired:"forge.pki.CertificateExpired",certificate_unknown:"forge.pki.CertificateUnknown",unknown_ca:"forge.pki.UnknownCertificateAuthority"},n.verifyCertificateChain=function(t,r,i){r=r.slice(0);var s=r.slice(0),o=new Date,u=!0,a=null,f=0,l=null;do{var c=r.shift();if(o<c.validity.notBefore||o>c.validity.notAfter)a={message:"Certificate is not valid yet or has expired.",error:n.certificateError.certificate_expired,notBefore:c.validity.notBefore,notAfter:c.validity.notAfter,now:o};else{var h=!1;if(r.length>0){l=r[0];try{h=l.verify(c)}catch(p){}}else{var d=t.getIssuer(c);if(d===null)a={message:"Certificate is not trusted.",error:n.certificateError.unknown_ca};else{e.util.isArray(d)||(d=[d]);while(!h&&d.length>0){l=d.shift();try{h=l.verify(c)}catch(p){}}}}a===null&&!h&&(a={message:"Certificate signature is invalid.",error:n.certificateError.bad_certificate})}a===null&&!c.isIssuer(l)&&(a={message:"Certificate issuer is invalid.",error:n.certificateError.bad_certificate});if(a===null){var v={keyUsage:!0,basicConstraints:!0};for(var m=0;a===null&&m<c.extensions.length;++m){var g=c.extensions[m];g.critical&&!(g.name in v)&&(a={message:"Certificate has an unsupported critical extension.",error:n.certificateError.unsupported_certificate})}}if(!u||r.length===0&&!l){var y=c.getExtension("basicConstraints"),b=c.getExtension("keyUsage");b!==null&&(!b.keyCertSign||y===null)&&(a={message:"Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",error:n.certificateError.bad_certificate}),a===null&&y!==null&&!y.cA&&(a={message:"Certificate basicConstraints indicates the certificate is not a CA.",error:n.certificateError.bad_certificate});if(a===null&&b!==null&&"pathLenConstraint"in y){var w=0;for(var m=1;m<r.length-1;++m)r[m].isIssuer(r[m])&&++w;var E=y.pathLenConstraint+1;r.length-w>E&&(a={message:"Certificate basicConstraints pathLenConstraint violated.",error:n.certificateError.bad_certificate})}}var S=a===null?!0:a.error,x=i?i(S,f,s):S;if(x!==!0){S===!0&&(a={message:"The application rejected the certificate.",error:n.certificateError.bad_certificate});if(x||x===0)typeof x=="object"&&!e.util.isArray(x)?(x.message&&(a.message=x.message),x.error&&(a.error=x.error)):typeof x=="string"&&(a.error=x);throw a}a=null,u=!1,++f}while(r.length>0);return!0}}var r="x509";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n.pki}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/x509",["require","module","./aes","./asn1","./des","./md","./mgf","./oids","./pem","./pss","./rsa","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function f(e,t,n,r){var i=[];for(var s=0;s<e.length;s++)for(var o=0;o<e[s].safeBags.length;o++){var u=e[s].safeBags[o];if(r!==undefined&&u.type!==r)continue;u.attributes[t]!==undefined&&u.attributes[t].indexOf(n)>=0&&i.push(u)}return i}function l(e,r,s,o){r=t.fromDer(r,s);if(r.tagClass!==t.Class.UNIVERSAL||r.type!==t.Type.SEQUENCE||r.constructed!==!0)throw{message:"PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo"};for(var u=0;u<r.value.length;u++){var a=r.value[u],f={},l=[];if(!t.validate(a,i,f,l))throw{message:"Cannot read ContentInfo.",errors:l};var p={encrypted:!1},d=null,v=f.content.value[0];switch(t.derToOid(f.contentType)){case n.oids.data:if(v.tagClass!==t.Class.UNIVERSAL||v.type!==t.Type.OCTETSTRING)throw{message:"PKCS#12 SafeContents Data is not an OCTET STRING."};d=v.value;break;case n.oids.encryptedData:if(o===undefined)throw{message:"Found PKCS#12 Encrypted SafeContents Data but no password available."};d=c(v,o),p.encrypted=!0;break;default:throw{message:"Unsupported PKCS#12 contentType.",contentType:t.derToOid(f.contentType)}}p.safeBags=h(d,s,o),e.safeContents.push(p)}}function c(r,i){var s={},o=[];if(!t.validate(r,e.pkcs7.asn1.encryptedDataValidator,s,o))throw{message:"Cannot read EncryptedContentInfo. ",errors:o};var u=t.derToOid(s.contentType);if(u!==n.oids.data)throw{message:"PKCS#12 EncryptedContentInfo ContentType is not Data.",oid:u};u=t.derToOid(s.encAlgorithm);var a=n.pbe.getCipher(u,s.encParameter,i),f=e.util.createBuffer(s.encryptedContent);a.update(f);if(!a.finish())throw{message:"Failed to decrypt PKCS#12 SafeContents."};return a.output.getBytes()}function h(e,r,i){e=t.fromDer(e,r);if(e.tagClass!==t.Class.UNIVERSAL||e.type!==t.Type.SEQUENCE||e.constructed!==!0)throw{message:"PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag"};var s=[];for(var u=0;u<e.value.length;u++){var f=e.value[u],l={},c=[];if(!t.validate(f,o,l,c))throw{message:"Cannot read SafeBag.",errors:c};var h={type:t.derToOid(l.bagId),attributes:p(l.bagAttributes)};s.push(h);var d,v,m=l.bagValue.value[0];switch(h.type){case n.oids.pkcs8ShroudedKeyBag:if(i===undefined)throw{message:"Found PKCS#8 ShroudedKeyBag but no password available."};m=n.decryptPrivateKeyInfo(m,i);if(m===null)throw{message:"Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?"};case n.oids.keyBag:h.key=n.privateKeyFromAsn1(m);continue;case n.oids.certBag:d=a,v=function(){if(t.derToOid(l.certId)!==n.oids.x509Certificate)throw{message:"Unsupported certificate type, only X.509 supported.",oid:t.derToOid(l.certId)};h.cert=n.certificateFromAsn1(t.fromDer(l.cert,r),!0)};break;default:throw{message:"Unsupported PKCS#12 SafeBag type.",oid:h.type}}if(d!==undefined&&!t.validate(m,d,l,c))throw{message:"Cannot read PKCS#12 "+d.name,errors:c};v()}return s}function p(e){var r={};if(e!==undefined)for(var i=0;i<e.length;++i){var s={},o=[];if(!t.validate(e[i],u,s,o))throw{message:"Cannot read PKCS#12 BagAttribute.",errors:o};var a=t.derToOid(s.oid);if(n.oids[a]===undefined)continue;r[n.oids[a]]=[];for(var f=0;f<s.values.length;++f)r[n.oids[a]].push(s.values[f].value)}return r}var t=e.asn1,n=e.pki,r=e.pkcs12=e.pkcs12||{},i={name:"ContentInfo",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"ContentInfo.contentType",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"contentType"},{name:"ContentInfo.content",tagClass:t.Class.CONTEXT_SPECIFIC,constructed:!0,captureAsn1:"content"}]},s={name:"PFX",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"PFX.version",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,capture:"version"},i,{name:"PFX.macData",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,optional:!0,captureAsn1:"mac",value:[{name:"PFX.macData.mac",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"PFX.macData.mac.digestAlgorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"PFX.macData.mac.digestAlgorithm.algorithm",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"macAlgorithm"},{name:"PFX.macData.mac.digestAlgorithm.parameters",tagClass:t.Class.UNIVERSAL,captureAsn1:"macAlgorithmParameters"}]},{name:"PFX.macData.mac.digest",tagClass:t.Class.UNIVERSAL,type:t.Type.OCTETSTRING,constructed:!1,capture:"macDigest"}]},{name:"PFX.macData.macSalt",tagClass:t.Class.UNIVERSAL,type:t.Type.OCTETSTRING,constructed:!1,capture:"macSalt"},{name:"PFX.macData.iterations",tagClass:t.Class.UNIVERSAL,type:t.Type.INTEGER,constructed:!1,optional:!0,capture:"macIterations"}]}]},o={name:"SafeBag",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"SafeBag.bagId",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"bagId"},{name:"SafeBag.bagValue",tagClass:t.Class.CONTEXT_SPECIFIC,constructed:!0,captureAsn1:"bagValue"},{name:"SafeBag.bagAttributes",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,constructed:!0,optional:!0,capture:"bagAttributes"}]},u={name:"Attribute",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"Attribute.attrId",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"oid"},{name:"Attribute.attrValues",tagClass:t.Class.UNIVERSAL,type:t.Type.SET,constructed:!0,capture:"values"}]},a={name:"CertBag",tagClass:t.Class.UNIVERSAL,type:t.Type.SEQUENCE,constructed:!0,value:[{name:"CertBag.certId",tagClass:t.Class.UNIVERSAL,type:t.Type.OID,constructed:!1,capture:"certId"},{name:"CertBag.certValue",tagClass:t.Class.CONTEXT_SPECIFIC,constructed:!0,value:[{name:"CertBag.certValue[0]",tagClass:t.Class.UNIVERSAL,type:t.Class.OCTETSTRING,constructed:!1,capture:"cert"}]}]};r.pkcs12FromAsn1=function(i,o,u){typeof o=="string"?(u=o,o=!0):o===undefined&&(o=!0);var a={},c=[];if(!t.validate(i,s,a,c))throw{message:"Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.",errors:c};var h={version:a.version.charCodeAt(0),safeContents:[],getBags:function(t){var n={},r;return"localKeyId"in t?r=t.localKeyId:"localKeyIdHex"in t&&(r=e.util.hexToBytes(t.localKeyIdHex)),r!==undefined&&(n.localKeyId=f(h.safeContents,"localKeyId",r,t.bagType)),"friendlyName"in t&&(n.friendlyName=f(h.safeContents,"friendlyName",t.friendlyName,t.bagType)),n},getBagsByFriendlyName:function(e,t){return f(h.safeContents,"friendlyName",e,t)},getBagsByLocalKeyId:function(e,t){return f(h.safeContents,"localKeyId",e,t)}};if(a.version.charCodeAt(0)!==3)throw{message:"PKCS#12 PFX of version other than 3 not supported.",version:a.version.charCodeAt(0)};if(t.derToOid(a.contentType)!==n.oids.data)throw{message:"Only PKCS#12 PFX in password integrity mode supported.",oid:t.derToOid(a.contentType)};var p=a.content.value[0];if(p.tagClass!==t.Class.UNIVERSAL||p.type!==t.Type.OCTETSTRING)throw{message:"PKCS#12 authSafe content data is not an OCTET STRING."};if(a.mac){var d=null,v=0,m=t.derToOid(a.macAlgorithm);switch(m){case n.oids.sha1:d=e.md.sha1.create(),v=20;break;case n.oids.sha256:d=e.md.sha256.create(),v=32;break;case n.oids.sha384:d=e.md.sha384.create(),v=48;break;case n.oids.sha512:d=e.md.sha512.create(),v=64;break;case n.oids.md5:d=e.md.md5.create(),v=16}if(d===null)throw{message:"PKCS#12 uses unsupported MAC algorithm: "+m};var g=new e.util.ByteBuffer(a.macSalt),y="macIterations"in a?parseInt(e.util.bytesToHex(a.macIterations),16):1,b=r.generateKey(u||"",g,3,y,v,d),w=e.hmac.create();w.start(d,b),w.update(p.value);var E=w.getMac();if(E.getBytes()!==a.macDigest)throw{message:"PKCS#12 MAC could not be verified. Invalid password?"}}return l(h,p.value,o,u),h},r.toPkcs12Asn1=function(i,s,o,u){u=u||{},u.saltSize=u.saltSize||8,u.count=u.count||2048,u.algorithm=u.algorithm||u.encAlgorithm||"aes128","useMac"in u||(u.useMac=!0),"localKeyId"in u||(u.localKeyId=null),"generateLocalKeyId"in u||(u.generateLocalKeyId=!0);var a=u.localKeyId,f;if(a!==null)a=e.util.hexToBytes(a);else if(u.generateLocalKeyId)if(s){var l=e.util.isArray(s)?s[0]:s;typeof l=="string"&&(l=n.certificateFromPem(l));var c=e.md.sha1.create();c.update(t.toDer(n.certificateToAsn1(l)).getBytes()),a=c.digest().getBytes()}else a=e.random.getBytes(20);var h=[];a!==null&&h.push(t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.localKeyId).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,a)])])),"friendlyName"in u&&h.push(t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.friendlyName).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,[t.create(t.Class.UNIVERSAL,t.Type.BMPSTRING,!1,u.friendlyName)])])),h.length>0&&(f=t.create(t.Class.UNIVERSAL,t.Type.SET,!0,h));var p=[],d=[];s!==null&&(e.util.isArray(s)?d=s:d=[s]);var v=[];for(var m=0;m<d.length;++m){s=d[m],typeof s=="string"&&(s=n.certificateFromPem(s));var g=m===0?f:undefined,y=n.certificateToAsn1(s),b=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.certBag).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.x509Certificate).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,t.toDer(y).getBytes())])])]),g]);v.push(b)}if(v.length>0){var w=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,v),E=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.data).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,t.toDer(w).getBytes())])]);p.push(E)}var S=null;if(i!==null){var x=n.wrapRsaPrivateKey(n.privateKeyToAsn1(i));o===null?S=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.keyBag).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[x]),f]):S=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.pkcs8ShroudedKeyBag).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[n.encryptPrivateKeyInfo(x,o,u)]),f]);var T=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[S]),N=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.data).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,t.toDer(T).getBytes())])]);p.push(N)}var C=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,p),k;if(u.useMac){var c=e.md.sha1.create(),L=new e.util.ByteBuffer(e.random.getBytes(u.saltSize)),A=u.count,i=r.generateKey(o||"",L,3,A,20),O=e.hmac.create();O.start(c,i),O.update(t.toDer(C).getBytes());var M=O.getMac();k=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.sha1).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.NULL,!1,"")]),t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,M.getBytes())]),t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,L.getBytes()),t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(A).getBytes())])}return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(3).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.oids.data).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,t.toDer(C).getBytes())])]),k])},r.generateKey=e.pbe.generatePkcs12Key}var r="pkcs12";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pkcs12",["require","module","./asn1","./hmac","./oids","./pkcs7asn1","./pbe","./random","./rsa","./sha1","./util","./x509"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.asn1,n=e.pki=e.pki||{};n.pemToDer=function(t){var n=e.pem.decode(t)[0];if(n.procType&&n.procType.type==="ENCRYPTED")throw{message:"Could not convert PEM to DER; PEM is encrypted."};return e.util.createBuffer(n.body)},n.privateKeyFromPem=function(r){var i=e.pem.decode(r)[0];if(i.type!=="PRIVATE KEY"&&i.type!=="RSA PRIVATE KEY")throw{message:'Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".',headerType:i.type};if(i.procType&&i.procType.type==="ENCRYPTED")throw{message:"Could not convert private key from PEM; PEM is encrypted."};var s=t.fromDer(i.body);return n.privateKeyFromAsn1(s)},n.privateKeyToPem=function(r,i){var s={type:"RSA PRIVATE KEY",body:t.toDer(n.privateKeyToAsn1(r)).getBytes()};return e.pem.encode(s,{maxline:i})}}var r="pki";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pki",["require","module","./asn1","./oids","./pbe","./pem","./pbkdf2","./pkcs12","./pss","./rsa","./util","./x509"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=function(t,n,r,i){var s=e.util.createBuffer(),o=t.length>>1,u=o+(t.length&1),a=t.substr(0,u),f=t.substr(o,u),l=e.util.createBuffer(),c=e.hmac.create();r=n+r;var h=Math.ceil(i/16),p=Math.ceil(i/20);c.start("MD5",a);var d=e.util.createBuffer();l.putBytes(r);for(var v=0;v<h;++v)c.start(null,null),c.update(l.getBytes()),l.putBuffer(c.digest()),c.start(null,null),c.update(l.bytes()+r),d.putBuffer(c.digest());c.start("SHA1",f);var m=e.util.createBuffer();l.clear(),l.putBytes(r);for(var v=0;v<p;++v)c.start(null,null),c.update(l.getBytes()),l.putBuffer(c.digest()),c.start(null,null),c.update(l.bytes()+r),m.putBuffer(c.digest());return s.putBytes(e.util.xorBytes(d.getBytes(),m.getBytes(),i)),s},n=function(e,t,n,r){},r=function(t,n,r){var i=e.hmac.create();i.start("SHA1",t);var s=e.util.createBuffer();return s.putInt32(n[0]),s.putInt32(n[1]),s.putByte(r.type),s.putByte(r.version.major),s.putByte(r.version.minor),s.putInt16(r.length),s.putBytes(r.fragment.bytes()),i.update(s.getBytes()),i.digest().getBytes()},i=function(t,n,r){var i=!1;try{var s=t.deflate(n.fragment.getBytes());n.fragment=e.util.createBuffer(s),n.length=s.length,i=!0}catch(o){}return i},s=function(t,n,r){var i=!1;try{var s=t.inflate(n.fragment.getBytes());n.fragment=e.util.createBuffer(s),n.length=s.length,i=!0}catch(o){}return i},o=function(t,n){var r=0;switch(n){case 1:r=t.getByte();break;case 2:r=t.getInt16();break;case 3:r=t.getInt24();break;case 4:r=t.getInt32()}return e.util.createBuffer(t.getBytes(r))},u=function(e,t,n){e.putInt(n.length(),t<<3),e.putBuffer(n)},a={};a.Version={major:3,minor:1},a.MaxFragment=15360,a.ConnectionEnd={server:0,client:1},a.PRFAlgorithm={tls_prf_sha256:0},a.BulkCipherAlgorithm={none:null,rc4:0,des3:1,aes:2},a.CipherType={stream:0,block:1,aead:2},a.MACAlgorithm={none:null,hmac_md5:0,hmac_sha1:1,hmac_sha256:2,hmac_sha384:3,hmac_sha512:4},a.CompressionMethod={none:0,deflate:1},a.ContentType={change_cipher_spec:20,alert:21,handshake:22,application_data:23},a.HandshakeType={hello_request:0,client_hello:1,server_hello:2,certificate:11,server_key_exchange:12,certificate_request:13,server_hello_done:14,certificate_verify:15,client_key_exchange:16,finished:20},a.Alert={},a.Alert.Level={warning:1,fatal:2},a.Alert.Description={close_notify:0,unexpected_message:10,bad_record_mac:20,decryption_failed:21,record_overflow:22,decompression_failure:30,handshake_failure:40,bad_certificate:42,unsupported_certificate:43,certificate_revoked:44,certificate_expired:45,certificate_unknown:46,illegal_parameter:47,unknown_ca:48,access_denied:49,decode_error:50,decrypt_error:51,export_restriction:60,protocol_version:70,insufficient_security:71,internal_error:80,user_canceled:90,no_renegotiation:100},a.CipherSuites={},a.getCipherSuite=function(e){var t=null;for(var n in a.CipherSuites){var r=a.CipherSuites[n];if(r.id[0]===e.charCodeAt(0)&&r.id[1]===e.charCodeAt(1)){t=r;break}}return t},a.handleUnexpected=function(e,t){var n=!e.open&&e.entity===a.ConnectionEnd.client;n||e.error(e,{message:"Unexpected message. Received TLS record out of order.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.unexpected_message}})},a.handleHelloRequest=function(e,t,n){!e.handshaking&&e.handshakes>0&&(a.queue(e,a.createAlert({level:a.Alert.Level.warning,description:a.Alert.Description.no_renegotiation})),a.flush(e)),e.process()},a.parseHelloMessage=function(t,n,r){var i=null,s=t.entity===a.ConnectionEnd.client;if(r<38)t.error(t,{message:s?"Invalid ServerHello message. Message too short.":"Invalid ClientHello message. Message too short.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}});else{var u=n.fragment,f=u.length();i={version:{major:u.getByte(),minor:u.getByte()},random:e.util.createBuffer(u.getBytes(32)),session_id:o(u,1),extensions:[]},s?(i.cipher_suite=u.getBytes(2),i.compression_method=u.getByte()):(i.cipher_suites=o(u,2),i.compression_methods=o(u,1)),f=r-(f-u.length());if(f>0){var l=o(u,2);while(l.length()>0)i.extensions.push({type:[l.getByte(),l.getByte()],data:o(l,2)});if(!s)for(var c=0;c<i.extensions.length;++c){var h=i.extensions[c];if(h.type[0]===0&&h.type[1]===0){var p=o(h.data,2);while(p.length()>0){var d=p.getByte();if(d!==0)break;t.session.serverNameList.push(o(p,2).getBytes())}}}}(i.version.major!==a.Version.major||i.version.minor!==a.Version.minor)&&t.error(t,{message:"Incompatible TLS version.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.protocol_version}});if(s)t.session.cipherSuite=a.getCipherSuite(i.cipher_suite);else{var v=e.util.createBuffer(i.cipher_suites.bytes());while(v.length()>0){t.session.cipherSuite=a.getCipherSuite(v.getBytes(2));if(t.session.cipherSuite!==null)break}}if(t.session.cipherSuite===null)return t.error(t,{message:"No cipher suites in common.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.handshake_failure},cipherSuite:e.util.bytesToHex(i.cipher_suite)});s?t.session.compressionMethod=i.compression_method:t.session.compressionMethod=a.CompressionMethod.none}return i},a.createSecurityParameters=function(e,t){var n=e.entity===a.ConnectionEnd.client,r=t.random.bytes(),i=n?e.session.sp.client_random:r,s=n?r:a.createRandom().getBytes();e.session.sp={entity:e.entity,prf_algorithm:a.PRFAlgorithm.tls_prf_sha256,bulk_cipher_algorithm:null,cipher_type:null,enc_key_length:null,block_length:null,fixed_iv_length:null,record_iv_length:null,mac_algorithm:null,mac_length:null,mac_key_length:null,compression_algorithm:e.session.compressionMethod,pre_master_secret:null,master_secret:null,client_random:i,server_random:s}},a.handleServerHello=function(e,t,n){var r=a.parseHelloMessage(e,t,n);if(!e.fail){var i=r.session_id.bytes();i.length>0&&i===e.session.id?(e.expect=d,e.session.resuming=!0,e.session.sp.server_random=r.random.bytes()):(e.expect=l,e.session.resuming=!1,a.createSecurityParameters(e,r)),e.session.id=i,e.process()}},a.handleClientHello=function(t,n,r){var i=a.parseHelloMessage(t,n,r);if(!t.fail){var s=i.session_id.bytes(),o=null;t.sessionCache&&(o=t.sessionCache.getSession(s),o===null&&(s="")),s.length===0&&(s=e.random.getBytes(32)),t.session.id=s,t.session.clientHelloVersion=i.version,t.session.sp=o?o.sp:{},o!==null?(t.expect=S,t.session.resuming=!0,t.session.sp.client_random=i.random.bytes()):(t.expect=t.verifyClient!==!1?b:w,t.session.resuming=!1,a.createSecurityParameters(t,i)),t.open=!0,a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createServerHello(t)})),t.session.resuming?(a.queue(t,a.createRecord({type:a.ContentType.change_cipher_spec,data:a.createChangeCipherSpec()})),t.state.pending=a.createConnectionState(t),t.state.current.write=t.state.pending.write,a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createFinished(t)}))):(a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createCertificate(t)})),t.fail||(a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createServerKeyExchange(t)})),t.verifyClient!==!1&&a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createCertificateRequest(t)})),a.queue(t,a.createRecord({type:a.ContentType.handshake,data:a.createServerHelloDone(t)})))),a.flush(t),t.process()}},a.handleCertificate=function(t,n,r){if(r<3)t.error(t,{message:"Invalid Certificate message. Message too short.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}});else{var i=n.fragment,s={certificate_list:o(i,3)},u,f,l=[];try{while(s.certificate_list.length()>0)u=o(s.certificate_list,3),f=e.asn1.fromDer(u),u=e.pki.certificateFromAsn1(f,!0),l.push(u)}catch(h){t.error(t,{message:"Could not parse certificate list.",cause:h,send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.bad_certificate}})}if(!t.fail){var p=t.entity===a.ConnectionEnd.client;!p&&t.verifyClient!==!0||l.length!==0?l.length===0?t.expect=p?c:w:(p?t.session.serverCertificate=l[0]:t.session.clientCertificate=l[0],a.verifyCertificateChain(t,l)&&(t.expect=p?c:w)):t.error(t,{message:p?"No server certificate provided.":"No client certificate provided.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}}),t.process()}}},a.handleServerKeyExchange=function(e,t,n){n>0?e.error(e,{message:"Invalid key parameters. Only RSA is supported.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.unsupported_certificate}}):(e.expect=h,e.process())},a.handleClientKeyExchange=function(t,n,r){if(r<48)t.error(t,{message:"Invalid key parameters. Only RSA is supported.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.unsupported_certificate}});else{var i=n.fragment,s={enc_pre_master_secret:o(i,2).getBytes()},u=null;if(t.getPrivateKey)try{u=t.getPrivateKey(t,t.session.serverCertificate),u=e.pki.privateKeyFromPem(u)}catch(f){t.error(t,{message:"Could not get private key.",cause:f,send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}})}if(u===null)t.error(t,{message:"No private key set.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}});else try{var l=t.session.sp;l.pre_master_secret=u.decrypt(s.enc_pre_master_secret);var c=t.session.clientHelloVersion;if(c.major!==l.pre_master_secret.charCodeAt(0)||c.minor!==l.pre_master_secret.charCodeAt(1))throw{message:"TLS version rollback attack detected."}}catch(f){l.pre_master_secret=e.random.getBytes(48)}}t.fail||(t.expect=S,t.session.clientCertificate!==null&&(t.expect=E),t.process())},a.handleCertificateRequest=function(e,t,n){if(n<3)e.error(e,{message:"Invalid CertificateRequest. Message too short.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}});else{var r=t.fragment,i={certificate_types:o(r,1),certificate_authorities:o(r,2)};e.session.certificateRequest=i,e.expect=p,e.process()}},a.handleCertificateVerify=function(t,n,r){if(r<2)t.error(t,{message:"Invalid CertificateVerify. Message too short.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}});else{var i=n.fragment;i.read-=4;var s=i.bytes();i.read+=4;var u={signature:o(i,2).getBytes()},f=e.util.createBuffer();f.putBuffer(t.session.md5.digest()),f.putBuffer(t.session.sha1.digest()),f=f.getBytes();try{var l=t.session.clientCertificate;if(!l.publicKey.verify(f,u.signature,"NONE"))throw{message:"CertificateVerify signature does not match."};t.session.md5.update(s),t.session.sha1.update(s)}catch(c){t.error(t,{message:"Bad signature in CertificateVerify.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.handshake_failure}})}t.fail||(t.expect=S,t.process())}},a.handleServerHelloDone=function(t,n,r){if(r>0)t.error(t,{message:"Invalid ServerHelloDone message. Invalid length.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.record_overflow}});else if(t.serverCertificate===null){var i={message:"No server certificate provided. Not enough security.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.insufficient_security}},s=t.verify(t,i.alert.description,depth,[]);if(s===!0)i=null;else{if(s||s===0)typeof s=="object"&&!e.util.isArray(s)?(s.message&&(i.message=s.message),s.alert&&(i.alert.description=s.alert)):typeof s=="number"&&(i.alert.description=s);t.error(t,i)}}!t.fail&&t.session.certificateRequest!==null&&(n=a.createRecord({type:a.ContentType.handshake,data:a.createCertificate(t)}),a.queue(t,n));if(!t.fail){n=a.createRecord({type:a.ContentType.handshake,data:a.createClientKeyExchange(t)}),a.queue(t,n),t.expect=g;var o=function(e,t){e.session.certificateRequest!==null&&e.session.clientCertificate!==null&&a.queue(e,a.createRecord({type:a.ContentType.handshake,data:a.createCertificateVerify(e,t)})),a.queue(e,a.createRecord({type:a.ContentType.change_cipher_spec,data:a.createChangeCipherSpec()})),e.state.pending=a.createConnectionState(e),e.state.current.write=e.state.pending.write,a.queue(e,a.createRecord({type:a.ContentType.handshake,data:a.createFinished(e)})),e.expect=d,a.flush(e),e.process()};t.session.certificateRequest===null||t.session.clientCertificate===null?o(t,null):a.getClientSignature(t,o)}},a.handleChangeCipherSpec=function(e,t){if(t.fragment.getByte()!==1)e.error(e,{message:"Invalid ChangeCipherSpec message received.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.illegal_parameter}});else{var n=e.entity===a.ConnectionEnd.client;if(e.session.resuming&&n||!e.session.resuming&&!n)e.state.pending=a.createConnectionState(e);e.state.current.read=e.state.pending.read;if(!e.session.resuming&&n||e.session.resuming&&!n)e.state.pending=null;e.expect=n?v:x,e.process()}},a.handleFinished=function(n,r,i){var s=r.fragment;s.read-=4;var o=s.bytes();s.read+=4;var u=r.fragment.getBytes();s=e.util.createBuffer(),s.putBuffer(n.session.md5.digest()),s.putBuffer(n.session.sha1.digest());var f=n.entity===a.ConnectionEnd.client,l=f?"server finished":"client finished",c=n.session.sp,h=12,p=t;s=p(c.master_secret,l,s.getBytes(),h);if(s.getBytes()!==u)n.error(n,{message:"Invalid verify_data in Finished message.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.decrypt_error}});else{n.session.md5.update(o),n.session.sha1.update(o);if(n.session.resuming&&f||!n.session.resuming&&!f)a.queue(n,a.createRecord({type:a.ContentType.change_cipher_spec,data:a.createChangeCipherSpec()})),n.state.current.write=n.state.pending.write,n.state.pending=null,a.queue(n,a.createRecord({type:a.ContentType.handshake,data:a.createFinished(n)}));n.expect=f?m:T,n.handshaking=!1,++n.handshakes,n.peerCertificate=f?n.session.serverCertificate:n.session.clientCertificate,n.sessionCache?(n.session={id:n.session.id,sp:n.session.sp},n.session.sp.keys=null):n.session=null,a.flush(n),n.isConnected=!0,n.connected(n),n.process()}},a.handleAlert=function(e,t){var n=t.fragment,r={level:n.getByte(),description:n.getByte()},i;switch(r.description){case a.Alert.Description.close_notify:i="Connection closed.";break;case a.Alert.Description.unexpected_message:i="Unexpected message.";break;case a.Alert.Description.bad_record_mac:i="Bad record MAC.";break;case a.Alert.Description.decryption_failed:i="Decryption failed.";break;case a.Alert.Description.record_overflow:i="Record overflow.";break;case a.Alert.Description.decompression_failure:i="Decompression failed.";break;case a.Alert.Description.handshake_failure:i="Handshake failure.";break;case a.Alert.Description.bad_certificate:i="Bad certificate.";break;case a.Alert.Description.unsupported_certificate:i="Unsupported certificate.";break;case a.Alert.Description.certificate_revoked:i="Certificate revoked.";break;case a.Alert.Description.certificate_expired:i="Certificate expired.";break;case a.Alert.Description.certificate_unknown:i="Certificate unknown.";break;case a.Alert.Description.illegal_parameter:i="Illegal parameter.";break;case a.Alert.Description.unknown_ca:i="Unknown certificate authority.";break;case a.Alert.Description.access_denied:i="Access denied.";break;case a.Alert.Description.decode_error:i="Decode error.";break;case a.Alert.Description.decrypt_error:i="Decrypt error.";break;case a.Alert.Description.export_restriction:i="Export restriction.";break;case a.Alert.Description.protocol_version:i="Unsupported protocol version.";break;case a.Alert.Description.insufficient_security:i="Insufficient security.";break;case a.Alert.Description.internal_error:i="Internal error.";break;case a.Alert.Description.user_canceled:i="User canceled.";break;case a.Alert.Description.no_renegotiation:i="Renegotiation not supported.";break;default:i="Unknown error."}r.description===a.Alert.Description.close_notify?e.close():(e.error(e,{message:i,send:!1,origin:e.entity===a.ConnectionEnd.client?"server":"client",alert:r}),e.process())},a.handleHandshake=function(t,n){var r=n.fragment,i=r.getByte(),s=r.getInt24();if(s>r.length())t.fragmented=n,n.fragment=e.util.createBuffer(),r.read-=4,t.process();else{t.fragmented=null,r.read-=4;var o=r.bytes(s+4);r.read+=4,i in I[t.entity][t.expect]?(t.entity===a.ConnectionEnd.server&&!t.open&&!t.fail&&(t.handshaking=!0,t.session={serverNameList:[],cipherSuite:null,compressionMethod:null,serverCertificate:null,clientCertificate:null,md5:e.md.md5.create(),sha1:e.md.sha1.create()}),i!==a.HandshakeType.hello_request&&i!==a.HandshakeType.certificate_verify&&i!==a.HandshakeType.finished&&(t.session.md5.update(o),t.session.sha1.update(o)),I[t.entity][t.expect][i](t,n,s)):a.handleUnexpected(t,n)}},a.handleApplicationData=function(e,t){e.data.putBuffer(t.fragment),e.dataReady(e),e.process()};var f=0,l=1,c=2,h=3,p=4,d=5,v=6,m=7,g=8,y=0,b=1,w=2,E=3,S=4,x=5,T=6,N=7,C=a.handleUnexpected,k=a.handleChangeCipherSpec,L=a.handleAlert,A=a.handleHandshake,O=a.handleApplicationData,M=[];M[a.ConnectionEnd.client]=[[C,L,A,C],[C,L,A,C],[C,L,A,C],[C,L,A,C],[C,L,A,C],[k,L,C,C],[C,L,A,C],[C,L,A,O],[C,L,A,C]],M[a.ConnectionEnd.server]=[[C,L,A,C],[C,L,A,C],[C,L,A,C],[C,L,A,C],[k,L,C,C],[C,L,A,C],[C,L,A,O],[C,L,A,C]];var _=a.handleHelloRequest,D=a.handleServerHello,P=a.handleCertificate,H=a.handleServerKeyExchange,B=a.handleCertificateRequest,j=a.handleServerHelloDone,F=a.handleFinished,I=[];I[a.ConnectionEnd.client]=[[C,C,D,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,P,H,B,j,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,H,B,j,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,C,B,j,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,C,C,j,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,F],[_,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[_,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C]];var q=a.handleClientHello,R=a.handleClientKeyExchange,U=a.handleCertificateVerify;I[a.ConnectionEnd.server]=[[C,q,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,P,C,C,C,C,C,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,R,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,U,C,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,F],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C],[C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C]],a.generateKeys=function(e,n){var r=t,i=n.client_random+n.server_random;e.session.resuming||(n.master_secret=r(n.pre_master_secret,"master secret",i,48).bytes(),n.pre_master_secret=null),i=n.server_random+n.client_random;var s=2*n.mac_key_length+2*n.enc_key_length+2*n.fixed_iv_length,o=r(n.master_secret,"key expansion",i,s);return{client_write_MAC_key:o.getBytes(n.mac_key_length),server_write_MAC_key:o.getBytes(n.mac_key_length),client_write_key:o.getBytes(n.enc_key_length),server_write_key:o.getBytes(n.enc_key_length),client_write_IV:o.getBytes(n.fixed_iv_length),server_write_IV:o.getBytes(n.fixed_iv_length)}},a.createConnectionState=function(e){var t=e.entity===a.ConnectionEnd.client,n=function(){var e={sequenceNumber:[0,0],macKey:null,macLength:0,macFunction:null,cipherState:null,cipherFunction:function(e){return!0},compressionState:null,compressFunction:function(e){return!0},updateSequenceNumber:function(){e.sequenceNumber[1]===4294967295?(e.sequenceNumber[1]=0,++e.sequenceNumber[0]):++e.sequenceNumber[1]}};return e},r={read:n(),write:n()};r.read.update=function(e,t){return r.read.cipherFunction(t,r.read)?r.read.compressFunction(e,t,r.read)||e.error(e,{message:"Could not decompress record.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.decompression_failure}}):e.error(e,{message:"Could not decrypt record or bad MAC.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.bad_record_mac}}),!e.fail},r.write.update=function(e,t){return r.write.compressFunction(e,t,r.write)?r.write.cipherFunction(t,r.write)||e.error(e,{message:"Could not encrypt record.",send:!1,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}}):e.error(e,{message:"Could not compress record.",send:!1,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}}),!e.fail};if(e.session){var o=e.session.sp;e.session.cipherSuite.initSecurityParameters(o),o.keys=a.generateKeys(e,o),r.read.macKey=t?o.keys.server_write_MAC_key:o.keys.client_write_MAC_key,r.write.macKey=t?o.keys.client_write_MAC_key:o.keys.server_write_MAC_key,e.session.cipherSuite.initConnectionState(r,e,o);switch(o.compression_algorithm){case a.CompressionMethod.none:break;case a.CompressionMethod.deflate:r.read.compressFunction=s,r.write.compressFunction=i;break;default:throw{message:"Unsupported compression algorithm."}}}return r},a.createRandom=function(){var t=new Date,n=+t+t.getTimezoneOffset()*6e4,r=e.util.createBuffer();return r.putInt32(n),r.putBytes(e.random.getBytes(28)),r},a.createRecord=function(e){if(!e.data)return null;var t={type:e.type,version:{major:a.Version.major,minor:a.Version.minor},length:e.data.length(),fragment:e.data};return t},a.createAlert=function(t){var n=e.util.createBuffer();return n.putByte(t.level),n.putByte(t.description),a.createRecord({type:a.ContentType.alert,data:n})},a.createClientHello=function(t){var n=e.util.createBuffer();for(var r=0;r<t.cipherSuites.length;++r){var i=t.cipherSuites[r];n.putByte(i.id[0]),n.putByte(i.id[1])}var s=n.length(),o=e.util.createBuffer();o.putByte(a.CompressionMethod.none);var f=o.length(),l=e.util.createBuffer();if(t.virtualHost){var c=e.util.createBuffer();c.putByte(0),c.putByte(0);var h=e.util.createBuffer();h.putByte(0),u(h,2,e.util.createBuffer(t.virtualHost));var p=e.util.createBuffer();u(p,2,h),u(c,2,p),l.putBuffer(c)}var d=l.length();d>0&&(d+=2);var v=t.session.id,m=v.length+1+2+4+28+2+s+1+f+d,g=e.util.createBuffer();return g.putByte(a.HandshakeType.client_hello),g.putInt24(m),g.putByte(a.Version.major),g.putByte(a.Version.minor),g.putBytes(t.session.sp.client_random),u(g,1,e.util.createBuffer(v)),u(g,2,n),u(g,1,o),d>0&&u(g,2,l),g},a.createServerHello=function(t){var n=t.session.id,r=n.length+1+2+4+28+2+1,i=e.util.createBuffer();return i.putByte(a.HandshakeType.server_hello),i.putInt24(r),i.putByte(a.Version.major),i.putByte(a.Version.minor),i.putBytes(t.session.sp.server_random),u(i,1,e.util.createBuffer(n)),i.putByte(t.session.cipherSuite.id[0]),i.putByte(t.session.cipherSuite.id[1]),i.putByte(t.session.compressionMethod),i},a.createCertificate=function(t){var n=t.entity===a.ConnectionEnd.client,r=null;t.getCertificate&&(r=t.getCertificate(t,n?t.session.certificateRequest:t.session.serverNameList));var i=e.util.createBuffer();if(r!==null)try{e.util.isArray(r)||(r=[r]);var s=null;for(var o=0;o<r.length;++o){var f=e.pem.decode(r[o])[0];if(f.type!=="CERTIFICATE"&&f.type!=="X509 CERTIFICATE"&&f.type!=="TRUSTED CERTIFICATE")throw{message:'Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".',headerType:f.type};if(f.procType&&f.procType.type==="ENCRYPTED")throw{message:"Could not convert certificate from PEM; PEM is encrypted."};var l=e.util.createBuffer(f.body);s===null&&(s=e.asn1.fromDer(l.bytes(),!1));var c=e.util.createBuffer();u(c,3,l),i.putBuffer(c)}r=e.pki.certificateFromAsn1(s),n?t.session.clientCertificate=r:t.session.serverCertificate=r}catch(h){return t.error(t,{message:"Could not send certificate list.",cause:h,send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.bad_certificate}})}var p=3+i.length(),d=e.util.createBuffer();return d.putByte(a.HandshakeType.certificate),d.putInt24(p),u(d,3,i),d},a.createClientKeyExchange=function(t){var n=e.util.createBuffer();n.putByte(a.Version.major),n.putByte(a.Version.minor),n.putBytes(e.random.getBytes(46));var r=t.session.sp;r.pre_master_secret=n.getBytes();var i=t.session.serverCertificate.publicKey;n=i.encrypt(r.pre_master_secret);var s=n.length+2,o=e.util.createBuffer();return o.putByte(a.HandshakeType.client_key_exchange),o.putInt24(s),o.putInt16(n.length),o.putBytes(n),o},a.createServerKeyExchange=function(t){var n=0,r=e.util.createBuffer();return n>0&&(r.putByte(a.HandshakeType.server_key_exchange),r.putInt24(n)),r},a.getClientSignature=function(t,n){var r=e.util.createBuffer();r.putBuffer(t.session.md5.digest()),r.putBuffer(t.session.sha1.digest()),r=r.getBytes(),t.getSignature=t.getSignature||function(t,n,r){var i=null;if(t.getPrivateKey)try{i=t.getPrivateKey(t,t.session.clientCertificate),i=e.pki.privateKeyFromPem(i)}catch(s){t.error(t,{message:"Could not get private key.",cause:s,send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}})}i===null?t.error(t,{message:"No private key set.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.internal_error}}):n=i.sign(n,null),r(t,n)},t.getSignature(t,r,n)},a.createCertificateVerify=function(t,n){var r=n.length+2,i=e.util.createBuffer();return i.putByte(a.HandshakeType.certificate_verify),i.putInt24(r),i.putInt16(n.length),i.putBytes(n),i},a.createCertificateRequest=function(t){var n=e.util.createBuffer();n.putByte(1);var r=e.util.createBuffer();for(var i in t.caStore.certs){var s=t.caStore.certs[i],o=e.pki.distinguishedNameToAsn1(s.subject);r.putBuffer(e.asn1.toDer(o))}var f=1+n.length()+2+r.length(),l=e.util.createBuffer();return l.putByte(a.HandshakeType.certificate_request),l.putInt24(f),u(l,1,n),u(l,2,r),l},a.createServerHelloDone=function(t){var n=e.util.createBuffer();return n.putByte(a.HandshakeType.server_hello_done),n.putInt24(0),n},a.createChangeCipherSpec=function(){var t=e.util.createBuffer();return t.putByte(1),t},a.createFinished=function(n){var r=e.util.createBuffer();r.putBuffer(n.session.md5.digest()),r.putBuffer(n.session.sha1.digest());var i=n.entity===a.ConnectionEnd.client,s=n.session.sp,o=12,u=t,f=i?"client finished":"server finished";r=u(s.master_secret,f,r.getBytes(),o);var l=e.util.createBuffer();return l.putByte(a.HandshakeType.finished),l.putInt24(r.length()),l.putBuffer(r),l},a.queue=function(t,n){if(!n)return;if(n.type===a.ContentType.handshake){var r=n.fragment.bytes();t.session.md5.update(r),t.session.sha1.update(r),r=null}var i;if(n.fragment.length()<=a.MaxFragment)i=[n];else{i=[];var s=n.fragment.bytes();while(s.length>a.MaxFragment)i.push(a.createRecord({type:n.type,data:e.util.createBuffer(s.slice(0,a.MaxFragment))})),s=s.slice(a.MaxFragment);s.length>0&&i.push(a.createRecord({type:n.type,data:e.util.createBuffer(s)}))}for(var o=0;o<i.length&&!t.fail;++o){var u=i[o],f=t.state.current.write;f.update(t,u)&&t.records.push(u)}},a.flush=function(e){for(var t=0;t<e.records.length;++t){var n=e.records[t];e.tlsData.putByte(n.type),e.tlsData.putByte(n.version.major),e.tlsData.putByte(n.version.minor),e.tlsData.putInt16(n.fragment.length()),e.tlsData.putBuffer(e.records[t].fragment)}return e.records=[],e.tlsDataReady(e)};var z=function(t){switch(t){case!0:return!0;case e.pki.certificateError.bad_certificate:return a.Alert.Description.bad_certificate;case e.pki.certificateError.unsupported_certificate:return a.Alert.Description.unsupported_certificate;case e.pki.certificateError.certificate_revoked:return a.Alert.Description.certificate_revoked;case e.pki.certificateError.certificate_expired:return a.Alert.Description.certificate_expired;case e.pki.certificateError.certificate_unknown:return a.Alert.Description.certificate_unknown;case e.pki.certificateError.unknown_ca:return a.Alert.Description.unknown_ca;default:return a.Alert.Description.bad_certificate}},W=function(t){switch(t){case!0:return!0;case a.Alert.Description.bad_certificate:return e.pki.certificateError.bad_certificate;case a.Alert.Description.unsupported_certificate:return e.pki.certificateError.unsupported_certificate;case a.Alert.Description.certificate_revoked:return e.pki.certificateError.certificate_revoked;case a.Alert.Description.certificate_expired:return e.pki.certificateError.certificate_expired;case a.Alert.Description.certificate_unknown:return e.pki.certificateError.certificate_unknown;case a.Alert.Description.unknown_ca:return e.pki.certificateError.unknown_ca;default:return e.pki.certificateError.bad_certificate}};a.verifyCertificateChain=function(t,n){try{e.pki.verifyCertificateChain(t.caStore,n,function(r,i,s){var o=z(r),u=t.verify(t,r,i,s);if(u!==!0){if(typeof u=="object"&&!e.util.isArray(u)){var f={message:"The application rejected the certificate.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.bad_certificate}};throw u.message&&(f.message=u.message),u.alert&&(f.alert.description=u.alert),f}u!==r&&(u=W(u))}return u})}catch(r){if(typeof r!="object"||e.util.isArray(r))r={send:!0,alert:{level:a.Alert.Level.fatal,description:z(r)}};"send"in r||(r.send=!0),"alert"in r||(r.alert={level:a.Alert.Level.fatal,description:z(r.error)}),t.error(t,r)}return!t.fail},a.createSessionCache=function(t,n){var r=null;if(t&&t.getSession&&t.setSession&&t.order)r=t;else{r={},r.cache=t||{},r.capacity=Math.max(n||100,1),r.order=[];for(var i in t)r.order.length<=n?r.order.push(i):delete t[i];r.getSession=function(t){var n=null,i=null;t?i=e.util.bytesToHex(t):r.order.length>0&&(i=r.order[0]);if(i!==null&&i in r.cache){n=r.cache[i],delete r.cache[i];for(var s in r.order)if(r.order[s]===i){r.order.splice(s,1);break}}return n},r.setSession=function(t,n){if(r.order.length===r.capacity){var i=r.order.shift();delete r.cache[i]}var i=e.util.bytesToHex(t);r.order.push(i),r.cache[i]=n}}return r},a.createConnection=function(t){var n=null;t.caStore?e.util.isArray(t.caStore)?n=e.pki.createCaStore(t.caStore):n=t.caStore:n=e.pki.createCaStore();var r=t.cipherSuites||null;if(r===null){r=[];for(var i in a.CipherSuites)r.push(a.CipherSuites[i])}var s=t.server||!1?a.ConnectionEnd.server:a.ConnectionEnd.client,o=t.sessionCache?a.createSessionCache(t.sessionCache):null,u={entity:s,sessionId:t.sessionId,caStore:n,sessionCache:o,cipherSuites:r,connected:t.connected,virtualHost:t.virtualHost||null,verifyClient:t.verifyClient||!1,verify:t.verify||function(e,t,n,r){return t},getCertificate:t.getCertificate||null,getPrivateKey:t.getPrivateKey||null,getSignature:t.getSignature||null,input:e.util.createBuffer(),tlsData:e.util.createBuffer(),data:e.util.createBuffer(),tlsDataReady:t.tlsDataReady,dataReady:t.dataReady,closed:t.closed,error:function(e,n){n.origin=n.origin||(e.entity===a.ConnectionEnd.client?"client":"server"),n.send&&(a.queue(e,a.createAlert(n.alert)),a.flush(e));var r=n.fatal!==!1;r&&(e.fail=!0),t.error(e,n),r&&e.close(!1)},deflate:t.deflate||null,inflate:t.inflate||null};u.reset=function(e){u.record=null,u.session=null,u.peerCertificate=null,u.state={pending:null,current:null},u.expect=u.entity===a.ConnectionEnd.client?f:y,u.fragmented=null,u.records=[],u.open=!1,u.handshakes=0,u.handshaking=!1,u.isConnected=!1,u.fail=!e&&typeof e!="undefined",u.input.clear(),u.tlsData.clear(),u.data.clear(),u.state.current=a.createConnectionState(u)},u.reset();var l=function(e,t){var n=t.type-a.ContentType.change_cipher_spec,r=M[e.entity][e.expect];n in r?r[n](e,t):a.handleUnexpected(e,t)},c=function(t){var n=0,r=t.input,i=r.length();return i<5?n=5-i:(t.record={type:r.getByte(),version:{major:r.getByte(),minor:r.getByte()},length:r.getInt16(),fragment:e.util.createBuffer(),ready:!1},(t.record.version.major!==a.Version.major||t.record.version.minor!==a.Version.minor)&&t.error(t,{message:"Incompatible TLS version.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.protocol_version}})),n},h=function(e){var t=0,n=e.input,r=n.length();if(r<e.record.length)t=e.record.length-r;else{e.record.fragment.putBytes(n.getBytes(e.record.length)),n.compact();var i=e.state.current.read;i.update(e,e.record)&&(e.fragmented!==null&&(e.fragmented.type===e.record.type?(e.fragmented.fragment.putBuffer(e.record.fragment),e.record=e.fragmented):e.error(e,{message:"Invalid fragmented record.",send:!0,alert:{level:a.Alert.Level.fatal,description:a.Alert.Description.unexpected_message}})),e.record.ready=!0)}return t};return u.handshake=function(t){if(u.entity!==a.ConnectionEnd.client)u.error(u,{message:"Cannot initiate handshake as a server.",fatal:!1});else if(u.handshaking)u.error(u,{message:"Handshake already in progress.",fatal:!1});else{u.fail&&!u.open&&u.handshakes===0&&(u.fail=!1),u.handshaking=!0,t=t||"";var n=null;t.length>0&&(u.sessionCache&&(n=u.sessionCache.getSession(t)),n===null&&(t="")),t.length===0&&u.sessionCache&&(n=u.sessionCache.getSession(),n!==null&&(t=n.id)),u.session={id:t,cipherSuite:null,compressionMethod:null,serverCertificate:null,certificateRequest:null,clientCertificate:null,sp:n?n.sp:{},md5:e.md.md5.create(),sha1:e.md.sha1.create()},u.session.sp.client_random=a.createRandom().getBytes(),u.open=!0,a.queue(u,a.createRecord({type:a.ContentType.handshake,data:a.createClientHello(u)})),a.flush(u)}},u.process=function(e){var t=0;return e&&u.input.putBytes(e),u.fail||(u.record!==null&&u.record.ready&&u.record.fragment.isEmpty()&&(u.record=null),u.record===null&&(t=c(u)),!u.fail&&u.record!==null&&!u.record.ready&&(t=h(u)),!u.fail&&u.record!==null&&u.record.ready&&l(u,u.record)),t},u.prepare=function(t){return a.queue(u,a.createRecord({type:a.ContentType.application_data,data:e.util.createBuffer(t)})),a.flush(u)},u.close=function(e){!u.fail&&u.sessionCache&&u.session&&u.sessionCache.setSession(u.session.id,u.session);if(u.open){u.open=!1,u.input.clear();if(u.isConnected||u.handshaking)u.isConnected=u.handshaking=!1,a.queue(u,a.createAlert({level:a.Alert.Level.warning,description:a.Alert.Description.close_notify})),a.flush(u);u.closed(u)}u.reset(e)},u},e.tls=e.tls||{};for(var X in a)typeof a[X]!="function"&&(e.tls[X]=a[X]);e.tls.prf_tls1=t,e.tls.hmac_sha1=r,e.tls.createSessionCache=a.createSessionCache,e.tls.createConnection=a.createConnection}var r="tls";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/tls",["require","module","./asn1","./hmac","./md","./pem","./pki","./random","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){function n(n,i,s){var u=i.entity===e.tls.ConnectionEnd.client;n.read.cipherState={init:!1,cipher:e.aes.createDecryptionCipher(u?s.keys.server_write_key:s.keys.client_write_key),iv:u?s.keys.server_write_IV:s.keys.client_write_IV},n.write.cipherState={init:!1,cipher:e.aes.createEncryptionCipher(u?s.keys.client_write_key:s.keys.server_write_key),iv:u?s.keys.client_write_IV:s.keys.server_write_IV},n.read.cipherFunction=o,n.write.cipherFunction=r,n.read.macLength=n.write.macLength=s.mac_length,n.read.macFunction=n.write.macFunction=t.hmac_sha1}function r(t,n){var r=!1,s=n.macFunction(n.macKey,n.sequenceNumber,t);t.fragment.putBytes(s),n.updateSequenceNumber();var o;t.version.minor>1?o=e.random.getBytes(16):o=n.cipherState.init?null:n.cipherState.iv,n.cipherState.init=!0;var u=n.cipherState.cipher;return u.start(o),t.version.minor>1&&u.output.putBytes(o),u.update(t.fragment),u.finish(i)&&(t.fragment=u.output,t.length=t.fragment.length(),r=!0),r}function i(e,t,n){if(!n){var r=e-t.length()%e;t.fillWithByte(r-1,r)}return!0}function s(e,t,n){var r=!0;if(n){var i=t.length(),s=t.last();for(var o=i-1-s;o<i-1;++o)r=r&&t.at(o)==s;r&&t.truncate(s+1)}return r}function o(t,n){var r=!1,i=n.cipherState.init?null:n.cipherState.iv;n.cipherState.init=!0;var o=n.cipherState.cipher;o.start(i),o.update(t.fragment),r=o.finish(s);var u=n.macLength,a="";for(var f=0;f<u;++f)a+=String.fromCharCode(0);var l=o.output.length();l>=u?(t.fragment=o.output.getBytes(l-u),a=o.output.getBytes(u)):t.fragment=o.output.getBytes(),t.fragment=e.util.createBuffer(t.fragment),t.length=t.fragment.length();var c=n.macFunction(n.macKey,n.sequenceNumber,t);return n.updateSequenceNumber(),r=c===a&&r,r}var t=e.tls;t.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA={id:[0,47],name:"TLS_RSA_WITH_AES_128_CBC_SHA",initSecurityParameters:function(e){e.bulk_cipher_algorithm=t.BulkCipherAlgorithm.aes,e.cipher_type=t.CipherType.block,e.enc_key_length=16,e.block_length=16,e.fixed_iv_length=16,e.record_iv_length=16,e.mac_algorithm=t.MACAlgorithm.hmac_sha1,e.mac_length=20,e.mac_key_length=20},initConnectionState:n},t.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA={id:[0,53],name:"TLS_RSA_WITH_AES_256_CBC_SHA",initSecurityParameters:function(e){e.bulk_cipher_algorithm=t.BulkCipherAlgorithm.aes,e.cipher_type=t.CipherType.block,e.enc_key_length=32,e.block_length=16,e.fixed_iv_length=16,e.record_iv_length=16,e.mac_algorithm=t.MACAlgorithm.hmac_sha1,e.mac_length=20,e.mac_key_length=20},initConnectionState:n}}var r="aesCipherSuites";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/aesCipherSuites",["require","module","./aes","./tls"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.debug=e.debug||{},e.debug.storage={},e.debug.get=function(t,n){var r;return typeof t=="undefined"?r=e.debug.storage:t in e.debug.storage&&(typeof n=="undefined"?r=e.debug.storage[t]:r=e.debug.storage[t][n]),r},e.debug.set=function(t,n,r){t in e.debug.storage||(e.debug.storage[t]={}),e.debug.storage[t][n]=r},e.debug.clear=function(t,n){typeof t=="undefined"?e.debug.storage={}:t in e.debug.storage&&(typeof n=="undefined"?delete e.debug.storage[t]:delete e.debug.storage[t][n])}}var r="debug";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/debug",["require","module"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){e.log=e.log||{},e.log.levels=["none","error","warning","info","debug","verbose","max"];var t={},n=[],r=null;e.log.LEVEL_LOCKED=2,e.log.NO_LEVEL_CHECK=4,e.log.INTERPOLATE=8;for(var i=0;i<e.log.levels.length;++i){var s=e.log.levels[i];t[s]={index:i,name:s.toUpperCase()}}e.log.logMessage=function(r){var i=t[r.level].index;for(var s=0;s<n.length;++s){var o=n[s];if(o.flags&e.log.NO_LEVEL_CHECK)o.f(r);else{var u=t[o.level].index;i<=u&&o.f(o,r)}}},e.log.prepareStandard=function(e){"standard"in e||(e.standard=t[e.level].name+" ["+e.category+"] "+e.message)},e.log.prepareFull=function(t){if(!("full"in t)){var n=[t.message];n=n.concat([]||t.arguments),t.full=e.util.format.apply(this,n)}},e.log.prepareStandardFull=function(t){"standardFull"in t||(e.log.prepareStandard(t),t.standardFull=t.standard)};var o=["error","warning","info","debug","verbose"];for(var i=0;i<o.length;++i)(function(t){e.log[t]=function(n,r){var i=Array.prototype.slice.call(arguments).slice(2),s={timestamp:new Date,level:t,category:n,message:r,arguments:i};e.log.logMessage(s)}})(o[i]);e.log.makeLogger=function(t){var n={flags:0,f:t};return e.log.setLevel(n,"none"),n},e.log.setLevel=function(t,n){var r=!1;if(t&&!(t.flags&e.log.LEVEL_LOCKED))for(var i=0;i<e.log.levels.length;++i){var s=e.log.levels[i];if(n==s){t.level=n,r=!0;break}}return r},e.log.lock=function(t,n){typeof n=="undefined"||n?t.flags|=e.log.LEVEL_LOCKED:t.flags&=~e.log.LEVEL_LOCKED},e.log.addLogger=function(e){n.push(e)};if(typeof console!="undefined"&&"log"in console){var u;if(console.error&&console.warn&&console.info&&console.debug){var a={error:console.error,warning:console.warn,info:console.info,debug:console.debug,verbose:console.debug},f=function(t,n){e.log.prepareStandard(n);var r=a[n.level],i=[n.standard];i=i.concat(n.arguments.slice()),r.apply(console,i)};u=e.log.makeLogger(f)}else{var f=function(t,n){e.log.prepareStandardFull(n),console.log(n.standardFull)};u=e.log.makeLogger(f)}e.log.setLevel(u,"debug"),e.log.addLogger(u),r=u}else console={log:function(){}};if(r!==null){var l=e.util.getQueryVariables();"console.level"in l&&e.log.setLevel(r,l["console.level"].slice(-1)[0]);if("console.lock"in l){var c=l["console.lock"].slice(-1)[0];c=="true"&&e.log.lock(r)}}e.log.consoleLogger=r}var r="log";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/log",["require","module","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t=e.asn1,n=e.pkcs7=e.pkcs7||{};n.messageFromPem=function(r){var i=e.pem.decode(r)[0];if(i.type!=="PKCS7")throw{message:'Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".',headerType:i.type};if(i.procType&&i.procType.type==="ENCRYPTED")throw{message:"Could not convert PKCS#7 message from PEM; PEM is encrypted."};var s=t.fromDer(i.body);return n.messageFromAsn1(s)},n.messageToPem=function(n,r){var i={type:"PKCS7",body:t.toDer(n.toAsn1()).getBytes()};return e.pem.encode(i,{maxline:r})},n.messageFromAsn1=function(r){var i={},s=[];if(!t.validate(r,n.asn1.contentInfoValidator,i,s))throw{message:"Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.",errors:s};var o=t.derToOid(i.contentType),u;switch(o){case e.pki.oids.envelopedData:u=n.createEnvelopedData();break;case e.pki.oids.encryptedData:u=n.createEncryptedData();break;case e.pki.oids.signedData:u=n.createSignedData();break;default:throw{message:"Cannot read PKCS#7 message. ContentType with OID "+o+" is not (yet) supported."}}return u.fromAsn1(i.content.value[0]),u};var r=function(r){var i={},s=[];if(!t.validate(r,n.asn1.recipientInfoValidator,i,s))throw{message:"Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 EnvelopedData.",errors:s};return{version:i.version.charCodeAt(0),issuer:e.pki.RDNAttributesAsArray(i.issuer),serialNumber:e.util.createBuffer(i.serial).toHex(),encryptedContent:{algorithm:t.derToOid(i.encAlgorithm),parameter:i.encParameter.value,content:i.encKey}}},i=function(n){return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(n.version).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[e.pki.distinguishedNameToAsn1({attributes:n.issuer}),t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,e.util.hexToBytes(n.serialNumber))]),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.encryptedContent.algorithm).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.NULL,!1,"")]),t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,n.encryptedContent.content)])},s=function(e){var t=[];for(var n=0;n<e.length;n++)t.push(r(e[n]));return t},o=function(e){var t=[];for(var n=0;n<e.length;n++)t.push(i(e[n]));return t},u=function(n){return[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(e.pki.oids.data).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(n.algorithm).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,n.parameter.getBytes())]),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,n.content.getBytes())])]},a=function(n,r,i){var s={},o=[];if(!t.validate(r,i,s,o))throw{message:"Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.",errors:o};var u=t.derToOid(s.contentType);if(u!==e.pki.oids.data)throw{message:"Unsupported PKCS#7 message. Only wrapped ContentType Data supported."};if(s.encryptedContent){var a="";if(e.util.isArray(s.encryptedContent))for(var f=0;f<s.encryptedContent.length;++f){if(s.encryptedContent[f].type!==t.Type.OCTETSTRING)throw{message:"Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects."};a+=s.encryptedContent[f].value}else a=s.encryptedContent;n.encryptedContent={algorithm:t.derToOid(s.encAlgorithm),parameter:e.util.createBuffer(s.encParameter.value),content:e.util.createBuffer(a)}}if(s.content){var a="";if(e.util.isArray(s.content))for(var f=0;f<s.content.length;++f){if(s.content[f].type!==t.Type.OCTETSTRING)throw{message:"Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects."};a+=s.content[f].value}else a=s.content;n.content=e.util.createBuffer(a)}return n.version=s.version.charCodeAt(0),n.rawCapture=s,s},f=function(t){if(t.encryptedContent.key===undefined)throw{message:"Symmetric key not available."};if(t.content===undefined){var n;switch(t.encryptedContent.algorithm){case e.pki.oids["aes128-CBC"]:case e.pki.oids["aes192-CBC"]:case e.pki.oids["aes256-CBC"]:n=e.aes.createDecryptionCipher(t.encryptedContent.key);break;case e.pki.oids.desCBC:case e.pki.oids["des-EDE3-CBC"]:n=e.des.createDecryptionCipher(t.encryptedContent.key);break;default:throw{message:"Unsupported symmetric cipher, OID "+t.encryptedContent.algorithm}}n.start(t.encryptedContent.parameter),n.update(t.encryptedContent.content);if(!n.finish())throw{message:"Symmetric decryption failed."};t.content=n.output}};n.createSignedData=function(){var r=null;return r={type:e.pki.oids.signedData,version:1,certificates:[],crls:[],digestAlgorithmIdentifiers:[],contentInfo:null,signerInfos:[],fromAsn1:function(t){a(r,t,n.asn1.signedDataValidator),r.certificates=[],r.crls=[],r.digestAlgorithmIdentifiers=[],r.contentInfo=null,r.signerInfos=[];var i=r.rawCapture.certificates.value;for(var s=0;s<i.length;++s)r.certificates.push(e.pki.certificateFromAsn1(i[s]))},toAsn1:function(){if("content"in r)throw"Signing PKCS#7 content not yet implemented.";r.contentInfo||r.sign();var n=[];for(var i=0;i<r.certificates.length;++i)n.push(e.pki.certificateToAsn1(r.certificates[0]));var s=[];return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(r.type).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(r.version).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,r.digestAlgorithmIdentifiers),r.contentInfo,t.create(t.Class.CONTEXT_SPECIFIC,0,!0,n),t.create(t.Class.CONTEXT_SPECIFIC,1,!0,s),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,r.signerInfos)])])])},sign:function(n){if("content"in r)throw"PKCS#7 signing not yet implemented.";typeof r.content!="object"&&(r.contentInfo=t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(e.pki.oids.data).getBytes())]),"content"in r&&r.contentInfo.value.push(t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.OCTETSTRING,!1,r.content)])))},verify:function(){throw"PKCS#7 signature verification not yet implemented."},addCertificate:function(t){typeof t=="string"&&(t=e.pki.certificateFromPem(t)),r.certificates.push(t)},addCertificateRevokationList:function(e){throw"PKCS#7 CRL support not yet implemented."}},r},n.createEncryptedData=function(){var t=null;return t={type:e.pki.oids.encryptedData,version:0,encryptedContent:{algorithm:e.pki.oids["aes256-CBC"]},fromAsn1:function(e){a(t,e,n.asn1.encryptedDataValidator)},decrypt:function(e){e!==undefined&&(t.encryptedContent.key=e),f(t)}},t},n.createEnvelopedData=function(){var r=null;return r={type:e.pki.oids.envelopedData,version:0,recipients:[],encryptedContent:{algorithm:e.pki.oids["aes256-CBC"]},fromAsn1:function(e){var t=a(r,e,n.asn1.envelopedDataValidator);r.recipients=s(t.recipientInfos.value)},toAsn1:function(){return t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.OID,!1,t.oidToDer(r.type).getBytes()),t.create(t.Class.CONTEXT_SPECIFIC,0,!0,[t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,[t.create(t.Class.UNIVERSAL,t.Type.INTEGER,!1,t.integerToDer(r.version).getBytes()),t.create(t.Class.UNIVERSAL,t.Type.SET,!0,o(r.recipients)),t.create(t.Class.UNIVERSAL,t.Type.SEQUENCE,!0,u(r.encryptedContent))])])])},findRecipient:function(e){var t=e.issuer.attributes;for(var n=0;n<r.recipients.length;++n){var i=r.recipients[n],s=i.issuer;if(i.serialNumber!==e.serialNumber)continue;if(s.length!==t.length)continue;var o=!0;for(var u=0;u<t.length;++u)if(s[u].type!==t[u].type||s[u].value!==t[u].value){o=!1;break}if(o)return i}return null},decrypt:function(t,n){if(r.encryptedContent.key===undefined&&t!==undefined&&n!==undefined)switch(t.encryptedContent.algorithm){case e.pki.oids.rsaEncryption:case e.pki.oids.desCBC:var i=n.decrypt(t.encryptedContent.content);r.encryptedContent.key=e.util.createBuffer(i);break;default:throw{message:"Unsupported asymmetric cipher, OID "+t.encryptedContent.algorithm}}f(r)},addRecipient:function(t){r.recipients.push({version:0,issuer:t.subject.attributes,serialNumber:t.serialNumber,encryptedContent:{algorithm:e.pki.oids.rsaEncryption,key:t.publicKey}})},encrypt:function(t,n){if(r.encryptedContent.content===undefined){n=n||r.encryptedContent.algorithm,t=t||r.encryptedContent.key;var i,s,o;switch(n){case e.pki.oids["aes128-CBC"]:i=16,s=16,o=e.aes.createEncryptionCipher;break;case e.pki.oids["aes192-CBC"]:i=24,s=16,o=e.aes.createEncryptionCipher;break;case e.pki.oids["aes256-CBC"]:i=32,s=16,o=e.aes.createEncryptionCipher;break;case e.pki.oids["des-EDE3-CBC"]:i=24,s=8,o=e.des.createEncryptionCipher;break;default:throw{message:"Unsupported symmetric cipher, OID "+n}}if(t===undefined)t=e.util.createBuffer(e.random.getBytes(i));else if(t.length()!=i)throw{message:"Symmetric key has wrong length, got "+t.length()+" bytes, expected "+i};r.encryptedContent.algorithm=n,r.encryptedContent.key=t,r.encryptedContent.parameter=e.util.createBuffer(e.random.getBytes(s));var u=o(t);u.start(r.encryptedContent.parameter.copy()),u.update(r.content);if(!u.finish())throw{message:"Symmetric encryption failed."};r.encryptedContent.content=u.output}for(var a=0;a<r.recipients.length;a++){var f=r.recipients[a];if(f.encryptedContent.content!==undefined)continue;switch(f.encryptedContent.algorithm){case e.pki.oids.rsaEncryption:f.encryptedContent.content=f.encryptedContent.key.encrypt(r.encryptedContent.key.data);break;default:throw{message:"Unsupported asymmetric cipher, OID "+f.encryptedContent.algorithm}}}}},r}}var r="pkcs7";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/pkcs7",["require","module","./aes","./asn1","./des","./oids","./pem","./pkcs7asn1","./random","./util","./x509"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){function e(e){var t="forge.task",n=0,r={},i=0;e.debug.set(t,"tasks",r);var s={};e.debug.set(t,"queues",s);var o="?",u=30,a=20,f="ready",l="running",c="blocked",h="sleeping",p="done",d="error",v="stop",m="start",g="block",y="unblock",b="sleep",w="wakeup",E="cancel",S="fail",x={};x[f]={},x[f][v]=f,x[f][m]=l,x[f][E]=p,x[f][S]=d,x[l]={},x[l][v]=f,x[l][m]=l,x[l][g]=c,x[l][y]=l,x[l][b]=h,x[l][w]=l,x[l][E]=p,x[l][S]=d,x[c]={},x[c][v]=c,x[c][m]=c,x[c][g]=c,x[c][y]=c,x[c][b]=c,x[c][w]=c,x[c][E]=p,x[c][S]=d,x[h]={},x[h][v]=h,x[h][m]=h,x[h][g]=h,x[h][y]=h,x[h][b]=h,x[h][w]=h,x[h][E]=p,x[h][S]=d,x[p]={},x[p][v]=p,x[p][m]=p,x[p][g]=p,x[p][y]=p,x[p][b]=p,x[p][w]=p,x[p][E]=p,x[p][S]=d,x[d]={},x[d][v]=d,x[d][m]=d,x[d][g]=d,x[d][y]=d,x[d][b]=d,x[d][w]=d,x[d][E]=d,x[d][S]=d;var T=function(s){this.id=-1,this.name=s.name||o,this.parent=s.parent||null,this.run=s.run,this.subtasks=[],this.error=!1,this.state=f,this.blocks=0,this.timeoutId=null,this.swapTime=null,this.userData=null,this.id=i++,r[this.id]=this,n>=1&&e.log.verbose(t,"[%s][%s] init",this.id,this.name,this)};T.prototype.debug=function(n){n=n||"",e.log.debug(t,n,"[%s][%s] task:",this.id,this.name,this,"subtasks:",this.subtasks.length,"queue:",s)},T.prototype.next=function(e,t){typeof e=="function"&&(t=e,e=this.name);var n=new T({run:t,name:e,parent:this});return n.state=l,n.type=this.type,n.successCallback=this.successCallback||null,n.failureCallback=this.failureCallback||null,this.subtasks.push(n),this},T.prototype.parallel=function(t,n){return e.util.isArray(t)&&(n=t,t=this.name),this.next(t,function(r){var i=r;i.block(n.length);var s=function(t,r){e.task.start({type:t,run:function(e){n[r](e)},success:function(e){i.unblock()},failure:function(e){i.unblock()}})};for(var o=0;o<n.length;o++){var u=t+"__parallel-"+r.id+"-"+o,a=o;s(u,a)}})},T.prototype.stop=function(){this.state=x[this.state][v]},T.prototype.start=function(){this.error=!1,this.state=x[this.state][m],this.state===l&&(this.start=new Date,this.run(this),C(this,0))},T.prototype.block=function(e){e=typeof e=="undefined"?1:e,this.blocks+=e,this.blocks>0&&(this.state=x[this.state][g])},T.prototype.unblock=function(e){return e=typeof e=="undefined"?1:e,this.blocks-=e,this.blocks===0&&this.state!==p&&(this.state=l,C(this,0)),this.blocks},T.prototype.sleep=function(e){e=typeof e=="undefined"?0:e,this.state=x[this.state][b];var t=this;this.timeoutId=setTimeout(function(){t.timeoutId=null,t.state=l,C(t,0)},e)},T.prototype.wait=function(e){e.wait(this)},T.prototype.wakeup=function(){this.state===h&&(cancelTimeout(this.timeoutId),this.timeoutId=null,this.state=l,C(this,0))},T.prototype.cancel=function(){this.state=x[this.state][E],this.permitsNeeded=0,this.timeoutId!==null&&(cancelTimeout(this.timeoutId),this.timeoutId=null),this.subtasks=[]},T.prototype.fail=function(e){this.error=!0,k(this,!0);if(e)e.error=this.error,e.swapTime=this.swapTime,e.userData=this.userData,C(e,0);else{if(this.parent!==null){var t=this.parent;while(t.parent!==null)t.error=this.error,t.swapTime=this.swapTime,t.userData=this.userData,t=t.parent;k(t,!0)}this.failureCallback&&this.failureCallback(this)}};var N=function(e){e.error=!1,e.state=x[e.state][m],setTimeout(function(){e.state===l&&(e.swapTime=+(new Date),e.run(e),C(e,0))},0)},C=function(e,t){var n=t>u||+(new Date)-e.swapTime>a,r=function(t){t++;if(e.state===l){n&&(e.swapTime=+(new Date));if(e.subtasks.length>0){var r=e.subtasks.shift();r.error=e.error,r.swapTime=e.swapTime,r.userData=e.userData,r.run(r),r.error||C(r,t)}else k(e),e.error||e.parent!==null&&(e.parent.error=e.error,e.parent.swapTime=e.swapTime,e.parent.userData=e.userData,C(e.parent,t))}};n?setTimeout(r,0):r(t)},k=function(i,o){i.state=p,delete r[i.id],n>=1&&e.log.verbose(t,"[%s][%s] finish",i.id,i.name,i),i.parent===null&&(i.type in s?s[i.type].length===0?e.log.error(t,"[%s][%s] task queue empty [%s]",i.id,i.name,i.type):s[i.type][0]!==i?e.log.error(t,"[%s][%s] task not first in queue [%s]",i.id,i.name,i.type):(s[i.type].shift(),s[i.type].length===0?(n>=1&&e.log.verbose(t,"[%s][%s] delete queue [%s]",i.id,i.name,i.type),delete s[i.type]):(n>=1&&e.log.verbose(t,"[%s][%s] queue start next [%s] remain:%s",i.id,i.name,i.type,s[i.type].length),s[i.type][0].start())):e.log.error(t,"[%s][%s] task queue missing [%s]",i.id,i.name,i.type),o||(i.error&&i.failureCallback?i.failureCallback(i):!i.error&&i.successCallback&&i.successCallback(i)))};e.task=e.task||{},e.task.start=function(r){var i=new T({run:r.run,name:r.name||o});i.type=r.type,i.successCallback=r.success||null,i.failureCallback=r.failure||null,i.type in s?s[r.type].push(i):(n>=1&&e.log.verbose(t,"[%s][%s] create queue [%s]",i.id,i.name,i.type),s[i.type]=[i],N(i))},e.task.cancel=function(e){e in s&&(s[e]=[s[e][0]])},e.task.createCondition=function(){var e={tasks:{}};return e.wait=function(t){t.id in e.tasks||(t.block(),e.tasks[t.id]=t)},e.notify=function(){var t=e.tasks;e.tasks={};for(var n in t)t[n].unblock()},e}}var r="task";if(typeof n!="function"){if(typeof module!="object"||!module.exports)return typeof forge=="undefined"&&(forge={}),e(forge);var i=!0;n=function(e,n){n(t,module)}}var s,o=function(t,n){n.exports=function(n){var i=s.map(function(e){return t(e)}).concat(e);n=n||{},n.defined=n.defined||{};if(n.defined[r])return n[r];n.defined[r]=!0;for(var o=0;o<i.length;++o)i[o](n);return n[r]}},u=n;n=function(e,t){return s=typeof e=="string"?t.slice(2):e.slice(2),i?(delete n,u.apply(null,Array.prototype.slice.call(arguments,0))):(n=u,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/task",["require","module","./debug","./log","./util"],function(){o.apply(null,Array.prototype.slice.call(arguments,0))})}(),function(){var e="forge";if(typeof n!="function"){if(typeof module!="object"||!module.exports){typeof forge=="undefined"&&(forge={disableNativeCode:!1});return}var r=!0;n=function(e,n){n(t,module)}}var i,s=function(t,n){n.exports=function(n){var r=i.map(function(e){return t(e)});n=n||{},n.defined=n.defined||{};if(n.defined[e])return n[e];n.defined[e]=!0;for(var s=0;s<r.length;++s)r[s](n);return n},n.exports.disableNativeCode=!1,n.exports(n.exports)},o=n;n=function(e,t){return i=typeof e=="string"?t.slice(2):e.slice(2),r?(delete n,o.apply(null,Array.prototype.slice.call(arguments,0))):(n=o,n.apply(null,Array.prototype.slice.call(arguments,0)))},n("js/forge",["require","module","./aes","./aesCipherSuites","./asn1","./debug","./des","./hmac","./log","./pbkdf2","./pem","./pkcs7","./pkcs1","./pkcs12","./pki","./prng","./pss","./random","./rc2","./task","./tls","./util","./md","./mgf1"],function(){s.apply(null,Array.prototype.slice.call(arguments,0))})}(),window.forge=t("js/forge")})();
  }).call(this,require("sycGbZ"))
},{"sycGbZ":51}],6:[function(require,module,exports){
  (function (Buffer){
    var crypto = require("crypto");
    var BigInteger = require("jsbn");
    var ECPointFp = require("./lib/ec.js").ECPointFp;
    exports.ECCurves = require("./lib/sec.js");

// zero prepad
    function unstupid(hex,len)
    {
      return (hex.length >= len) ? hex : unstupid("0"+hex,len);
    }

    exports.ECKey = function(curve, key, isPublic)
    {
      var priv;
      var c = curve();
      var n = c.getN();
      var bytes = Math.floor(n.bitLength()/8);

      if(key)
      {
        if(isPublic)
        {
          if(key.length != bytes*2+1) return false;
          var curve = c.getCurve();
          var x = key.slice(1,bytes+1); // skip the 04 for uncompressed format
          var y = key.slice(bytes+1);
          this.P = new ECPointFp(curve,
            curve.fromBigInteger(new BigInteger(x.toString("hex"), 16)),
            curve.fromBigInteger(new BigInteger(y.toString("hex"), 16)));
        }else{
          if(key.length != bytes) return false;
          priv = new BigInteger(key.toString("hex"), 16);
        }
      }else{
        var n1 = n.subtract(BigInteger.ONE);
        var r = new BigInteger(crypto.randomBytes(n.bitLength()));
        priv = r.mod(n1).add(BigInteger.ONE);
        this.P = c.getG().multiply(priv);
      }
      if(this.P)
      {
        var pubhex = unstupid(this.P.getX().toBigInteger().toString(16),bytes*2)+unstupid(this.P.getY().toBigInteger().toString(16),bytes*2);
        this.PublicKey = new Buffer("04"+pubhex,"hex");
      }
      if(priv)
      {
        this.PrivateKey = new Buffer(unstupid(priv.toString(16),bytes*2),"hex");
        this.deriveSharedSecret = function(key)
        {
          if(!key || !key.P) return false;
          var S = key.P.multiply(priv);
          return new Buffer(unstupid(S.getX().toBigInteger().toString(16),bytes*2),"hex");
        }
      }
    }


  }).call(this,require("buffer").Buffer)
},{"./lib/ec.js":7,"./lib/sec.js":8,"buffer":29,"crypto":35,"jsbn":9}],7:[function(require,module,exports){
// Basic Javascript Elliptic Curve implementation
// Ported loosely from BouncyCastle's Java EC code
// Only Fp curves implemented for now

// Requires jsbn.js and jsbn2.js
  var BigInteger = require('jsbn')
  var Barrett = BigInteger.prototype.Barrett

// ----------------
// ECFieldElementFp

// constructor
  function ECFieldElementFp(q,x) {
    this.x = x;
    // TODO if(x.compareTo(q) >= 0) error
    this.q = q;
  }

  function feFpEquals(other) {
    if(other == this) return true;
    return (this.q.equals(other.q) && this.x.equals(other.x));
  }

  function feFpToBigInteger() {
    return this.x;
  }

  function feFpNegate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
  }

  function feFpAdd(b) {
    return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
  }

  function feFpSubtract(b) {
    return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
  }

  function feFpMultiply(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
  }

  function feFpSquare() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
  }

  function feFpDivide(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
  }

  ECFieldElementFp.prototype.equals = feFpEquals;
  ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
  ECFieldElementFp.prototype.negate = feFpNegate;
  ECFieldElementFp.prototype.add = feFpAdd;
  ECFieldElementFp.prototype.subtract = feFpSubtract;
  ECFieldElementFp.prototype.multiply = feFpMultiply;
  ECFieldElementFp.prototype.square = feFpSquare;
  ECFieldElementFp.prototype.divide = feFpDivide;

// ----------------
// ECPointFp

// constructor
  function ECPointFp(curve,x,y,z) {
    this.curve = curve;
    this.x = x;
    this.y = y;
    // Projective coordinates: either zinv == null or z * zinv == 1
    // z and zinv are just BigIntegers, not fieldElements
    if(z == null) {
      this.z = BigInteger.ONE;
    }
    else {
      this.z = z;
    }
    this.zinv = null;
    //TODO: compression flag
  }

  function pointFpGetX() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    var r = this.x.toBigInteger().multiply(this.zinv);
    this.curve.reduce(r);
    return this.curve.fromBigInteger(r);
  }

  function pointFpGetY() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    var r = this.y.toBigInteger().multiply(this.zinv);
    this.curve.reduce(r);
    return this.curve.fromBigInteger(r);
  }

  function pointFpEquals(other) {
    if(other == this) return true;
    if(this.isInfinity()) return other.isInfinity();
    if(other.isInfinity()) return this.isInfinity();
    var u, v;
    // u = Y2 * Z1 - Y1 * Z2
    u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
    if(!u.equals(BigInteger.ZERO)) return false;
    // v = X2 * Z1 - X1 * Z2
    v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
    return v.equals(BigInteger.ZERO);
  }

  function pointFpIsInfinity() {
    if((this.x == null) && (this.y == null)) return true;
    return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
  }

  function pointFpNegate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
  }

  function pointFpAdd(b) {
    if(this.isInfinity()) return b;
    if(b.isInfinity()) return this;

    // u = Y2 * Z1 - Y1 * Z2
    var u = b.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(b.z)).mod(this.curve.q);
    // v = X2 * Z1 - X1 * Z2
    var v = b.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(b.z)).mod(this.curve.q);

    if(BigInteger.ZERO.equals(v)) {
      if(BigInteger.ZERO.equals(u)) {
        return this.twice(); // this == b, so double
      }
      return this.curve.getInfinity(); // this = -b, so infinity
    }

    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();
    var x2 = b.x.toBigInteger();
    var y2 = b.y.toBigInteger();

    var v2 = v.square();
    var v3 = v2.multiply(v);
    var x1v2 = x1.multiply(v2);
    var zu2 = u.square().multiply(this.z);

    // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
    var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.q);
    // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
    var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.q);
    // z3 = v^3 * z1 * z2
    var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
  }

  function pointFpTwice() {
    if(this.isInfinity()) return this;
    if(this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();

    // TODO: optimized handling of constants
    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();

    var y1z1 = y1.multiply(this.z);
    var y1sqz1 = y1z1.multiply(y1).mod(this.curve.q);
    var a = this.curve.a.toBigInteger();

    // w = 3 * x1^2 + a * z1^2
    var w = x1.square().multiply(THREE);
    if(!BigInteger.ZERO.equals(a)) {
      w = w.add(this.z.square().multiply(a));
    }
    w = w.mod(this.curve.q);
    //this.curve.reduce(w);
    // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
    var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.q);
    // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
    var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.square().multiply(w)).mod(this.curve.q);
    // z3 = 8 * (y1 * z1)^3
    var z3 = y1z1.square().multiply(y1z1).shiftLeft(3).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
  }

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
  function pointFpMultiply(k) {
    if(this.isInfinity()) return this;
    if(k.signum() == 0) return this.curve.getInfinity();

    var e = k;
    var h = e.multiply(new BigInteger("3"));

    var neg = this.negate();
    var R = this;

    var i;
    for(i = h.bitLength() - 2; i > 0; --i) {
      R = R.twice();

      var hBit = h.testBit(i);
      var eBit = e.testBit(i);

      if (hBit != eBit) {
        R = R.add(hBit ? this : neg);
      }
    }

    return R;
  }

// Compute this*j + x*k (simultaneous multiplication)
  function pointFpMultiplyTwo(j,x,k) {
    var i;
    if(j.bitLength() > k.bitLength())
      i = j.bitLength() - 1;
    else
      i = k.bitLength() - 1;

    var R = this.curve.getInfinity();
    var both = this.add(x);
    while(i >= 0) {
      R = R.twice();
      if(j.testBit(i)) {
        if(k.testBit(i)) {
          R = R.add(both);
        }
        else {
          R = R.add(this);
        }
      }
      else {
        if(k.testBit(i)) {
          R = R.add(x);
        }
      }
      --i;
    }

    return R;
  }

  ECPointFp.prototype.getX = pointFpGetX;
  ECPointFp.prototype.getY = pointFpGetY;
  ECPointFp.prototype.equals = pointFpEquals;
  ECPointFp.prototype.isInfinity = pointFpIsInfinity;
  ECPointFp.prototype.negate = pointFpNegate;
  ECPointFp.prototype.add = pointFpAdd;
  ECPointFp.prototype.twice = pointFpTwice;
  ECPointFp.prototype.multiply = pointFpMultiply;
  ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

// ----------------
// ECCurveFp

// constructor
  function ECCurveFp(q,a,b) {
    this.q = q;
    this.a = this.fromBigInteger(a);
    this.b = this.fromBigInteger(b);
    this.infinity = new ECPointFp(this, null, null);
    this.reducer = new Barrett(this.q);
  }

  function curveFpGetQ() {
    return this.q;
  }

  function curveFpGetA() {
    return this.a;
  }

  function curveFpGetB() {
    return this.b;
  }

  function curveFpEquals(other) {
    if(other == this) return true;
    return(this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b));
  }

  function curveFpGetInfinity() {
    return this.infinity;
  }

  function curveFpFromBigInteger(x) {
    return new ECFieldElementFp(this.q, x);
  }

  function curveReduce(x) {
    this.reducer.reduce(x);
  }

// for now, work with hex strings because they're easier in JS
  function curveFpDecodePointHex(s) {
    switch(parseInt(s.substr(0,2), 16)) { // first byte
      case 0:
        return this.infinity;
      case 2:
      case 3:
        // point compression not supported yet
        return null;
      case 4:
      case 6:
      case 7:
        var len = (s.length - 2) / 2;
        var xHex = s.substr(2, len);
        var yHex = s.substr(len+2, len);

        return new ECPointFp(this,
          this.fromBigInteger(new BigInteger(xHex, 16)),
          this.fromBigInteger(new BigInteger(yHex, 16)));

      default: // unsupported
        return null;
    }
  }

  function curveFpEncodePointHex(p) {
    if (p.isInfinity()) return "00";
    var xHex = p.getX().toBigInteger().toString(16);
    var yHex = p.getY().toBigInteger().toString(16);
    var oLen = this.getQ().toString(16).length;
    if ((oLen % 2) != 0) oLen++;
    while (xHex.length < oLen) {
      xHex = "0" + xHex;
    }
    while (yHex.length < oLen) {
      yHex = "0" + yHex;
    }
    return "04" + xHex + yHex;
  }

  ECCurveFp.prototype.getQ = curveFpGetQ;
  ECCurveFp.prototype.getA = curveFpGetA;
  ECCurveFp.prototype.getB = curveFpGetB;
  ECCurveFp.prototype.equals = curveFpEquals;
  ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
  ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
  ECCurveFp.prototype.reduce = curveReduce;
  ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
  ECCurveFp.prototype.encodePointHex = curveFpEncodePointHex;

  var exports = {
    ECCurveFp: ECCurveFp,
    ECPointFp: ECPointFp,
    ECFieldElementFp: ECFieldElementFp
  }

  module.exports = exports

},{"jsbn":9}],8:[function(require,module,exports){
// Named EC curves

// Requires ec.js, jsbn.js, and jsbn2.js
  var BigInteger = require('jsbn')
  var ECCurveFp = require('./ec.js').ECCurveFp


// ----------------
// X9ECParameters

// constructor
  function X9ECParameters(curve,g,n,h) {
    this.curve = curve;
    this.g = g;
    this.n = n;
    this.h = h;
  }

  function x9getCurve() {
    return this.curve;
  }

  function x9getG() {
    return this.g;
  }

  function x9getN() {
    return this.n;
  }

  function x9getH() {
    return this.h;
  }

  X9ECParameters.prototype.getCurve = x9getCurve;
  X9ECParameters.prototype.getG = x9getG;
  X9ECParameters.prototype.getN = x9getN;
  X9ECParameters.prototype.getH = x9getH;

// ----------------
// SECNamedCurves

  function fromHex(s) { return new BigInteger(s, 16); }

  function secp128r1() {
    // p = 2^128 - 2^97 - 1
    var p = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("E87579C11079F43DD824993C2CEE5ED3");
    //byte[] S = Hex.decode("000E0D4D696E6768756151750CC03A4473D03679");
    var n = fromHex("FFFFFFFE0000000075A30D1B9038A115");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "161FF7528B899B2D0C28607CA52C5B86"
      + "CF5AC8395BAFEB13C02DA292DDED7A83");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp160k1() {
    // p = 2^160 - 2^32 - 2^14 - 2^12 - 2^9 - 2^8 - 2^7 - 2^3 - 2^2 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73");
    var a = BigInteger.ZERO;
    var b = fromHex("7");
    //byte[] S = null;
    var n = fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "3B4C382CE37AA192A4019E763036F4F5DD4D7EBB"
      + "938CF935318FDCED6BC28286531733C3F03C4FEE");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp160r1() {
    // p = 2^160 - 2^31 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC");
    var b = fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45");
    //byte[] S = Hex.decode("1053CDE42C14D696E67687561517533BF3F83345");
    var n = fromHex("0100000000000000000001F4C8F927AED3CA752257");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "4A96B5688EF573284664698968C38BB913CBFC82"
      + "23A628553168947D59DCC912042351377AC5FB32");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp192k1() {
    // p = 2^192 - 2^32 - 2^12 - 2^8 - 2^7 - 2^6 - 2^3 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37");
    var a = BigInteger.ZERO;
    var b = fromHex("3");
    //byte[] S = null;
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D"
      + "9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp192r1() {
    // p = 2^192 - 2^64 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC");
    var b = fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1");
    //byte[] S = Hex.decode("3045AE6FC8422F64ED579528D38120EAE12196D5");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012"
      + "07192B95FFC8DA78631011ED6B24CDD573F977A11E794811");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp224r1() {
    // p = 2^224 - 2^96 + 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE");
    var b = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4");
    //byte[] S = Hex.decode("BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21"
      + "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34");
    return new X9ECParameters(curve, G, n, h);
  }

  function secp256r1() {
    // p = 2^224 (2^32 - 1) + 2^192 + 2^96 - 1
    var p = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B");
    //byte[] S = Hex.decode("C49D360886E704936A6678E1139D26B7819F7E90");
    var n = fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
      + "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296"
      + "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");
    return new X9ECParameters(curve, G, n, h);
  }

// TODO: make this into a proper hashtable
  function getSECCurveByName(name) {
    if(name == "secp128r1") return secp128r1();
    if(name == "secp160k1") return secp160k1();
    if(name == "secp160r1") return secp160r1();
    if(name == "secp192k1") return secp192k1();
    if(name == "secp192r1") return secp192r1();
    if(name == "secp224r1") return secp224r1();
    if(name == "secp256r1") return secp256r1();
    return null;
  }

  module.exports = {
    "secp128r1":secp128r1,
    "secp160k1":secp160k1,
    "secp160r1":secp160r1,
    "secp192k1":secp192k1,
    "secp192r1":secp192r1,
    "secp224r1":secp224r1,
    "secp256r1":secp256r1
  }

},{"./ec.js":7,"jsbn":9}],9:[function(require,module,exports){
  (function(){

    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Basic JavaScript BN library - subset useful for RSA encryption.

    // Bits per digit
    var dbits;

    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)==0xefcafe);

    // (public) Constructor
    function BigInteger(a,b,c) {
      if(a != null)
        if("number" == typeof a) this.fromNumber(a,b,c);
        else if(b == null && "string" != typeof a) this.fromString(a,256);
        else this.fromString(a,b);
    }

    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
      while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
      }
      return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
      var xl = x&0x7fff, xh = x>>15;
      while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
      }
      return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
      var xl = x&0x3fff, xh = x>>14;
      while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
      }
      return c;
    }
    var inBrowser = typeof navigator !== "undefined";
    if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
      BigInteger.prototype.am = am2;
      dbits = 30;
    }
    else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
      BigInteger.prototype.am = am1;
      dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
      BigInteger.prototype.am = am3;
      dbits = 28;
    }

    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);

    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;

    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
      var c = BI_RC[s.charCodeAt(i)];
      return (c==null)?-1:c;
    }

    // (protected) copy this to r
    function bnpCopyTo(r) {
      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
      r.t = this.t;
      r.s = this.s;
    }

    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
      this.t = 1;
      this.s = (x<0)?-1:0;
      if(x > 0) this[0] = x;
      else if(x < -1) this[0] = x+DV;
      else this.t = 0;
    }

    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

    // (protected) set from string and radix
    function bnpFromString(s,b) {
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 256) k = 8; // byte array
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else { this.fromRadix(s,b); return; }
      this.t = 0;
      this.s = 0;
      var i = s.length, mi = false, sh = 0;
      while(--i >= 0) {
        var x = (k==8)?s[i]&0xff:intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-") mi = true;
          continue;
        }
        mi = false;
        if(sh == 0)
          this[this.t++] = x;
        else if(sh+k > this.DB) {
          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
          this[this.t++] = (x>>(this.DB-sh));
        }
        else
          this[this.t-1] |= x<<sh;
        sh += k;
        if(sh >= this.DB) sh -= this.DB;
      }
      if(k == 8 && (s[0]&0x80) != 0) {
        this.s = -1;
        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
      }
      this.clamp();
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) clamp off excess high words
    function bnpClamp() {
      var c = this.s&this.DM;
      while(this.t > 0 && this[this.t-1] == c) --this.t;
    }

    // (public) return string representation in given radix
    function bnToString(b) {
      if(this.s < 0) return "-"+this.negate().toString(b);
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else return this.toRadix(b);
      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
      var p = this.DB-(i*this.DB)%k;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
        while(i >= 0) {
          if(p < k) {
            d = (this[i]&((1<<p)-1))<<(k-p);
            d |= this[--i]>>(p+=this.DB-k);
          }
          else {
            d = (this[i]>>(p-=k))&km;
            if(p <= 0) { p += this.DB; --i; }
          }
          if(d > 0) m = true;
          if(m) r += int2char(d);
        }
      }
      return m?r:"0";
    }

    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }

    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
      var r = this.s-a.s;
      if(r != 0) return r;
      var i = this.t;
      r = i-a.t;
      if(r != 0) return (this.s<0)?-r:r;
      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
      return 0;
    }

    // returns bit length of the integer x
    function nbits(x) {
      var r = 1, t;
      if((t=x>>>16) != 0) { x = t; r += 16; }
      if((t=x>>8) != 0) { x = t; r += 8; }
      if((t=x>>4) != 0) { x = t; r += 4; }
      if((t=x>>2) != 0) { x = t; r += 2; }
      if((t=x>>1) != 0) { x = t; r += 1; }
      return r;
    }

    // (public) return the number of bits in "this"
    function bnBitLength() {
      if(this.t <= 0) return 0;
      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }

    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
      var i;
      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
      for(i = n-1; i >= 0; --i) r[i] = 0;
      r.t = this.t+n;
      r.s = this.s;
    }

    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
      r.t = Math.max(this.t-n,0);
      r.s = this.s;
    }

    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<cbs)-1;
      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
      for(i = this.t-1; i >= 0; --i) {
        r[i+ds+1] = (this[i]>>cbs)|c;
        c = (this[i]&bm)<<bs;
      }
      for(i = ds-1; i >= 0; --i) r[i] = 0;
      r[ds] = c;
      r.t = this.t+ds+1;
      r.s = this.s;
      r.clamp();
    }

    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
      r.s = this.s;
      var ds = Math.floor(n/this.DB);
      if(ds >= this.t) { r.t = 0; return; }
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<bs)-1;
      r[0] = this[ds]>>bs;
      for(var i = ds+1; i < this.t; ++i) {
        r[i-ds-1] |= (this[i]&bm)<<cbs;
        r[i-ds] = this[i]>>bs;
      }
      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
      r.t = this.t-ds;
      r.clamp();
    }

    // (protected) r = this - a
    function bnpSubTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]-a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c -= a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c -= a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = (c<0)?-1:0;
      if(c < -1) r[i++] = this.DV+c;
      else if(c > 0) r[i++] = c;
      r.t = i;
      r.clamp();
    }

    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
      var x = this.abs(), y = a.abs();
      var i = x.t;
      r.t = i+y.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
      r.s = 0;
      r.clamp();
      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }

    // (protected) r = this^2, r != this (HAC 14.16)
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2*x.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < x.t-1; ++i) {
        var c = x.am(i,x[i],r,2*i,0,1);
        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
          r[i+x.t] -= x.DV;
          r[i+x.t+1] = 1;
        }
      }
      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
      r.s = 0;
      r.clamp();
    }

    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
      var pm = m.abs();
      if(pm.t <= 0) return;
      var pt = this.abs();
      if(pt.t < pm.t) {
        if(q != null) q.fromInt(0);
        if(r != null) this.copyTo(r);
        return;
      }
      if(r == null) r = nbi();
      var y = nbi(), ts = this.s, ms = m.s;
      var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
      else { pm.copyTo(y); pt.copyTo(r); }
      var ys = y.t;
      var y0 = y[ys-1];
      if(y0 == 0) return;
      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
      y.dlShiftTo(j,t);
      if(r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t,r);
      }
      BigInteger.ONE.dlShiftTo(ys,t);
      t.subTo(y,y);  // "negative" y so we can replace sub with am later
      while(y.t < ys) y[y.t++] = 0;
      while(--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
          y.dlShiftTo(j,t);
          r.subTo(t,r);
          while(r[i] < --qd) r.subTo(t,r);
        }
      }
      if(q != null) {
        r.drShiftTo(ys,q);
        if(ts != ms) BigInteger.ZERO.subTo(q,q);
      }
      r.t = ys;
      r.clamp();
      if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
      if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }

    // (public) this mod a
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a,null,r);
      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
      return r;
    }

    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
      else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
      if(this.t < 1) return 0;
      var x = this[0];
      if((x&1) == 0) return 0;
      var y = x&3;       // y == 1/x mod 2^2
      y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
      y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
      // last step - calculate inverse mod DV directly;
      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
      y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
      // we really want the negative inverse, and -DV < y < DV
      return (y>0)?this.DV-y:-y;
    }

    // Montgomery reduction
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp&0x7fff;
      this.mph = this.mp>>15;
      this.um = (1<<(m.DB-15))-1;
      this.mt2 = 2*m.t;
    }

    // xR mod m
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t,r);
      r.divRemTo(this.m,null,r);
      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
      return r;
    }

    // x/R mod m
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }

    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
      while(x.t <= this.mt2) // pad x so am has enough room later
        x[x.t++] = 0;
      for(var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i]&0x7fff;
        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i+this.m.t;
        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
        // propagate carry
        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
      }
      x.clamp();
      x.drShiftTo(this.m.t,x);
      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = "x^2/R mod m"; x != r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = "xy/R mod m"; x,y != r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
      g.copyTo(r);
      while(--i >= 0) {
        z.sqrTo(r,r2);
        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
        else { var t = r; r = r2; r2 = t; }
      }
      return z.revert(r);
    }

    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
      var z;
      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
      return this.exp(e,z);
    }

    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;

    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;

    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    // Copyright (c) 2005-2009  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Extended JavaScript BN functions, required for RSA private ops.

    // Version 1.1: new BigInteger("0", 10) returns "proper" zero
    // Version 1.2: square() API, isProbablePrime fix

    // (public)
    function bnClone() { var r = nbi(); this.copyTo(r); return r; }

    // (public) return value as integer
    function bnIntValue() {
      if(this.s < 0) {
        if(this.t == 1) return this[0]-this.DV;
        else if(this.t == 0) return -1;
      }
      else if(this.t == 1) return this[0];
      else if(this.t == 0) return 0;
      // assumes 16 < DB < 32
      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }

    // (public) return value as byte
    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

    // (public) return value as short (assumes DB>=16)
    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

    // (public) 0 if this == 0, 1 if this > 0
    function bnSigNum() {
      if(this.s < 0) return -1;
      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
      else return 1;
    }

    // (protected) convert to radix string
    function bnpToRadix(b) {
      if(b == null) b = 10;
      if(this.signum() == 0 || b < 2 || b > 36) return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b,cs);
      var d = nbv(a), y = nbi(), z = nbi(), r = "";
      this.divRemTo(d,y,z);
      while(y.signum() > 0) {
        r = (a+z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d,y,z);
      }
      return z.intValue().toString(b) + r;
    }

    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
      this.fromInt(0);
      if(b == null) b = 10;
      var cs = this.chunkSize(b);
      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
      for(var i = 0; i < s.length; ++i) {
        var x = intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
          continue;
        }
        w = b*w+x;
        if(++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w,0);
          j = 0;
          w = 0;
        }
      }
      if(j > 0) {
        this.dMultiply(Math.pow(b,j));
        this.dAddOffset(w,0);
      }
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) alternate constructor
    function bnpFromNumber(a,b,c) {
      if("number" == typeof b) {
        // new BigInteger(int,int,RNG)
        if(a < 2) this.fromInt(1);
        else {
          this.fromNumber(a,c);
          if(!this.testBit(a-1))	// force MSB set
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
          if(this.isEven()) this.dAddOffset(1,0); // force odd
          while(!this.isProbablePrime(b)) {
            this.dAddOffset(2,0);
            if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
          }
        }
      }
      else {
        // new BigInteger(int,RNG)
        var x = new Array(), t = a&7;
        x.length = (a>>3)+1;
        b.nextBytes(x);
        if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
        this.fromString(x,256);
      }
    }

    // (public) convert to bigendian byte array
    function bnToByteArray() {
      var i = this.t, r = new Array();
      r[0] = this.s;
      var p = this.DB-(i*this.DB)%8, d, k = 0;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
          r[k++] = d|(this.s<<(this.DB-p));
        while(i >= 0) {
          if(p < 8) {
            d = (this[i]&((1<<p)-1))<<(8-p);
            d |= this[--i]>>(p+=this.DB-8);
          }
          else {
            d = (this[i]>>(p-=8))&0xff;
            if(p <= 0) { p += this.DB; --i; }
          }
          if((d&0x80) != 0) d |= -256;
          if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
          if(k > 0 || d != this.s) r[k++] = d;
        }
      }
      return r;
    }

    function bnEquals(a) { return(this.compareTo(a)==0); }
    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

    // (protected) r = this op a (bitwise)
    function bnpBitwiseTo(a,op,r) {
      var i, f, m = Math.min(a.t,this.t);
      for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
      if(a.t < this.t) {
        f = a.s&this.DM;
        for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
        r.t = this.t;
      }
      else {
        f = this.s&this.DM;
        for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
        r.t = a.t;
      }
      r.s = op(this.s,a.s);
      r.clamp();
    }

    // (public) this & a
    function op_and(x,y) { return x&y; }
    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

    // (public) this | a
    function op_or(x,y) { return x|y; }
    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

    // (public) this ^ a
    function op_xor(x,y) { return x^y; }
    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

    // (public) this & ~a
    function op_andnot(x,y) { return x&~y; }
    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

    // (public) ~this
    function bnNot() {
      var r = nbi();
      for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }

    // (public) this << n
    function bnShiftLeft(n) {
      var r = nbi();
      if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
      return r;
    }

    // (public) this >> n
    function bnShiftRight(n) {
      var r = nbi();
      if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
      return r;
    }

    // return index of lowest 1-bit in x, x < 2^31
    function lbit(x) {
      if(x == 0) return -1;
      var r = 0;
      if((x&0xffff) == 0) { x >>= 16; r += 16; }
      if((x&0xff) == 0) { x >>= 8; r += 8; }
      if((x&0xf) == 0) { x >>= 4; r += 4; }
      if((x&3) == 0) { x >>= 2; r += 2; }
      if((x&1) == 0) ++r;
      return r;
    }

    // (public) returns index of lowest 1-bit (or -1 if none)
    function bnGetLowestSetBit() {
      for(var i = 0; i < this.t; ++i)
        if(this[i] != 0) return i*this.DB+lbit(this[i]);
      if(this.s < 0) return this.t*this.DB;
      return -1;
    }

    // return number of 1 bits in x
    function cbit(x) {
      var r = 0;
      while(x != 0) { x &= x-1; ++r; }
      return r;
    }

    // (public) return number of set bits
    function bnBitCount() {
      var r = 0, x = this.s&this.DM;
      for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
      return r;
    }

    // (public) true iff nth bit is set
    function bnTestBit(n) {
      var j = Math.floor(n/this.DB);
      if(j >= this.t) return(this.s!=0);
      return((this[j]&(1<<(n%this.DB)))!=0);
    }

    // (protected) this op (1<<n)
    function bnpChangeBit(n,op) {
      var r = BigInteger.ONE.shiftLeft(n);
      this.bitwiseTo(r,op,r);
      return r;
    }

    // (public) this | (1<<n)
    function bnSetBit(n) { return this.changeBit(n,op_or); }

    // (public) this & ~(1<<n)
    function bnClearBit(n) { return this.changeBit(n,op_andnot); }

    // (public) this ^ (1<<n)
    function bnFlipBit(n) { return this.changeBit(n,op_xor); }

    // (protected) r = this + a
    function bnpAddTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]+a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c += a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c += a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = (c<0)?-1:0;
      if(c > 0) r[i++] = c;
      else if(c < -1) r[i++] = this.DV+c;
      r.t = i;
      r.clamp();
    }

    // (public) this + a
    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

    // (public) this - a
    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

    // (public) this * a
    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

    // (public) this^2
    function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

    // (public) this / a
    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

    // (public) this % a
    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

    // (public) [this/a,this%a]
    function bnDivideAndRemainder(a) {
      var q = nbi(), r = nbi();
      this.divRemTo(a,q,r);
      return new Array(q,r);
    }

    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
      this[this.t] = this.am(0,n-1,this,0,0,this.t);
      ++this.t;
      this.clamp();
    }

    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
      if(n == 0) return;
      while(this.t <= w) this[this.t++] = 0;
      this[w] += n;
      while(this[w] >= this.DV) {
        this[w] -= this.DV;
        if(++w >= this.t) this[this.t++] = 0;
        ++this[w];
      }
    }

    // A "null" reducer
    function NullExp() {}
    function nNop(x) { return x; }
    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
    function nSqrTo(x,r) { x.squareTo(r); }

    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;

    // (public) this^e
    function bnPow(e) { return this.exp(e,new NullExp()); }

    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    function bnpMultiplyLowerTo(a,n,r) {
      var i = Math.min(this.t+a.t,n);
      r.s = 0; // assumes a,this >= 0
      r.t = i;
      while(i > 0) r[--i] = 0;
      var j;
      for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
      for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
      r.clamp();
    }

    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    function bnpMultiplyUpperTo(a,n,r) {
      --n;
      var i = r.t = this.t+a.t-n;
      r.s = 0; // assumes a,this >= 0
      while(--i >= 0) r[i] = 0;
      for(i = Math.max(n-this.t,0); i < a.t; ++i)
        r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
      r.clamp();
      r.drShiftTo(1,r);
    }

    // Barrett modular reduction
    function Barrett(m) {
      // setup Barrett
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }

    function barrettConvert(x) {
      if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
      else if(x.compareTo(this.m) < 0) return x;
      else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    function barrettRevert(x) { return x; }

    // x = x mod m (HAC 14.42)
    function barrettReduce(x) {
      x.drShiftTo(this.m.t-1,this.r2);
      if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
      this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
      this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
      while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
      x.subTo(this.r2,x);
      while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = x^2 mod m; x != r
    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = x*y mod m; x,y != r
    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;

    // (public) this^e % m (HAC 14.85)
    function bnModPow(e,m) {
      var i = e.bitLength(), k, r = nbv(1), z;
      if(i <= 0) return r;
      else if(i < 18) k = 1;
      else if(i < 48) k = 3;
      else if(i < 144) k = 4;
      else if(i < 768) k = 5;
      else k = 6;
      if(i < 8)
        z = new Classic(m);
      else if(m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);

      // precomputation
      var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
      g[1] = z.convert(this);
      if(k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1],g2);
        while(n <= km) {
          g[n] = nbi();
          z.mulTo(g2,g[n-2],g[n]);
          n += 2;
        }
      }

      var j = e.t-1, w, is1 = true, r2 = nbi(), t;
      i = nbits(e[j])-1;
      while(j >= 0) {
        if(i >= k1) w = (e[j]>>(i-k1))&km;
        else {
          w = (e[j]&((1<<(i+1))-1))<<(k1-i);
          if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
        }

        n = k;
        while((w&1) == 0) { w >>= 1; --n; }
        if((i -= n) < 0) { i += this.DB; --j; }
        if(is1) {	// ret == 1, don't bother squaring or multiplying it
          g[w].copyTo(r);
          is1 = false;
        }
        else {
          while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
          if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
          z.mulTo(r2,g[w],r);
        }

        while(j >= 0 && (e[j]&(1<<i)) == 0) {
          z.sqrTo(r,r2); t = r; r = r2; r2 = t;
          if(--i < 0) { i = this.DB-1; --j; }
        }
      }
      return z.revert(r);
    }

    // (public) gcd(this,a) (HAC 14.54)
    function bnGCD(a) {
      var x = (this.s<0)?this.negate():this.clone();
      var y = (a.s<0)?a.negate():a.clone();
      if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
      if(g < 0) return x;
      if(i < g) g = i;
      if(g > 0) {
        x.rShiftTo(g,x);
        y.rShiftTo(g,y);
      }
      while(x.signum() > 0) {
        if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
        if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
        if(x.compareTo(y) >= 0) {
          x.subTo(y,x);
          x.rShiftTo(1,x);
        }
        else {
          y.subTo(x,y);
          y.rShiftTo(1,y);
        }
      }
      if(g > 0) y.lShiftTo(g,y);
      return y;
    }

    // (protected) this % n, n < 2^26
    function bnpModInt(n) {
      if(n <= 0) return 0;
      var d = this.DV%n, r = (this.s<0)?n-1:0;
      if(this.t > 0)
        if(d == 0) r = this[0]%n;
        else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
      return r;
    }

    // (public) 1/this % m (HAC 14.61)
    function bnModInverse(m) {
      var ac = m.isEven();
      if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
      var u = m.clone(), v = this.clone();
      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
      while(u.signum() != 0) {
        while(u.isEven()) {
          u.rShiftTo(1,u);
          if(ac) {
            if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
            a.rShiftTo(1,a);
          }
          else if(!b.isEven()) b.subTo(m,b);
          b.rShiftTo(1,b);
        }
        while(v.isEven()) {
          v.rShiftTo(1,v);
          if(ac) {
            if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
            c.rShiftTo(1,c);
          }
          else if(!d.isEven()) d.subTo(m,d);
          d.rShiftTo(1,d);
        }
        if(u.compareTo(v) >= 0) {
          u.subTo(v,u);
          if(ac) a.subTo(c,a);
          b.subTo(d,b);
        }
        else {
          v.subTo(u,v);
          if(ac) c.subTo(a,c);
          d.subTo(b,d);
        }
      }
      if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
      if(d.compareTo(m) >= 0) return d.subtract(m);
      if(d.signum() < 0) d.addTo(m,d); else return d;
      if(d.signum() < 0) return d.add(m); else return d;
    }

    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
    var lplim = (1<<26)/lowprimes[lowprimes.length-1];

    // (public) test primality with certainty >= 1-.5^t
    function bnIsProbablePrime(t) {
      var i, x = this.abs();
      if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
        for(i = 0; i < lowprimes.length; ++i)
          if(x[0] == lowprimes[i]) return true;
        return false;
      }
      if(x.isEven()) return false;
      i = 1;
      while(i < lowprimes.length) {
        var m = lowprimes[i], j = i+1;
        while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
        m = x.modInt(m);
        while(i < j) if(m%lowprimes[i++] == 0) return false;
      }
      return x.millerRabin(t);
    }

    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    function bnpMillerRabin(t) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();
      if(k <= 0) return false;
      var r = n1.shiftRight(k);
      t = (t+1)>>1;
      if(t > lowprimes.length) t = lowprimes.length;
      var a = nbi();
      for(var i = 0; i < t; ++i) {
        //Pick bases at random, instead of starting at 2
        a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
        var y = a.modPow(r,this);
        if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while(j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2,this);
            if(y.compareTo(BigInteger.ONE) == 0) return false;
          }
          if(y.compareTo(n1) != 0) return false;
        }
      }
      return true;
    }

    // protected
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;

    // public
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

    // JSBN-specific extension
    BigInteger.prototype.square = bnSquare;

    // Expose the Barrett function
    BigInteger.prototype.Barrett = Barrett

    // BigInteger interfaces not implemented in jsbn:

    // BigInteger(int signum, byte[] magnitude)
    // double doubleValue()
    // float floatValue()
    // int hashCode()
    // long longValue()
    // static BigInteger valueOf(long val)
    if (typeof exports !== 'undefined') {
      exports = module.exports = BigInteger;
    } else {
      this.BigInteger = BigInteger;
    }

  }).call(this);

},{}],10:[function(require,module,exports){
  var cs2a = require("./cs2a.js");
  var ecc = require("ecc-jsbn");
  require("./forge.min.js"); // PITA not browserify compat
  cs2a.crypt(ecc,forge);

  Object.keys(cs2a).forEach(function(f){ exports[f] = cs2a[f]; });


},{"./cs2a.js":11,"./forge.min.js":12,"ecc-jsbn":13}],11:[function(require,module,exports){
  (function (Buffer){
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


  }).call(this,require("buffer").Buffer)
},{"buffer":29,"crypto":35,"sjcl":17}],12:[function(require,module,exports){
  module.exports=require(5)
},{"sycGbZ":51}],13:[function(require,module,exports){
  module.exports=require(6)
},{"./lib/ec.js":14,"./lib/sec.js":15,"buffer":29,"crypto":35,"jsbn":16}],14:[function(require,module,exports){
  module.exports=require(7)
},{"jsbn":16}],15:[function(require,module,exports){
  module.exports=require(8)
},{"./ec.js":14,"jsbn":16}],16:[function(require,module,exports){
  module.exports=require(9)
},{}],17:[function(require,module,exports){
  "use strict";function q(a){throw a;}var t=void 0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
  "undefined"!==typeof module&&module.exports&&(module.exports=sjcl);
  sjcl.cipher.aes=function(a){this.k[0][0][0]||this.D();var b,c,d,e,f=this.k[0][4],g=this.k[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
    255]]};
  sjcl.cipher.aes.prototype={encrypt:function(a){return y(this,a,0)},decrypt:function(a){return y(this,a,1)},k:[[[],[],[],[],[]],[[],[],[],[],[]]],D:function(){var a=this.k[0],b=this.k[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,n,m,p;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[k=h[f]]];p=0x1010101*n^0x10001*e^0x101*k^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
  function y(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,n=d.length/4-2,m,p=4,s=[0,0,0,0];h=a.k[c];a=h[0];var r=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],k=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=l,g=k;for(m=0;4>
    m;m++)s[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return s}
  sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===t?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
    b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
    c},P:function(a,b,c,d){var e;e=0;for(d===t&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},l:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
  sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
  sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
  sjcl.codec.base64={J:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.J,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.J,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
    0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.D();a?(this.r=a.r.slice(0),this.o=a.o.slice(0),this.h=a.h):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
  sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.r=this.N.slice(0);this.o=[];this.h=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.o=sjcl.bitArray.concat(this.o,a);b=this.h;a=this.h=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)z(this,c.splice(0,16));return this},finalize:function(){var a,b=this.o,c=this.r,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.h/
    4294967296));for(b.push(this.h|0);b.length;)z(this,b.splice(0,16));this.reset();return c},N:[],b:[],D:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.N[b]=a(Math.pow(c,0.5)));this.b[b]=a(Math.pow(c,1/3));b++}}};
  function z(a,b){var c,d,e,f=b.slice(0),g=a.r,h=a.b,l=g[0],k=g[1],n=g[2],m=g[3],p=g[4],s=g[5],r=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(r^p&(s^r))+h[c],v=r,r=s,s=p,p=m+d|0,m=n,n=k,k=l,l=d+(k&n^m&(k^n))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+n|0;g[3]=g[3]+m|0;g[4]=g[4]+p|0;g[5]=g[5]+s|0;g[6]=
    g[6]+r|0;g[7]=g[7]+v|0}
  sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,l=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];7>l&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&k>>>8*f;f++);f<15-l&&(f=15-l);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.L(a,b,c,d,e,f);g=sjcl.mode.ccm.p(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),l=f.clamp(b,h-e),k=f.bitSlice(b,
      h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));l=sjcl.mode.ccm.p(a,l,c,k,e,b);a=sjcl.mode.ccm.L(a,l.data,c,d,e,b);f.equal(l.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return l.data},L:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,l=h.l;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
    f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(l(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(l(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},p:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.l;var l=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
      f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!l)return{tag:d,data:[]};for(g=0;g<l;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,k)}}};
  sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.H,l=sjcl.bitArray,k=l.l,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=k(n,m),p=p.concat(k(c,a.encrypt(k(c,m)))),c=h(c);m=b.slice(g);b=l.bitLength(m);g=a.encrypt(k(c,[0,0,0,b]));m=l.clamp(k(m.concat([0,0,0]),g),b);n=k(n,k(m.concat([0,0,0]),g));n=a.encrypt(k(n,k(c,h(c))));d.length&&
  (n=k(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(l.concat(m,l.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.H,h=sjcl.bitArray,l=h.l,k=[0,0,0,0],n=g(a.encrypt(c)),m,p,s=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<s/32;c+=4)m=l(n,a.decrypt(l(n,b.slice(c,c+4)))),k=l(k,m),r=r.concat(m),n=g(n);p=s-32*c;m=a.encrypt(l(n,[0,0,0,p]));m=l(m,h.clamp(b.slice(c),p).concat([0,0,0]));
    k=l(k,m);k=a.encrypt(l(k,l(n,g(n))));d.length&&(k=l(k,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(k,e),h.bitSlice(b,s))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.H,e=sjcl.bitArray,f=e.l,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
    d(h))),g))},H:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
  sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.p(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.p(u,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},Z:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.l;e=[0,0,0,0];f=b.slice(0);
    for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},g:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.Z(b,a);return b},p:function(a,b,c,d,e,f){var g,h,l,k,n,m,p,s,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);s=r.bitLength(d);h=r.bitLength(e);g=b.encrypt([0,
    0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.g(g,[0,0,0,0],e),e=sjcl.mode.gcm.g(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.g(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.g(g,h,c));for(k=0;k<m;k+=4)n[3]++,l=b.encrypt(n),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.g(g,h,c));a=[Math.floor(s/0x100000000),s&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.g(g,d,a);l=b.encrypt(e);d[0]^=l[0];
    d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.n=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.n[0].update(c[0]);this.n[1].update(c[1]);this.G=new b(this.n[0])};
  sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.Q&&q(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.G=new this.M(this.n[0]);this.Q=u};sjcl.misc.hmac.prototype.update=function(a){this.Q=!0;this.G.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.G.finalize(),a=(new this.M(this.n[1])).update(a).finalize();this.reset();return a};
  sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],n=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(n.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=n.clamp(k,d));return k};
  sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.i=[0];this.F=0;this.s={};this.C=0;this.K={};this.O=this.d=this.j=this.W=0;this.b=[0,0,0,0,0,0,0,0];this.f=[0,0,0,0];this.A=t;this.B=a;this.q=u;this.w={progress:{},seeded:{}};this.m=this.V=0;this.t=1;this.u=2;this.S=0x10000;this.I=[0,48,64,96,128,192,0x100,384,512,768,1024];this.T=3E4;this.R=80};
  sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.m&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.u){d=!(d&this.t);e=[];var f=0,g;this.O=e[0]=(new Date).valueOf()+this.T;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&!(e=e.concat(this.c[g].finalize()),f+=this.i[g],this.i[g]=0,!d&&this.F&1<<g);g++);this.F>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.i.push(0));this.d-=f;f>this.j&&(this.j=f);this.F++;
    this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.A=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.f[d]=this.f[d]+1|0,this.f[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.S&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&q("Setting paranoia=0 will ruin your security; use it only for testing");this.B=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),
    g=this.s[c],h=this.isReady(),l=0;d=this.K[c];d===t&&(d=this.K[c]=this.W++);g===t&&(g=this.s[c]=0);this.s[c]=(this.s[c]+1)%this.c.length;switch(typeof a){case "number":b===t&&(b=1);this.c[g].update([d,this.C++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!==typeof a[c]&&(l=1)}if(!l){if(b===t)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,
    e>>>=1;this.c[g].update([d,this.C++,2,b,f,a.length].concat(a))}break;case "string":b===t&&(b=a.length);this.c[g].update([d,this.C++,3,b,f,a.length]);this.c[g].update(a);break;default:l=1}l&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.i[g]+=b;this.d+=b;h===this.m&&(this.isReady()!==this.m&&C("seeded",Math.max(this.j,this.d)),C("progress",this.getProgress()))},isReady:function(a){a=this.I[a!==t?a:this.B];return this.j&&this.j>=a?this.i[0]>this.R&&
    (new Date).valueOf()>this.O?this.u|this.t:this.t:this.d>=a?this.u|this.m:this.m},getProgress:function(a){a=this.I[a?a:this.B];return this.j>=a?1:this.d>a?1:this.d/a},startCollectors:function(){this.q||(this.a={loadTimeCollector:D(this,this.aa),mouseCollector:D(this,this.ba),keyboardCollector:D(this,this.$),accelerometerCollector:D(this,this.U)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,u),window.addEventListener("mousemove",this.a.mouseCollector,u),window.addEventListener("keypress",
    this.a.keyboardCollector,u),window.addEventListener("devicemotion",this.a.accelerometerCollector,u)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):q(new sjcl.exception.bug("can't attach event")),this.q=!0)},stopCollectors:function(){this.q&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,u),window.removeEventListener("mousemove",
    this.a.mouseCollector,u),window.removeEventListener("keypress",this.a.keyboardCollector,u),window.removeEventListener("devicemotion",this.a.accelerometerCollector,u)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.q=u)},addEventListener:function(a,b){this.w[a][this.V++]=b},removeEventListener:function(a,b){var c,d,e=this.w[a],f=[];for(d in e)e.hasOwnProperty(d)&&
    e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},$:function(){E(1)},ba:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse");E(0)},aa:function(){E(2)},U:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,2,"accelerometer");E(0)}};
  function C(a,b){var c,d=sjcl.random.w[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function E(a){window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function A(a){a.b=B(a).concat(B(a));a.A=new sjcl.cipher.aes(a.b)}function B(a){for(var b=0;4>b&&!(a.f[b]=a.f[b]+1|0,a.f[b]);b++);return a.A.encrypt(a.f)}
  function D(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
  a:try{var F,G,H,I;if(I="undefined"!==typeof module){var J;if(J=module.exports){var K;try{K=require("crypto")}catch(L){K=null}J=(G=K)&&G.randomBytes}I=J}if(I)F=G.randomBytes(128),F=new Uint32Array((new Uint8Array(F)).buffer),sjcl.random.addEntropy(F,1024,"crypto['randomBytes']");else if(window&&Uint32Array){H=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(H);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(H);
  else break a;sjcl.random.addEntropy(H,1024,"crypto['getRandomValues']")}}catch(M){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(M))}
  sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},Y:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.e({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.e(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||4<
    f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.e(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   b,c,d){var e=sjcl.json,f=e.Y.apply(e,arguments);return e.encode(f)},X:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.e(e.e(e.e({},e.defaults),b),c,!0);var f;c=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&q(new sjcl.exception.invalid("json decrypt: invalid parameters"));
    "string"===typeof a?(f=sjcl.misc.cachedPbkdf2(a,b),a=f.key.slice(0,b.ks/32),b.salt=f.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.e(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.X(a,e.decode(b),c,d)},encode:function(a){var b,c=
    "{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));
    a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),b[d[2]]=d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]);return b},e:function(a,b,c){a===t&&(a={});if(b===t)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==t&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),
    a[d]=b[d]);return a},ea:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},da:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==t&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.ca={};
  sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.ca,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===t?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

},{"crypto":35}],18:[function(require,module,exports){
  (function (Buffer){
    var io = require("socket.io-client");

    exports.install = function(self)
    {
      var sockets = {};
      self.deliver("http", function(path, msg, to) {
        if(!sockets[path.http]){
          sockets[path.http] = io.connect(path.http);
          sockets[path.http].on("packet", function(packet){
            self.receive((new Buffer(packet.data, "base64")).toString("binary"), path);
          });
        }
        sockets[path.http].emit("packet", {data: msg.toString("base64")});
      });
    }


  }).call(this,require("buffer").Buffer)
},{"buffer":29,"socket.io-client":19}],19:[function(require,module,exports){
  /*! Socket.IO.js build:0.9.17, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

  var io = ('undefined' === typeof module ? {} : module.exports);
  (function() {

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, global) {

      /**
       * IO namespace.
       *
       * @namespace
       */

      var io = exports;

      /**
       * Socket.IO version
       *
       * @api public
       */

      io.version = '0.9.17';

      /**
       * Protocol implemented.
       *
       * @api public
       */

      io.protocol = 1;

      /**
       * Available transports, these will be populated with the available transports
       *
       * @api public
       */

      io.transports = [];

      /**
       * Keep track of jsonp callbacks.
       *
       * @api private
       */

      io.j = [];

      /**
       * Keep track of our io.Sockets
       *
       * @api private
       */
      io.sockets = {};


      /**
       * Manages connections to hosts.
       *
       * @param {String} uri
       * @Param {Boolean} force creation of new socket (defaults to false)
       * @api public
       */

      io.connect = function (host, details) {
        var uri = io.util.parseUri(host)
          , uuri
          , socket;

        if (global && global.location) {
          uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
          uri.host = uri.host || (global.document
            ? global.document.domain : global.location.hostname);
          uri.port = uri.port || global.location.port;
        }

        uuri = io.util.uniqueUri(uri);

        var options = {
          host: uri.host
          , secure: 'https' == uri.protocol
          , port: uri.port || ('https' == uri.protocol ? 443 : 80)
          , query: uri.query || ''
        };

        io.util.merge(options, details);
        //EDIT: fix for telehash init not working if initial connect fails
        // if (options['force new connection'] || !io.sockets[uuri]) {
        if (options['force new connection'] || !io.sockets[uuri] || 
          // this is the state of telehash seed socket after initial failure
          (!io.sockets[uuri].connected && !io.sockets[uuri].connecting && 
            !io.sockets[uuri].open && !io.sockets[uuri].reconnecting) ) {
          socket = new io.Socket(options);
        }

        if (!options['force new connection'] && socket) {
          io.sockets[uuri] = socket;
        }

        socket = socket || io.sockets[uuri];

        // if path is different from '' or /
        return socket.of(uri.path.length > 1 ? uri.path : '');
      };

    })('object' === typeof module ? module.exports : (this.io = {}), this);
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, global) {

      /**
       * Utilities namespace.
       *
       * @namespace
       */

      var util = exports.util = {};

      /**
       * Parses an URI
       *
       * @author Steven Levithan <stevenlevithan.com> (MIT license)
       * @api public
       */

      var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

      var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
        'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
        'anchor'];

      util.parseUri = function (str) {
        var m = re.exec(str || '')
          , uri = {}
          , i = 14;

        while (i--) {
          uri[parts[i]] = m[i] || '';
        }

        return uri;
      };

      /**
       * Produces a unique url that identifies a Socket.IO connection.
       *
       * @param {Object} uri
       * @api public
       */

      util.uniqueUri = function (uri) {
        var protocol = uri.protocol
          , host = uri.host
          , port = uri.port;

        if ('document' in global) {
          host = host || document.domain;
          port = port || (protocol == 'https'
            && document.location.protocol !== 'https:' ? 443 : document.location.port);
        } else {
          host = host || 'localhost';

          if (!port && protocol == 'https') {
            port = 443;
          }
        }

        return (protocol || 'http') + '://' + host + ':' + (port || 80);
      };

      /**
       * Mergest 2 query strings in to once unique query string
       *
       * @param {String} base
       * @param {String} addition
       * @api public
       */

      util.query = function (base, addition) {
        var query = util.chunkQuery(base || '')
          , components = [];

        util.merge(query, util.chunkQuery(addition || ''));
        for (var part in query) {
          if (query.hasOwnProperty(part)) {
            components.push(part + '=' + query[part]);
          }
        }

        return components.length ? '?' + components.join('&') : '';
      };

      /**
       * Transforms a querystring in to an object
       *
       * @param {String} qs
       * @api public
       */

      util.chunkQuery = function (qs) {
        var query = {}
          , params = qs.split('&')
          , i = 0
          , l = params.length
          , kv;

        for (; i < l; ++i) {
          kv = params[i].split('=');
          if (kv[0]) {
            query[kv[0]] = kv[1];
          }
        }

        return query;
      };

      /**
       * Executes the given function when the page is loaded.
       *
       *     io.util.load(function () { console.log('page loaded'); });
       *
       * @param {Function} fn
       * @api public
       */

      var pageLoaded = false;

      util.load = function (fn) {
        if ('document' in global && document.readyState === 'complete' || pageLoaded) {
          return fn();
        }

        util.on(global, 'load', fn, false);
      };

      /**
       * Adds an event.
       *
       * @api private
       */

      util.on = function (element, event, fn, capture) {
        if (element.attachEvent) {
          element.attachEvent('on' + event, fn);
        } else if (element.addEventListener) {
          element.addEventListener(event, fn, capture);
        }
      };

      /**
       * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
       *
       * @param {Boolean} [xdomain] Create a request that can be used cross domain.
       * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
       * @api private
       */

      util.request = function (xdomain) {

        if (xdomain && 'undefined' != typeof XDomainRequest && !util.ua.hasCORS) {
          return new XDomainRequest();
        }

        if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
          return new XMLHttpRequest();
        }

        if (!xdomain) {
          try {
            return new window[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
          } catch(e) { }
        }

        return null;
      };

      /**
       * XHR based transport constructor.
       *
       * @constructor
       * @api public
       */

      /**
       * Change the internal pageLoaded value.
       */

      if ('undefined' != typeof window) {
        util.load(function () {
          pageLoaded = true;
        });
      }

      /**
       * Defers a function to ensure a spinner is not displayed by the browser
       *
       * @param {Function} fn
       * @api public
       */

      util.defer = function (fn) {
        if (!util.ua.webkit || 'undefined' != typeof importScripts) {
          return fn();
        }

        util.load(function () {
          setTimeout(fn, 100);
        });
      };

      /**
       * Merges two objects.
       *
       * @api public
       */

      util.merge = function merge (target, additional, deep, lastseen) {
        var seen = lastseen || []
          , depth = typeof deep == 'undefined' ? 2 : deep
          , prop;

        for (prop in additional) {
          if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
            if (typeof target[prop] !== 'object' || !depth) {
              target[prop] = additional[prop];
              seen.push(additional[prop]);
            } else {
              util.merge(target[prop], additional[prop], depth - 1, seen);
            }
          }
        }

        return target;
      };

      /**
       * Merges prototypes from objects
       *
       * @api public
       */

      util.mixin = function (ctor, ctor2) {
        util.merge(ctor.prototype, ctor2.prototype);
      };

      /**
       * Shortcut for prototypical and static inheritance.
       *
       * @api private
       */

      util.inherit = function (ctor, ctor2) {
        function f() {};
        f.prototype = ctor2.prototype;
        ctor.prototype = new f;
      };

      /**
       * Checks if the given object is an Array.
       *
       *     io.util.isArray([]); // true
       *     io.util.isArray({}); // false
       *
       * @param Object obj
       * @api public
       */

      util.isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };

      /**
       * Intersects values of two arrays into a third
       *
       * @api public
       */

      util.intersect = function (arr, arr2) {
        var ret = []
          , longest = arr.length > arr2.length ? arr : arr2
          , shortest = arr.length > arr2.length ? arr2 : arr;

        for (var i = 0, l = shortest.length; i < l; i++) {
          if (~util.indexOf(longest, shortest[i]))
            ret.push(shortest[i]);
        }

        return ret;
      };

      /**
       * Array indexOf compatibility.
       *
       * @see bit.ly/a5Dxa2
       * @api public
       */

      util.indexOf = function (arr, o, i) {

        for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0;
             i < j && arr[i] !== o; i++) {}

        return j <= i ? -1 : i;
      };

      /**
       * Converts enumerables to array.
       *
       * @api public
       */

      util.toArray = function (enu) {
        var arr = [];

        for (var i = 0, l = enu.length; i < l; i++)
          arr.push(enu[i]);

        return arr;
      };

      /**
       * UA / engines detection namespace.
       *
       * @namespace
       */

      util.ua = {};

      /**
       * Whether the UA supports CORS for XHR.
       *
       * @api public
       */

      util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
        try {
          var a = new XMLHttpRequest();
        } catch (e) {
          return false;
        }

        return a.withCredentials != undefined;
      })();

      /**
       * Detect webkit.
       *
       * @api public
       */

      util.ua.webkit = 'undefined' != typeof navigator
        && /webkit/i.test(navigator.userAgent);

      /**
       * Detect iPad/iPhone/iPod.
       *
       * @api public
       */

      util.ua.iDevice = 'undefined' != typeof navigator
        && /iPad|iPhone|iPod/i.test(navigator.userAgent);

    })('undefined' != typeof io ? io : module.exports, this);
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Expose constructor.
       */

      exports.EventEmitter = EventEmitter;

      /**
       * Event emitter constructor.
       *
       * @api public.
       */

      function EventEmitter () {};

      /**
       * Adds a listener
       *
       * @api public
       */

      EventEmitter.prototype.on = function (name, fn) {
        if (!this.$events) {
          this.$events = {};
        }

        if (!this.$events[name]) {
          this.$events[name] = fn;
        } else if (io.util.isArray(this.$events[name])) {
          this.$events[name].push(fn);
        } else {
          this.$events[name] = [this.$events[name], fn];
        }

        return this;
      };

      EventEmitter.prototype.addListener = EventEmitter.prototype.on;

      /**
       * Adds a volatile listener.
       *
       * @api public
       */

      EventEmitter.prototype.once = function (name, fn) {
        var self = this;

        function on () {
          self.removeListener(name, on);
          fn.apply(this, arguments);
        };

        on.listener = fn;
        this.on(name, on);

        return this;
      };

      /**
       * Removes a listener.
       *
       * @api public
       */

      EventEmitter.prototype.removeListener = function (name, fn) {
        if (this.$events && this.$events[name]) {
          var list = this.$events[name];

          if (io.util.isArray(list)) {
            var pos = -1;

            for (var i = 0, l = list.length; i < l; i++) {
              if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
                pos = i;
                break;
              }
            }

            if (pos < 0) {
              return this;
            }

            list.splice(pos, 1);

            if (!list.length) {
              delete this.$events[name];
            }
          } else if (list === fn || (list.listener && list.listener === fn)) {
            delete this.$events[name];
          }
        }

        return this;
      };

      /**
       * Removes all listeners for an event.
       *
       * @api public
       */

      EventEmitter.prototype.removeAllListeners = function (name) {
        if (name === undefined) {
          this.$events = {};
          return this;
        }

        if (this.$events && this.$events[name]) {
          this.$events[name] = null;
        }

        return this;
      };

      /**
       * Gets all listeners for a certain event.
       *
       * @api publci
       */

      EventEmitter.prototype.listeners = function (name) {
        if (!this.$events) {
          this.$events = {};
        }

        if (!this.$events[name]) {
          this.$events[name] = [];
        }

        if (!io.util.isArray(this.$events[name])) {
          this.$events[name] = [this.$events[name]];
        }

        return this.$events[name];
      };

      /**
       * Emits an event.
       *
       * @api public
       */

      EventEmitter.prototype.emit = function (name) {
        if (!this.$events) {
          return false;
        }

        var handler = this.$events[name];

        if (!handler) {
          return false;
        }

        var args = Array.prototype.slice.call(arguments, 1);

        if ('function' == typeof handler) {
          handler.apply(this, args);
        } else if (io.util.isArray(handler)) {
          var listeners = handler.slice();

          for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i].apply(this, args);
          }
        } else {
          return false;
        }

        return true;
      };

    })(
        'undefined' != typeof io ? io : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    /**
     * Based on JSON2 (http://www.JSON.org/js.html).
     */

    (function (exports, nativeJSON) {
      "use strict";

      // use native JSON if it's available
      if (nativeJSON && nativeJSON.parse){
        return exports.JSON = {
          parse: nativeJSON.parse
          , stringify: nativeJSON.stringify
        };
      }

      var JSON = exports.JSON = {};

      function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
      }

      function date(d, key) {
        return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
      };

      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
        },
        rep;


      function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }


      function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
          value = date(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
          case 'string':
            return quote(value);

          case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

          case 'boolean':
          case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

          case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
              return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || 'null';
              }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

              v = partial.length === 0 ? '[]' : gap ?
                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                '[' + partial.join(',') + ']';
              gap = mind;
              return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                if (typeof rep[i] === 'string') {
                  k = rep[i];
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                  }
                }
              }
            } else {

// Otherwise, iterate through all of the keys in the object.

              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                  }
                }
              }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
              '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
      }

// If the JSON object does not yet have a stringify method, give it one.

      JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

        if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
            indent += ' ';
          }

// If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
          indent = space;
        }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
        }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

        return str('', {'': value});
      };

// If the JSON object does not yet have a parse method, give it one.

      JSON.parse = function (text, reviver) {
        // The parse method takes a text and an optional reviver function, and returns
        // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

          // The walk method is used to recursively walk the resulting structure so
          // that modifications can be made.

          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = walk(value, k);
                if (v !== undefined) {
                  value[k] = v;
                } else {
                  delete value[k];
                }
              }
            }
          }
          return reviver.call(holder, key, value);
        }


        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
          text = text.replace(cx, function (a) {
            return '\\u' +
              ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
        }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with '()' and 'new'
        // because they can cause invocation, and '=' because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
          .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

          // In the third stage we use the eval function to compile the text into a
          // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
          // in JavaScript: it can begin a block or an object literal. We wrap the text
          // in parens to eliminate the ambiguity.

          j = eval('(' + text + ')');

          // In the optional fourth stage, we recursively walk the new structure, passing
          // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === 'function' ?
            walk({'': j}, '') : j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
      };

    })(
        'undefined' != typeof io ? io : module.exports
      , typeof JSON !== 'undefined' ? JSON : undefined
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Parser namespace.
       *
       * @namespace
       */

      var parser = exports.parser = {};

      /**
       * Packet types.
       */

      var packets = parser.packets = [
        'disconnect'
        , 'connect'
        , 'heartbeat'
        , 'message'
        , 'json'
        , 'event'
        , 'ack'
        , 'error'
        , 'noop'
      ];

      /**
       * Errors reasons.
       */

      var reasons = parser.reasons = [
        'transport not supported'
        , 'client not handshaken'
        , 'unauthorized'
      ];

      /**
       * Errors advice.
       */

      var advice = parser.advice = [
        'reconnect'
      ];

      /**
       * Shortcuts.
       */

      var JSON = io.JSON
        , indexOf = io.util.indexOf;

      /**
       * Encodes a packet.
       *
       * @api private
       */

      parser.encodePacket = function (packet) {
        var type = indexOf(packets, packet.type)
          , id = packet.id || ''
          , endpoint = packet.endpoint || ''
          , ack = packet.ack
          , data = null;

        switch (packet.type) {
          case 'error':
            var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
              , adv = packet.advice ? indexOf(advice, packet.advice) : '';

            if (reason !== '' || adv !== '')
              data = reason + (adv !== '' ? ('+' + adv) : '');

            break;

          case 'message':
            if (packet.data !== '')
              data = packet.data;
            break;

          case 'event':
            var ev = { name: packet.name };

            if (packet.args && packet.args.length) {
              ev.args = packet.args;
            }

            data = JSON.stringify(ev);
            break;

          case 'json':
            data = JSON.stringify(packet.data);
            break;

          case 'connect':
            if (packet.qs)
              data = packet.qs;
            break;

          case 'ack':
            data = packet.ackId
              + (packet.args && packet.args.length
                ? '+' + JSON.stringify(packet.args) : '');
            break;
        }

        // construct packet with required fragments
        var encoded = [
          type
          , id + (ack == 'data' ? '+' : '')
          , endpoint
        ];

        // data fragment is optional
        if (data !== null && data !== undefined)
          encoded.push(data);

        return encoded.join(':');
      };

      /**
       * Encodes multiple messages (payload).
       *
       * @param {Array} messages
       * @api private
       */

      parser.encodePayload = function (packets) {
        var decoded = '';

        if (packets.length == 1)
          return packets[0];

        for (var i = 0, l = packets.length; i < l; i++) {
          var packet = packets[i];
          decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
        }

        return decoded;
      };

      /**
       * Decodes a packet
       *
       * @api private
       */

      var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

      parser.decodePacket = function (data) {
        var pieces = data.match(regexp);

        if (!pieces) return {};

        var id = pieces[2] || ''
          , data = pieces[5] || ''
          , packet = {
            type: packets[pieces[1]]
            , endpoint: pieces[4] || ''
          };

        // whether we need to acknowledge the packet
        if (id) {
          packet.id = id;
          if (pieces[3])
            packet.ack = 'data';
          else
            packet.ack = true;
        }

        // handle different packet types
        switch (packet.type) {
          case 'error':
            var pieces = data.split('+');
            packet.reason = reasons[pieces[0]] || '';
            packet.advice = advice[pieces[1]] || '';
            break;

          case 'message':
            packet.data = data || '';
            break;

          case 'event':
            try {
              var opts = JSON.parse(data);
              packet.name = opts.name;
              packet.args = opts.args;
            } catch (e) { }

            packet.args = packet.args || [];
            break;

          case 'json':
            try {
              packet.data = JSON.parse(data);
            } catch (e) { }
            break;

          case 'connect':
            packet.qs = data || '';
            break;

          case 'ack':
            var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
            if (pieces) {
              packet.ackId = pieces[1];
              packet.args = [];

              if (pieces[3]) {
                try {
                  packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
                } catch (e) { }
              }
            }
            break;

          case 'disconnect':
          case 'heartbeat':
            break;
        };

        return packet;
      };

      /**
       * Decodes data payload. Detects multiple messages
       *
       * @return {Array} messages
       * @api public
       */

      parser.decodePayload = function (data) {
        // IE doesn't like data[i] for unicode chars, charAt works fine
        if (data.charAt(0) == '\ufffd') {
          var ret = [];

          for (var i = 1, length = ''; i < data.length; i++) {
            if (data.charAt(i) == '\ufffd') {
              ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
              i += Number(length) + 1;
              length = '';
            } else {
              length += data.charAt(i);
            }
          }

          return ret;
        } else {
          return [parser.decodePacket(data)];
        }
      };

    })(
        'undefined' != typeof io ? io : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Expose constructor.
       */

      exports.Transport = Transport;

      /**
       * This is the transport template for all supported transport methods.
       *
       * @constructor
       * @api public
       */

      function Transport (socket, sessid) {
        this.socket = socket;
        this.sessid = sessid;
      };

      /**
       * Apply EventEmitter mixin.
       */

      io.util.mixin(Transport, io.EventEmitter);


      /**
       * Indicates whether heartbeats is enabled for this transport
       *
       * @api private
       */

      Transport.prototype.heartbeats = function () {
        return true;
      };

      /**
       * Handles the response from the server. When a new response is received
       * it will automatically update the timeout, decode the message and
       * forwards the response to the onMessage function for further processing.
       *
       * @param {String} data Response from the server.
       * @api private
       */

      Transport.prototype.onData = function (data) {
        this.clearCloseTimeout();

        // If the connection in currently open (or in a reopening state) reset the close
        // timeout since we have just received data. This check is necessary so
        // that we don't reset the timeout on an explicitly disconnected connection.
        if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
          this.setCloseTimeout();
        }

        if (data !== '') {
          // todo: we should only do decodePayload for xhr transports
          var msgs = io.parser.decodePayload(data);

          if (msgs && msgs.length) {
            for (var i = 0, l = msgs.length; i < l; i++) {
              this.onPacket(msgs[i]);
            }
          }
        }

        return this;
      };

      /**
       * Handles packets.
       *
       * @api private
       */

      Transport.prototype.onPacket = function (packet) {
        this.socket.setHeartbeatTimeout();

        if (packet.type == 'heartbeat') {
          return this.onHeartbeat();
        }

        if (packet.type == 'connect' && packet.endpoint == '') {
          this.onConnect();
        }

        if (packet.type == 'error' && packet.advice == 'reconnect') {
          this.isOpen = false;
        }

        this.socket.onPacket(packet);

        return this;
      };

      /**
       * Sets close timeout
       *
       * @api private
       */

      Transport.prototype.setCloseTimeout = function () {
        if (!this.closeTimeout) {
          var self = this;

          this.closeTimeout = setTimeout(function () {
            self.onDisconnect();
          }, this.socket.closeTimeout);
        }
      };

      /**
       * Called when transport disconnects.
       *
       * @api private
       */

      Transport.prototype.onDisconnect = function () {
        if (this.isOpen) this.close();
        this.clearTimeouts();
        this.socket.onDisconnect();
        return this;
      };

      /**
       * Called when transport connects
       *
       * @api private
       */

      Transport.prototype.onConnect = function () {
        this.socket.onConnect();
        return this;
      };

      /**
       * Clears close timeout
       *
       * @api private
       */

      Transport.prototype.clearCloseTimeout = function () {
        if (this.closeTimeout) {
          clearTimeout(this.closeTimeout);
          this.closeTimeout = null;
        }
      };

      /**
       * Clear timeouts
       *
       * @api private
       */

      Transport.prototype.clearTimeouts = function () {
        this.clearCloseTimeout();

        if (this.reopenTimeout) {
          clearTimeout(this.reopenTimeout);
        }
      };

      /**
       * Sends a packet
       *
       * @param {Object} packet object.
       * @api private
       */

      Transport.prototype.packet = function (packet) {
        this.send(io.parser.encodePacket(packet));
      };

      /**
       * Send the received heartbeat message back to server. So the server
       * knows we are still connected.
       *
       * @param {String} heartbeat Heartbeat response from the server.
       * @api private
       */

      Transport.prototype.onHeartbeat = function (heartbeat) {
        this.packet({ type: 'heartbeat' });
      };

      /**
       * Called when the transport opens.
       *
       * @api private
       */

      Transport.prototype.onOpen = function () {
        this.isOpen = true;
        this.clearCloseTimeout();
        this.socket.onOpen();
      };

      /**
       * Notifies the base when the connection with the Socket.IO server
       * has been disconnected.
       *
       * @api private
       */

      Transport.prototype.onClose = function () {
        var self = this;

        /* FIXME: reopen delay causing a infinit loop
         this.reopenTimeout = setTimeout(function () {
         self.open();
         }, this.socket.options['reopen delay']);*/

        this.isOpen = false;
        this.socket.onClose();
        this.onDisconnect();
      };

      /**
       * Generates a connection url based on the Socket.IO URL Protocol.
       * See <https://github.com/learnboost/socket.io-node/> for more details.
       *
       * @returns {String} Connection url
       * @api private
       */

      Transport.prototype.prepareUrl = function () {
        var options = this.socket.options;

        return this.scheme() + '://'
          + options.host + ':' + options.port + '/'
          + options.resource + '/' + io.protocol
          + '/' + this.name + '/' + this.sessid;
      };

      /**
       * Checks if the transport is ready to start a connection.
       *
       * @param {Socket} socket The socket instance that needs a transport
       * @param {Function} fn The callback
       * @api private
       */

      Transport.prototype.ready = function (socket, fn) {
        fn.call(this);
      };
    })(
        'undefined' != typeof io ? io : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io, global) {

      /**
       * Expose constructor.
       */

      exports.Socket = Socket;

      /**
       * Create a new `Socket.IO client` which can establish a persistent
       * connection with a Socket.IO enabled server.
       *
       * @api public
       */

      function Socket (options) {
        this.options = {
          port: 80
          , secure: false
          , document: 'document' in global ? document : false
          , resource: 'socket.io'
          , transports: io.transports
          , 'connect timeout': 10000
          , 'try multiple transports': true
          , 'reconnect': true
          , 'reconnection delay': 500
          , 'reconnection limit': Infinity
          , 'reopen delay': 3000
          , 'max reconnection attempts': 10
          , 'sync disconnect on unload': false
          , 'auto connect': true
          , 'flash policy port': 10843
          , 'manualFlush': false
        };

        io.util.merge(this.options, options);

        this.connected = false;
        this.open = false;
        this.connecting = false;
        this.reconnecting = false;
        this.namespaces = {};
        this.buffer = [];
        this.doBuffer = false;

        if (this.options['sync disconnect on unload'] &&
          (!this.isXDomain() || io.util.ua.hasCORS)) {
          var self = this;
          io.util.on(global, 'beforeunload', function () {
            self.disconnectSync();
          }, false);
        }

        if (this.options['auto connect']) {
          this.connect();
        }
      };

      /**
       * Apply EventEmitter mixin.
       */

      io.util.mixin(Socket, io.EventEmitter);

      /**
       * Returns a namespace listener/emitter for this socket
       *
       * @api public
       */

      Socket.prototype.of = function (name) {
        if (!this.namespaces[name]) {
          this.namespaces[name] = new io.SocketNamespace(this, name);

          if (name !== '') {
            this.namespaces[name].packet({ type: 'connect' });
          }
        }

        return this.namespaces[name];
      };

      /**
       * Emits the given event to the Socket and all namespaces
       *
       * @api private
       */

      Socket.prototype.publish = function () {
        this.emit.apply(this, arguments);

        var nsp;

        for (var i in this.namespaces) {
          if (this.namespaces.hasOwnProperty(i)) {
            nsp = this.of(i);
            nsp.$emit.apply(nsp, arguments);
          }
        }
      };

      /**
       * Performs the handshake
       *
       * @api private
       */

      function empty () { };

      Socket.prototype.handshake = function (fn) {
        var self = this
          , options = this.options;

        function complete (data) {
          if (data instanceof Error) {
            self.connecting = false;
            self.onError(data.message);
          } else {
            fn.apply(null, data.split(':'));
          }
        };

        var url = [
            'http' + (options.secure ? 's' : '') + ':/'
          , options.host + ':' + options.port
          , options.resource
          , io.protocol
          , io.util.query(this.options.query, 't=' + +new Date)
        ].join('/');

        if (this.isXDomain() && !io.util.ua.hasCORS) {
          var insertAt = document.getElementsByTagName('script')[0]
            , script = document.createElement('script');

          script.src = url + '&jsonp=' + io.j.length;
          insertAt.parentNode.insertBefore(script, insertAt);

          io.j.push(function (data) {
            complete(data);
            script.parentNode.removeChild(script);
          });
        } else {
          var xhr = io.util.request();

          xhr.open('GET', url, true);
          if (this.isXDomain()) {
            xhr.withCredentials = true;
          }
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              xhr.onreadystatechange = empty;

              if (xhr.status == 200) {
                complete(xhr.responseText);
              } else if (xhr.status == 403) {
                self.onError(xhr.responseText);
              } else {
                self.connecting = false;
                !self.reconnecting && self.onError(xhr.responseText);
              }
            }
          };
          xhr.send(null);
        }
      };

      /**
       * Find an available transport based on the options supplied in the constructor.
       *
       * @api private
       */

      Socket.prototype.getTransport = function (override) {
        var transports = override || this.transports, match;

        for (var i = 0, transport; transport = transports[i]; i++) {
          if (io.Transport[transport]
            && io.Transport[transport].check(this)
            && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
            return new io.Transport[transport](this, this.sessionid);
          }
        }

        return null;
      };

      /**
       * Connects to the server.
       *
       * @param {Function} [fn] Callback.
       * @returns {io.Socket}
       * @api public
       */

      Socket.prototype.connect = function (fn) {
        if (this.connecting) {
          return this;
        }

        var self = this;
        self.connecting = true;

        this.handshake(function (sid, heartbeat, close, transports) {
          self.sessionid = sid;
          self.closeTimeout = close * 1000;
          self.heartbeatTimeout = heartbeat * 1000;
          if(!self.transports)
            self.transports = self.origTransports = (transports ? io.util.intersect(
              transports.split(',')
              , self.options.transports
            ) : self.options.transports);

          self.setHeartbeatTimeout();

          function connect (transports){
            if (self.transport) self.transport.clearTimeouts();

            self.transport = self.getTransport(transports);
            if (!self.transport) return self.publish('connect_failed');

            // once the transport is ready
            self.transport.ready(self, function () {
              self.connecting = true;
              self.publish('connecting', self.transport.name);
              self.transport.open();

              if (self.options['connect timeout']) {
                self.connectTimeoutTimer = setTimeout(function () {
                  if (!self.connected) {
                    self.connecting = false;

                    if (self.options['try multiple transports']) {
                      var remaining = self.transports;

                      while (remaining.length > 0 && remaining.splice(0,1)[0] !=
                        self.transport.name) {}

                      if (remaining.length){
                        connect(remaining);
                      } else {
                        self.publish('connect_failed');
                      }
                    }
                  }
                }, self.options['connect timeout']);
              }
            });
          }

          connect(self.transports);

          self.once('connect', function (){
            clearTimeout(self.connectTimeoutTimer);

            fn && typeof fn == 'function' && fn();
          });
        });

        return this;
      };

      /**
       * Clears and sets a new heartbeat timeout using the value given by the
       * server during the handshake.
       *
       * @api private
       */

      Socket.prototype.setHeartbeatTimeout = function () {
        clearTimeout(this.heartbeatTimeoutTimer);
        if(this.transport && !this.transport.heartbeats()) return;

        var self = this;
        this.heartbeatTimeoutTimer = setTimeout(function () {
          self.transport.onClose();
        }, this.heartbeatTimeout);
      };

      /**
       * Sends a message.
       *
       * @param {Object} data packet.
       * @returns {io.Socket}
       * @api public
       */

      Socket.prototype.packet = function (data) {
        if (this.connected && !this.doBuffer) {
          this.transport.packet(data);
        } else {
          this.buffer.push(data);
        }

        return this;
      };

      /**
       * Sets buffer state
       *
       * @api private
       */

      Socket.prototype.setBuffer = function (v) {
        this.doBuffer = v;

        if (!v && this.connected && this.buffer.length) {
          if (!this.options['manualFlush']) {
            this.flushBuffer();
          }
        }
      };

      /**
       * Flushes the buffer data over the wire.
       * To be invoked manually when 'manualFlush' is set to true.
       *
       * @api public
       */

      Socket.prototype.flushBuffer = function() {
        this.transport.payload(this.buffer);
        this.buffer = [];
      };


      /**
       * Disconnect the established connect.
       *
       * @returns {io.Socket}
       * @api public
       */

      Socket.prototype.disconnect = function () {
        if (this.connected || this.connecting) {
          if (this.open) {
            this.of('').packet({ type: 'disconnect' });
          }

          // handle disconnection immediately
          this.onDisconnect('booted');
        }

        return this;
      };

      /**
       * Disconnects the socket with a sync XHR.
       *
       * @api private
       */

      Socket.prototype.disconnectSync = function () {
        // ensure disconnection
        var xhr = io.util.request();
        var uri = [
            'http' + (this.options.secure ? 's' : '') + ':/'
          , this.options.host + ':' + this.options.port
          , this.options.resource
          , io.protocol
          , ''
          , this.sessionid
        ].join('/') + '/?disconnect=1';

        xhr.open('GET', uri, false);
        xhr.send(null);

        // handle disconnection immediately
        this.onDisconnect('booted');
      };

      /**
       * Check if we need to use cross domain enabled transports. Cross domain would
       * be a different port or different domain name.
       *
       * @returns {Boolean}
       * @api private
       */

      Socket.prototype.isXDomain = function () {

        var port = global.location.port ||
          ('https:' == global.location.protocol ? 443 : 80);

        return this.options.host !== global.location.hostname
          || this.options.port != port;
      };

      /**
       * Called upon handshake.
       *
       * @api private
       */

      Socket.prototype.onConnect = function () {
        if (!this.connected) {
          this.connected = true;
          this.connecting = false;
          if (!this.doBuffer) {
            // make sure to flush the buffer
            this.setBuffer(false);
          }
          this.emit('connect');
        }
      };

      /**
       * Called when the transport opens
       *
       * @api private
       */

      Socket.prototype.onOpen = function () {
        this.open = true;
      };

      /**
       * Called when the transport closes.
       *
       * @api private
       */

      Socket.prototype.onClose = function () {
        this.open = false;
        clearTimeout(this.heartbeatTimeoutTimer);
      };

      /**
       * Called when the transport first opens a connection
       *
       * @param text
       */

      Socket.prototype.onPacket = function (packet) {
        this.of(packet.endpoint).onPacket(packet);
      };

      /**
       * Handles an error.
       *
       * @api private
       */

      Socket.prototype.onError = function (err) {
        if (err && err.advice) {
          if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
            this.disconnect();
            if (this.options.reconnect) {
              this.reconnect();
            }
          }
        }

        this.publish('error', err && err.reason ? err.reason : err);
      };

      /**
       * Called when the transport disconnects.
       *
       * @api private
       */

      Socket.prototype.onDisconnect = function (reason) {
        var wasConnected = this.connected
          , wasConnecting = this.connecting;

        this.connected = false;
        this.connecting = false;
        this.open = false;

        if (wasConnected || wasConnecting) {
          this.transport.close();
          this.transport.clearTimeouts();
          if (wasConnected) {
            this.publish('disconnect', reason);

            if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
              this.reconnect();
            }
          }
        }
      };

      /**
       * Called upon reconnection.
       *
       * @api private
       */

      Socket.prototype.reconnect = function () {
        this.reconnecting = true;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options['reconnection delay'];

        var self = this
          , maxAttempts = this.options['max reconnection attempts']
          , tryMultiple = this.options['try multiple transports']
          , limit = this.options['reconnection limit'];

        function reset () {
          if (self.connected) {
            for (var i in self.namespaces) {
              if (self.namespaces.hasOwnProperty(i) && '' !== i) {
                self.namespaces[i].packet({ type: 'connect' });
              }
            }
            self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
          }

          clearTimeout(self.reconnectionTimer);

          self.removeListener('connect_failed', maybeReconnect);
          self.removeListener('connect', maybeReconnect);

          self.reconnecting = false;

          delete self.reconnectionAttempts;
          delete self.reconnectionDelay;
          delete self.reconnectionTimer;
          delete self.redoTransports;

          self.options['try multiple transports'] = tryMultiple;
        };

        function maybeReconnect () {
          if (!self.reconnecting) {
            return;
          }

          if (self.connected) {
            return reset();
          };

          if (self.connecting && self.reconnecting) {
            return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
          }

          if (self.reconnectionAttempts++ >= maxAttempts) {
            if (!self.redoTransports) {
              self.on('connect_failed', maybeReconnect);
              self.options['try multiple transports'] = true;
              self.transports = self.origTransports;
              self.transport = self.getTransport();
              self.redoTransports = true;
              self.connect();
            } else {
              self.publish('reconnect_failed');
              reset();
            }
          } else {
            if (self.reconnectionDelay < limit) {
              self.reconnectionDelay *= 2; // exponential back off
            }

            self.connect();
            self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
            self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
          }
        };

        this.options['try multiple transports'] = false;
        this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

        this.on('connect', maybeReconnect);
      };

    })(
        'undefined' != typeof io ? io : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
      , this
    );
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Expose constructor.
       */

      exports.SocketNamespace = SocketNamespace;

      /**
       * Socket namespace constructor.
       *
       * @constructor
       * @api public
       */

      function SocketNamespace (socket, name) {
        this.socket = socket;
        this.name = name || '';
        this.flags = {};
        this.json = new Flag(this, 'json');
        this.ackPackets = 0;
        this.acks = {};
      };

      /**
       * Apply EventEmitter mixin.
       */

      io.util.mixin(SocketNamespace, io.EventEmitter);

      /**
       * Copies emit since we override it
       *
       * @api private
       */

      SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

      /**
       * Creates a new namespace, by proxying the request to the socket. This
       * allows us to use the synax as we do on the server.
       *
       * @api public
       */

      SocketNamespace.prototype.of = function () {
        return this.socket.of.apply(this.socket, arguments);
      };

      /**
       * Sends a packet.
       *
       * @api private
       */

      SocketNamespace.prototype.packet = function (packet) {
        packet.endpoint = this.name;
        this.socket.packet(packet);
        this.flags = {};
        return this;
      };

      /**
       * Sends a message
       *
       * @api public
       */

      SocketNamespace.prototype.send = function (data, fn) {
        var packet = {
          type: this.flags.json ? 'json' : 'message'
          , data: data
        };

        if ('function' == typeof fn) {
          packet.id = ++this.ackPackets;
          packet.ack = true;
          this.acks[packet.id] = fn;
        }

        return this.packet(packet);
      };

      /**
       * Emits an event
       *
       * @api public
       */

      SocketNamespace.prototype.emit = function (name) {
        var args = Array.prototype.slice.call(arguments, 1)
          , lastArg = args[args.length - 1]
          , packet = {
            type: 'event'
            , name: name
          };

        if ('function' == typeof lastArg) {
          packet.id = ++this.ackPackets;
          packet.ack = 'data';
          this.acks[packet.id] = lastArg;
          args = args.slice(0, args.length - 1);
        }

        packet.args = args;

        return this.packet(packet);
      };

      /**
       * Disconnects the namespace
       *
       * @api private
       */

      SocketNamespace.prototype.disconnect = function () {
        if (this.name === '') {
          this.socket.disconnect();
        } else {
          this.packet({ type: 'disconnect' });
          this.$emit('disconnect');
        }

        return this;
      };

      /**
       * Handles a packet
       *
       * @api private
       */

      SocketNamespace.prototype.onPacket = function (packet) {
        var self = this;

        function ack () {
          self.packet({
            type: 'ack'
            , args: io.util.toArray(arguments)
            , ackId: packet.id
          });
        };

        switch (packet.type) {
          case 'connect':
            this.$emit('connect');
            break;

          case 'disconnect':
            if (this.name === '') {
              this.socket.onDisconnect(packet.reason || 'booted');
            } else {
              this.$emit('disconnect', packet.reason);
            }
            break;

          case 'message':
          case 'json':
            var params = ['message', packet.data];

            if (packet.ack == 'data') {
              params.push(ack);
            } else if (packet.ack) {
              this.packet({ type: 'ack', ackId: packet.id });
            }

            this.$emit.apply(this, params);
            break;

          case 'event':
            var params = [packet.name].concat(packet.args);

            if (packet.ack == 'data')
              params.push(ack);

            this.$emit.apply(this, params);
            break;

          case 'ack':
            if (this.acks[packet.ackId]) {
              this.acks[packet.ackId].apply(this, packet.args);
              delete this.acks[packet.ackId];
            }
            break;

          case 'error':
            if (packet.advice){
              this.socket.onError(packet);
            } else {
              if (packet.reason == 'unauthorized') {
                this.$emit('connect_failed', packet.reason);
              } else {
                this.$emit('error', packet.reason);
              }
            }
            break;
        }
      };

      /**
       * Flag interface.
       *
       * @api private
       */

      function Flag (nsp, name) {
        this.namespace = nsp;
        this.name = name;
      };

      /**
       * Send a message
       *
       * @api public
       */

      Flag.prototype.send = function () {
        this.namespace.flags[this.name] = true;
        this.namespace.send.apply(this.namespace, arguments);
      };

      /**
       * Emit an event
       *
       * @api public
       */

      Flag.prototype.emit = function () {
        this.namespace.flags[this.name] = true;
        this.namespace.emit.apply(this.namespace, arguments);
      };

    })(
        'undefined' != typeof io ? io : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io, global) {

      /**
       * Expose constructor.
       */

      exports.websocket = WS;

      /**
       * The WebSocket transport uses the HTML5 WebSocket API to establish an
       * persistent connection with the Socket.IO server. This transport will also
       * be inherited by the FlashSocket fallback as it provides a API compatible
       * polyfill for the WebSockets.
       *
       * @constructor
       * @extends {io.Transport}
       * @api public
       */

      function WS (socket) {
        io.Transport.apply(this, arguments);
      };

      /**
       * Inherits from Transport.
       */

      io.util.inherit(WS, io.Transport);

      /**
       * Transport name
       *
       * @api public
       */

      WS.prototype.name = 'websocket';

      /**
       * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
       * all the appropriate listeners to handle the responses from the server.
       *
       * @returns {Transport}
       * @api public
       */

      WS.prototype.open = function () {
        var query = io.util.query(this.socket.options.query)
          , self = this
          , Socket


        if (!Socket) {
          Socket = global.MozWebSocket || global.WebSocket;
        }

        this.websocket = new Socket(this.prepareUrl() + query);

        this.websocket.onopen = function () {
          self.onOpen();
          self.socket.setBuffer(false);
        };
        this.websocket.onmessage = function (ev) {
          self.onData(ev.data);
        };
        this.websocket.onclose = function () {
          self.onClose();
          self.socket.setBuffer(true);
        };
        this.websocket.onerror = function (e) {
          self.onError(e);
        };

        return this;
      };

      /**
       * Send a message to the Socket.IO server. The message will automatically be
       * encoded in the correct message format.
       *
       * @returns {Transport}
       * @api public
       */

      // Do to a bug in the current IDevices browser, we need to wrap the send in a
      // setTimeout, when they resume from sleeping the browser will crash if
      // we don't allow the browser time to detect the socket has been closed
      if (io.util.ua.iDevice) {
        WS.prototype.send = function (data) {
          var self = this;
          setTimeout(function() {
            self.websocket.send(data);
          },0);
          return this;
        };
      } else {
        WS.prototype.send = function (data) {
          this.websocket.send(data);
          return this;
        };
      }

      /**
       * Payload
       *
       * @api private
       */

      WS.prototype.payload = function (arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
          this.packet(arr[i]);
        }
        return this;
      };

      /**
       * Disconnect the established `WebSocket` connection.
       *
       * @returns {Transport}
       * @api public
       */

      WS.prototype.close = function () {
        this.websocket.close();
        return this;
      };

      /**
       * Handle the errors that `WebSocket` might be giving when we
       * are attempting to connect or send messages.
       *
       * @param {Error} e The error.
       * @api private
       */

      WS.prototype.onError = function (e) {
        this.socket.onError(e);
      };

      /**
       * Returns the appropriate scheme for the URI generation.
       *
       * @api private
       */
      WS.prototype.scheme = function () {
        return this.socket.options.secure ? 'wss' : 'ws';
      };

      /**
       * Checks if the browser has support for native `WebSockets` and that
       * it's not the polyfill created for the FlashSocket transport.
       *
       * @return {Boolean}
       * @api public
       */

      WS.check = function () {
        return ('WebSocket' in global && !('__addTask' in WebSocket))
          || 'MozWebSocket' in global;
      };

      /**
       * Check if the `WebSocket` transport support cross domain communications.
       *
       * @returns {Boolean}
       * @api public
       */

      WS.xdomainCheck = function () {
        return true;
      };

      /**
       * Add the transport to your public io.transports array.
       *
       * @api private
       */

      io.transports.push('websocket');

    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
      , this
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Expose constructor.
       */

      exports.flashsocket = Flashsocket;

      /**
       * The FlashSocket transport. This is a API wrapper for the HTML5 WebSocket
       * specification. It uses a .swf file to communicate with the server. If you want
       * to serve the .swf file from a other server than where the Socket.IO script is
       * coming from you need to use the insecure version of the .swf. More information
       * about this can be found on the github page.
       *
       * @constructor
       * @extends {io.Transport.websocket}
       * @api public
       */

      function Flashsocket () {
        io.Transport.websocket.apply(this, arguments);
      };

      /**
       * Inherits from Transport.
       */

      io.util.inherit(Flashsocket, io.Transport.websocket);

      /**
       * Transport name
       *
       * @api public
       */

      Flashsocket.prototype.name = 'flashsocket';

      /**
       * Disconnect the established `FlashSocket` connection. This is done by adding a
       * new task to the FlashSocket. The rest will be handled off by the `WebSocket`
       * transport.
       *
       * @returns {Transport}
       * @api public
       */

      Flashsocket.prototype.open = function () {
        var self = this
          , args = arguments;

        WebSocket.__addTask(function () {
          io.Transport.websocket.prototype.open.apply(self, args);
        });
        return this;
      };

      /**
       * Sends a message to the Socket.IO server. This is done by adding a new
       * task to the FlashSocket. The rest will be handled off by the `WebSocket`
       * transport.
       *
       * @returns {Transport}
       * @api public
       */

      Flashsocket.prototype.send = function () {
        var self = this, args = arguments;
        WebSocket.__addTask(function () {
          io.Transport.websocket.prototype.send.apply(self, args);
        });
        return this;
      };

      /**
       * Disconnects the established `FlashSocket` connection.
       *
       * @returns {Transport}
       * @api public
       */

      Flashsocket.prototype.close = function () {
        WebSocket.__tasks.length = 0;
        io.Transport.websocket.prototype.close.call(this);
        return this;
      };

      /**
       * The WebSocket fall back needs to append the flash container to the body
       * element, so we need to make sure we have access to it. Or defer the call
       * until we are sure there is a body element.
       *
       * @param {Socket} socket The socket instance that needs a transport
       * @param {Function} fn The callback
       * @api private
       */

      Flashsocket.prototype.ready = function (socket, fn) {
        function init () {
          var options = socket.options
            , port = options['flash policy port']
            , path = [
                'http' + (options.secure ? 's' : '') + ':/'
              , options.host + ':' + options.port
              , options.resource
              , 'static/flashsocket'
              , 'WebSocketMain' + (socket.isXDomain() ? 'Insecure' : '') + '.swf'
            ];

          // Only start downloading the swf file when the checked that this browser
          // actually supports it
          if (!Flashsocket.loaded) {
            if (typeof WEB_SOCKET_SWF_LOCATION === 'undefined') {
              // Set the correct file based on the XDomain settings
              WEB_SOCKET_SWF_LOCATION = path.join('/');
            }

            if (port !== 843) {
              WebSocket.loadFlashPolicyFile('xmlsocket://' + options.host + ':' + port);
            }

            WebSocket.__initialize();
            Flashsocket.loaded = true;
          }

          fn.call(self);
        }

        var self = this;
        if (document.body) return init();

        io.util.load(init);
      };

      /**
       * Check if the FlashSocket transport is supported as it requires that the Adobe
       * Flash Player plug-in version `10.0.0` or greater is installed. And also check if
       * the polyfill is correctly loaded.
       *
       * @returns {Boolean}
       * @api public
       */

      Flashsocket.check = function () {
        if (
          typeof WebSocket == 'undefined'
          || !('__initialize' in WebSocket) || !swfobject
          ) return false;

        return swfobject.getFlashPlayerVersion().major >= 10;
      };

      /**
       * Check if the FlashSocket transport can be used as cross domain / cross origin
       * transport. Because we can't see which type (secure or insecure) of .swf is used
       * we will just return true.
       *
       * @returns {Boolean}
       * @api public
       */

      Flashsocket.xdomainCheck = function () {
        return true;
      };

      /**
       * Disable AUTO_INITIALIZATION
       */

      if (typeof window != 'undefined') {
        WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
      }

      /**
       * Add the transport to your public io.transports array.
       *
       * @api private
       */

      io.transports.push('flashsocket');
    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );
    /*	SWFObject v2.2 <http://code.google.com/p/swfobject/>
     is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
     */
    //EDIT: patching out unconditional flash injection from socket.io
    // if ('undefined' != typeof window) {
    //   var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O[(['Active'].concat('Object').join('X'))]!=D){try{var ad=new window[(['Active'].concat('Object').join('X'))](W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?(['Active'].concat('').join('X')):"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
    // }
// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

    (function() {

      if ('undefined' == typeof window || window.WebSocket) return;

      var console = window.console;
      if (!console || !console.log || !console.error) {
        console = {log: function(){ }, error: function(){ }};
      }

      if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
        console.error("Flash Player >= 10.0.0 is required.");
        return;
      }
      if (location.protocol == "file:") {
        console.error(
            "WARNING: web-socket-js doesn't work in file:///... URL " +
            "unless you set Flash Security Settings properly. " +
            "Open the page via Web server i.e. http://...");
      }

      /**
       * This class represents a faux web socket.
       * @param {string} url
       * @param {array or string} protocols
       * @param {string} proxyHost
       * @param {int} proxyPort
       * @param {string} headers
       */
      WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
        var self = this;
        self.__id = WebSocket.__nextId++;
        WebSocket.__instances[self.__id] = self;
        self.readyState = WebSocket.CONNECTING;
        self.bufferedAmount = 0;
        self.__events = {};
        if (!protocols) {
          protocols = [];
        } else if (typeof protocols == "string") {
          protocols = [protocols];
        }
        // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
        // Otherwise, when onopen fires immediately, onopen is called before it is set.
        setTimeout(function() {
          WebSocket.__addTask(function() {
            WebSocket.__flash.create(
              self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
          });
        }, 0);
      };

      /**
       * Send data to the web socket.
       * @param {string} data  The data to send to the socket.
       * @return {boolean}  True for success, false for failure.
       */
      WebSocket.prototype.send = function(data) {
        if (this.readyState == WebSocket.CONNECTING) {
          throw "INVALID_STATE_ERR: Web Socket connection has not been established";
        }
        // We use encodeURIComponent() here, because FABridge doesn't work if
        // the argument includes some characters. We don't use escape() here
        // because of this:
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
        // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
        // preserve all Unicode characters either e.g. "\uffff" in Firefox.
        // Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
        // additional testing.
        var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
        if (result < 0) { // success
          return true;
        } else {
          this.bufferedAmount += result;
          return false;
        }
      };

      /**
       * Close this web socket gracefully.
       */
      WebSocket.prototype.close = function() {
        if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
          return;
        }
        this.readyState = WebSocket.CLOSING;
        WebSocket.__flash.close(this.__id);
      };

      /**
       * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
       *
       * @param {string} type
       * @param {function} listener
       * @param {boolean} useCapture
       * @return void
       */
      WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
        if (!(type in this.__events)) {
          this.__events[type] = [];
        }
        this.__events[type].push(listener);
      };

      /**
       * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
       *
       * @param {string} type
       * @param {function} listener
       * @param {boolean} useCapture
       * @return void
       */
      WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
        if (!(type in this.__events)) return;
        var events = this.__events[type];
        for (var i = events.length - 1; i >= 0; --i) {
          if (events[i] === listener) {
            events.splice(i, 1);
            break;
          }
        }
      };

      /**
       * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
       *
       * @param {Event} event
       * @return void
       */
      WebSocket.prototype.dispatchEvent = function(event) {
        var events = this.__events[event.type] || [];
        for (var i = 0; i < events.length; ++i) {
          events[i](event);
        }
        var handler = this["on" + event.type];
        if (handler) handler(event);
      };

      /**
       * Handles an event from Flash.
       * @param {Object} flashEvent
       */
      WebSocket.prototype.__handleEvent = function(flashEvent) {
        if ("readyState" in flashEvent) {
          this.readyState = flashEvent.readyState;
        }
        if ("protocol" in flashEvent) {
          this.protocol = flashEvent.protocol;
        }

        var jsEvent;
        if (flashEvent.type == "open" || flashEvent.type == "error") {
          jsEvent = this.__createSimpleEvent(flashEvent.type);
        } else if (flashEvent.type == "close") {
          // TODO implement jsEvent.wasClean
          jsEvent = this.__createSimpleEvent("close");
        } else if (flashEvent.type == "message") {
          var data = decodeURIComponent(flashEvent.message);
          jsEvent = this.__createMessageEvent("message", data);
        } else {
          throw "unknown event type: " + flashEvent.type;
        }

        this.dispatchEvent(jsEvent);
      };

      WebSocket.prototype.__createSimpleEvent = function(type) {
        if (document.createEvent && window.Event) {
          var event = document.createEvent("Event");
          event.initEvent(type, false, false);
          return event;
        } else {
          return {type: type, bubbles: false, cancelable: false};
        }
      };

      WebSocket.prototype.__createMessageEvent = function(type, data) {
        if (document.createEvent && window.MessageEvent && !window.opera) {
          var event = document.createEvent("MessageEvent");
          event.initMessageEvent("message", false, false, data, null, null, window, null);
          return event;
        } else {
          // IE and Opera, the latter one truncates the data parameter after any 0x00 bytes.
          return {type: type, data: data, bubbles: false, cancelable: false};
        }
      };

      /**
       * Define the WebSocket readyState enumeration.
       */
      WebSocket.CONNECTING = 0;
      WebSocket.OPEN = 1;
      WebSocket.CLOSING = 2;
      WebSocket.CLOSED = 3;

      WebSocket.__flash = null;
      WebSocket.__instances = {};
      WebSocket.__tasks = [];
      WebSocket.__nextId = 0;

      /**
       * Load a new flash security policy file.
       * @param {string} url
       */
      WebSocket.loadFlashPolicyFile = function(url){
        WebSocket.__addTask(function() {
          WebSocket.__flash.loadManualPolicyFile(url);
        });
      };

      /**
       * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
       */
      WebSocket.__initialize = function() {
        if (WebSocket.__flash) return;

        if (WebSocket.__swfLocation) {
          // For backword compatibility.
          window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
        }
        if (!window.WEB_SOCKET_SWF_LOCATION) {
          console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
          return;
        }
        var container = document.createElement("div");
        container.id = "webSocketContainer";
        // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
        // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
        // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
        // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
        // the best we can do as far as we know now.
        container.style.position = "absolute";
        if (WebSocket.__isFlashLite()) {
          container.style.left = "0px";
          container.style.top = "0px";
        } else {
          container.style.left = "-100px";
          container.style.top = "-100px";
        }
        var holder = document.createElement("div");
        holder.id = "webSocketFlash";
        container.appendChild(holder);
        document.body.appendChild(container);
        // See this article for hasPriority:
        // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
        swfobject.embedSWF(
          WEB_SOCKET_SWF_LOCATION,
          "webSocketFlash",
          "1" /* width */,
          "1" /* height */,
          "10.0.0" /* SWF version */,
          null,
          null,
          {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
          null,
          function(e) {
            if (!e.success) {
              console.error("[WebSocket] swfobject.embedSWF failed");
            }
          });
      };

      /**
       * Called by Flash to notify JS that it's fully loaded and ready
       * for communication.
       */
      WebSocket.__onFlashInitialized = function() {
        // We need to set a timeout here to avoid round-trip calls
        // to flash during the initialization process.
        setTimeout(function() {
          WebSocket.__flash = document.getElementById("webSocketFlash");
          WebSocket.__flash.setCallerUrl(location.href);
          WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
          for (var i = 0; i < WebSocket.__tasks.length; ++i) {
            WebSocket.__tasks[i]();
          }
          WebSocket.__tasks = [];
        }, 0);
      };

      /**
       * Called by Flash to notify WebSockets events are fired.
       */
      WebSocket.__onFlashEvent = function() {
        setTimeout(function() {
          try {
            // Gets events using receiveEvents() instead of getting it from event object
            // of Flash event. This is to make sure to keep message order.
            // It seems sometimes Flash events don't arrive in the same order as they are sent.
            var events = WebSocket.__flash.receiveEvents();
            for (var i = 0; i < events.length; ++i) {
              WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
            }
          } catch (e) {
            console.error(e);
          }
        }, 0);
        return true;
      };

      // Called by Flash.
      WebSocket.__log = function(message) {
        console.log(decodeURIComponent(message));
      };

      // Called by Flash.
      WebSocket.__error = function(message) {
        console.error(decodeURIComponent(message));
      };

      WebSocket.__addTask = function(task) {
        if (WebSocket.__flash) {
          task();
        } else {
          WebSocket.__tasks.push(task);
        }
      };

      /**
       * Test if the browser is running flash lite.
       * @return {boolean} True if flash lite is running, false otherwise.
       */
      WebSocket.__isFlashLite = function() {
        if (!window.navigator || !window.navigator.mimeTypes) {
          return false;
        }
        var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
        if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
          return false;
        }
        return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
      };

      if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
        if (window.addEventListener) {
          window.addEventListener("load", function(){
            WebSocket.__initialize();
          }, false);
        } else {
          window.attachEvent("onload", function(){
            WebSocket.__initialize();
          });
        }
      }

    })();

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io, global) {

      /**
       * Expose constructor.
       *
       * @api public
       */

      exports.XHR = XHR;

      /**
       * XHR constructor
       *
       * @costructor
       * @api public
       */

      function XHR (socket) {
        if (!socket) return;

        io.Transport.apply(this, arguments);
        this.sendBuffer = [];
      };

      /**
       * Inherits from Transport.
       */

      io.util.inherit(XHR, io.Transport);

      /**
       * Establish a connection
       *
       * @returns {Transport}
       * @api public
       */

      XHR.prototype.open = function () {
        this.socket.setBuffer(false);
        this.onOpen();
        this.get();

        // we need to make sure the request succeeds since we have no indication
        // whether the request opened or not until it succeeded.
        this.setCloseTimeout();

        return this;
      };

      /**
       * Check if we need to send data to the Socket.IO server, if we have data in our
       * buffer we encode it and forward it to the `post` method.
       *
       * @api private
       */

      XHR.prototype.payload = function (payload) {
        var msgs = [];

        for (var i = 0, l = payload.length; i < l; i++) {
          msgs.push(io.parser.encodePacket(payload[i]));
        }

        this.send(io.parser.encodePayload(msgs));
      };

      /**
       * Send data to the Socket.IO server.
       *
       * @param data The message
       * @returns {Transport}
       * @api public
       */

      XHR.prototype.send = function (data) {
        this.post(data);
        return this;
      };

      /**
       * Posts a encoded message to the Socket.IO server.
       *
       * @param {String} data A encoded message.
       * @api private
       */

      function empty () { };

      XHR.prototype.post = function (data) {
        var self = this;
        this.socket.setBuffer(true);

        function stateChange () {
          if (this.readyState == 4) {
            this.onreadystatechange = empty;
            self.posting = false;

            if (this.status == 200){
              self.socket.setBuffer(false);
            } else {
              self.onClose();
            }
          }
        }

        function onload () {
          this.onload = empty;
          self.socket.setBuffer(false);
        };

        this.sendXHR = this.request('POST');

        if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
          this.sendXHR.onload = this.sendXHR.onerror = onload;
        } else {
          this.sendXHR.onreadystatechange = stateChange;
        }

        this.sendXHR.send(data);
      };

      /**
       * Disconnects the established `XHR` connection.
       *
       * @returns {Transport}
       * @api public
       */

      XHR.prototype.close = function () {
        this.onClose();
        return this;
      };

      /**
       * Generates a configured XHR request
       *
       * @param {String} url The url that needs to be requested.
       * @param {String} method The method the request should use.
       * @returns {XMLHttpRequest}
       * @api private
       */

      XHR.prototype.request = function (method) {
        var req = io.util.request(this.socket.isXDomain())
          , query = io.util.query(this.socket.options.query, 't=' + +new Date);

        req.open(method || 'GET', this.prepareUrl() + query, true);

        if (method == 'POST') {
          try {
            if (req.setRequestHeader) {
              req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
            } else {
              // XDomainRequest
              req.contentType = 'text/plain';
            }
          } catch (e) {}
        }

        return req;
      };

      /**
       * Returns the scheme to use for the transport URLs.
       *
       * @api private
       */

      XHR.prototype.scheme = function () {
        return this.socket.options.secure ? 'https' : 'http';
      };

      /**
       * Check if the XHR transports are supported
       *
       * @param {Boolean} xdomain Check if we support cross domain requests.
       * @returns {Boolean}
       * @api public
       */

      XHR.check = function (socket, xdomain) {
        try {
          var request = io.util.request(xdomain),
            usesXDomReq = (global.XDomainRequest && request instanceof XDomainRequest),
            socketProtocol = (socket && socket.options && socket.options.secure ? 'https:' : 'http:'),
            isXProtocol = (global.location && socketProtocol != global.location.protocol);
          if (request && !(usesXDomReq && isXProtocol)) {
            return true;
          }
        } catch(e) {}

        return false;
      };

      /**
       * Check if the XHR transport supports cross domain requests.
       *
       * @returns {Boolean}
       * @api public
       */

      XHR.xdomainCheck = function (socket) {
        return XHR.check(socket, true);
      };

    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
      , this
    );
    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io) {

      /**
       * Expose constructor.
       */

      exports.htmlfile = HTMLFile;

      /**
       * The HTMLFile transport creates a `forever iframe` based transport
       * for Internet Explorer. Regular forever iframe implementations will
       * continuously trigger the browsers buzy indicators. If the forever iframe
       * is created inside a `htmlfile` these indicators will not be trigged.
       *
       * @constructor
       * @extends {io.Transport.XHR}
       * @api public
       */

      function HTMLFile (socket) {
        io.Transport.XHR.apply(this, arguments);
      };

      /**
       * Inherits from XHR transport.
       */

      io.util.inherit(HTMLFile, io.Transport.XHR);

      /**
       * Transport name
       *
       * @api public
       */

      HTMLFile.prototype.name = 'htmlfile';

      /**
       * Creates a new Ac...eX `htmlfile` with a forever loading iframe
       * that can be used to listen to messages. Inside the generated
       * `htmlfile` a reference will be made to the HTMLFile transport.
       *
       * @api private
       */

      HTMLFile.prototype.get = function () {
        this.doc = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
        this.doc.open();
        this.doc.write('<html></html>');
        this.doc.close();
        this.doc.parentWindow.s = this;

        var iframeC = this.doc.createElement('div');
        iframeC.className = 'socketio';

        this.doc.body.appendChild(iframeC);
        this.iframe = this.doc.createElement('iframe');

        iframeC.appendChild(this.iframe);

        var self = this
          , query = io.util.query(this.socket.options.query, 't='+ +new Date);

        this.iframe.src = this.prepareUrl() + query;

        io.util.on(window, 'unload', function () {
          self.destroy();
        });
      };

      /**
       * The Socket.IO server will write script tags inside the forever
       * iframe, this function will be used as callback for the incoming
       * information.
       *
       * @param {String} data The message
       * @param {document} doc Reference to the context
       * @api private
       */

      HTMLFile.prototype._ = function (data, doc) {
        // unescape all forward slashes. see GH-1251
        data = data.replace(/\\\//g, '/');
        this.onData(data);
        try {
          var script = doc.getElementsByTagName('script')[0];
          script.parentNode.removeChild(script);
        } catch (e) { }
      };

      /**
       * Destroy the established connection, iframe and `htmlfile`.
       * And calls the `CollectGarbage` function of Internet Explorer
       * to release the memory.
       *
       * @api private
       */

      HTMLFile.prototype.destroy = function () {
        if (this.iframe){
          try {
            this.iframe.src = 'about:blank';
          } catch(e){}

          this.doc = null;
          this.iframe.parentNode.removeChild(this.iframe);
          this.iframe = null;

          CollectGarbage();
        }
      };

      /**
       * Disconnects the established connection.
       *
       * @returns {Transport} Chaining.
       * @api public
       */

      HTMLFile.prototype.close = function () {
        this.destroy();
        return io.Transport.XHR.prototype.close.call(this);
      };

      /**
       * Checks if the browser supports this transport. The browser
       * must have an `Ac...eXObject` implementation.
       *
       * @return {Boolean}
       * @api public
       */

      HTMLFile.check = function (socket) {
        if (typeof window != "undefined" && (['Active'].concat('Object').join('X')) in window){
          try {
            var a = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
            return a && io.Transport.XHR.check(socket);
          } catch(e){}
        }
        return false;
      };

      /**
       * Check if cross domain requests are supported.
       *
       * @returns {Boolean}
       * @api public
       */

      HTMLFile.xdomainCheck = function () {
        // we can probably do handling for sub-domains, we should
        // test that it's cross domain but a subdomain here
        return false;
      };

      /**
       * Add the transport to your public io.transports array.
       *
       * @api private
       */

      io.transports.push('htmlfile');

    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io, global) {

      /**
       * Expose constructor.
       */

      exports['xhr-polling'] = XHRPolling;

      /**
       * The XHR-polling transport uses long polling XHR requests to create a
       * "persistent" connection with the server.
       *
       * @constructor
       * @api public
       */

      function XHRPolling () {
        io.Transport.XHR.apply(this, arguments);
      };

      /**
       * Inherits from XHR transport.
       */

      io.util.inherit(XHRPolling, io.Transport.XHR);

      /**
       * Merge the properties from XHR transport
       */

      io.util.merge(XHRPolling, io.Transport.XHR);

      /**
       * Transport name
       *
       * @api public
       */

      XHRPolling.prototype.name = 'xhr-polling';

      /**
       * Indicates whether heartbeats is enabled for this transport
       *
       * @api private
       */

      XHRPolling.prototype.heartbeats = function () {
        return false;
      };

      /**
       * Establish a connection, for iPhone and Android this will be done once the page
       * is loaded.
       *
       * @returns {Transport} Chaining.
       * @api public
       */

      XHRPolling.prototype.open = function () {
        var self = this;

        io.Transport.XHR.prototype.open.call(self);
        return false;
      };

      /**
       * Starts a XHR request to wait for incoming messages.
       *
       * @api private
       */

      function empty () {};

      XHRPolling.prototype.get = function () {
        if (!this.isOpen) return;

        var self = this;

        function stateChange () {
          if (this.readyState == 4) {
            this.onreadystatechange = empty;

            if (this.status == 200) {
              self.onData(this.responseText);
              self.get();
            } else {
              self.onClose();
            }
          }
        };

        function onload () {
          this.onload = empty;
          this.onerror = empty;
          self.retryCounter = 1;
          self.onData(this.responseText);
          self.get();
        };

        function onerror () {
          self.retryCounter ++;
          if(!self.retryCounter || self.retryCounter > 3) {
            self.onClose();
          } else {
            self.get();
          }
        };

        this.xhr = this.request();

        if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
          this.xhr.onload = onload;
          this.xhr.onerror = onerror;
        } else {
          this.xhr.onreadystatechange = stateChange;
        }

        this.xhr.send(null);
      };

      /**
       * Handle the unclean close behavior.
       *
       * @api private
       */

      XHRPolling.prototype.onClose = function () {
        io.Transport.XHR.prototype.onClose.call(this);

        if (this.xhr) {
          this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
          try {
            this.xhr.abort();
          } catch(e){}
          this.xhr = null;
        }
      };

      /**
       * Webkit based browsers show a infinit spinner when you start a XHR request
       * before the browsers onload event is called so we need to defer opening of
       * the transport until the onload event is called. Wrapping the cb in our
       * defer method solve this.
       *
       * @param {Socket} socket The socket instance that needs a transport
       * @param {Function} fn The callback
       * @api private
       */

      XHRPolling.prototype.ready = function (socket, fn) {
        var self = this;

        io.util.defer(function () {
          fn.call(self);
        });
      };

      /**
       * Add the transport to your public io.transports array.
       *
       * @api private
       */

      io.transports.push('xhr-polling');

    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
      , this
    );

    /**
     * socket.io
     * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
     * MIT Licensed
     */

    (function (exports, io, global) {
      /**
       * There is a way to hide the loading indicator in Firefox. If you create and
       * remove a iframe it will stop showing the current loading indicator.
       * Unfortunately we can't feature detect that and UA sniffing is evil.
       *
       * @api private
       */

      var indicator = global.document && "MozAppearance" in
        global.document.documentElement.style;

      /**
       * Expose constructor.
       */

      exports['jsonp-polling'] = JSONPPolling;

      /**
       * The JSONP transport creates an persistent connection by dynamically
       * inserting a script tag in the page. This script tag will receive the
       * information of the Socket.IO server. When new information is received
       * it creates a new script tag for the new data stream.
       *
       * @constructor
       * @extends {io.Transport.xhr-polling}
       * @api public
       */

      function JSONPPolling (socket) {
        io.Transport['xhr-polling'].apply(this, arguments);

        this.index = io.j.length;

        var self = this;

        io.j.push(function (msg) {
          self._(msg);
        });
      };

      /**
       * Inherits from XHR polling transport.
       */

      io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

      /**
       * Transport name
       *
       * @api public
       */

      JSONPPolling.prototype.name = 'jsonp-polling';

      /**
       * Posts a encoded message to the Socket.IO server using an iframe.
       * The iframe is used because script tags can create POST based requests.
       * The iframe is positioned outside of the view so the user does not
       * notice it's existence.
       *
       * @param {String} data A encoded message.
       * @api private
       */

      JSONPPolling.prototype.post = function (data) {
        var self = this
          , query = io.util.query(
            this.socket.options.query
            , 't='+ (+new Date) + '&i=' + this.index
          );

        if (!this.form) {
          var form = document.createElement('form')
            , area = document.createElement('textarea')
            , id = this.iframeId = 'socketio_iframe_' + this.index
            , iframe;

          form.className = 'socketio';
          form.style.position = 'absolute';
          form.style.top = '0px';
          form.style.left = '0px';
          form.style.display = 'none';
          form.target = id;
          form.method = 'POST';
          form.setAttribute('accept-charset', 'utf-8');
          area.name = 'd';
          form.appendChild(area);
          document.body.appendChild(form);

          this.form = form;
          this.area = area;
        }

        this.form.action = this.prepareUrl() + query;

        function complete () {
          initIframe();
          self.socket.setBuffer(false);
        };

        function initIframe () {
          if (self.iframe) {
            self.form.removeChild(self.iframe);
          }

          try {
            // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
            iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
          } catch (e) {
            iframe = document.createElement('iframe');
            iframe.name = self.iframeId;
          }

          iframe.id = self.iframeId;

          self.form.appendChild(iframe);
          self.iframe = iframe;
        };

        initIframe();

        // we temporarily stringify until we figure out how to prevent
        // browsers from turning `\n` into `\r\n` in form inputs
        this.area.value = io.JSON.stringify(data);

        try {
          this.form.submit();
        } catch(e) {}

        if (this.iframe.attachEvent) {
          iframe.onreadystatechange = function () {
            if (self.iframe.readyState == 'complete') {
              complete();
            }
          };
        } else {
          this.iframe.onload = complete;
        }

        this.socket.setBuffer(true);
      };

      /**
       * Creates a new JSONP poll that can be used to listen
       * for messages from the Socket.IO server.
       *
       * @api private
       */

      JSONPPolling.prototype.get = function () {
        var self = this
          , script = document.createElement('script')
          , query = io.util.query(
            this.socket.options.query
            , 't='+ (+new Date) + '&i=' + this.index
          );

        if (this.script) {
          this.script.parentNode.removeChild(this.script);
          this.script = null;
        }

        script.async = true;
        script.src = this.prepareUrl() + query;
        script.onerror = function () {
          self.onClose();
        };

        var insertAt = document.getElementsByTagName('script')[0];
        insertAt.parentNode.insertBefore(script, insertAt);
        this.script = script;

        if (indicator) {
          setTimeout(function () {
            var iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            document.body.removeChild(iframe);
          }, 100);
        }
      };

      /**
       * Callback function for the incoming message stream from the Socket.IO server.
       *
       * @param {String} data The message
       * @api private
       */

      JSONPPolling.prototype._ = function (msg) {
        this.onData(msg);
        if (this.isOpen) {
          this.get();
        }
        return this;
      };

      /**
       * The indicator hack only works after onload
       *
       * @param {Socket} socket The socket instance that needs a transport
       * @param {Function} fn The callback
       * @api private
       */

      JSONPPolling.prototype.ready = function (socket, fn) {
        var self = this;
        if (!indicator) return fn.call(this);

        io.util.load(function () {
          fn.call(self);
        });
      };

      /**
       * Checks if browser supports this transport.
       *
       * @return {Boolean}
       * @api public
       */

      JSONPPolling.check = function () {
        return 'document' in global;
      };

      /**
       * Check if cross domain requests are supported
       *
       * @returns {Boolean}
       * @api public
       */

      JSONPPolling.xdomainCheck = function () {
        return true;
      };

      /**
       * Add the transport to your public io.transports array.
       *
       * @api private
       */

      io.transports.push('jsonp-polling');

    })(
        'undefined' != typeof io ? io.Transport : module.exports
      , 'undefined' != typeof io ? io : module.parent.exports
      , this
    );

    if (typeof define === "function" && define.amd) {
      define([], function () { return io; });
    }
  })();
},{}],20:[function(require,module,exports){
  (function (Buffer){
    var crypto = require("crypto");

    var warn = function(){console.log.apply(console,arguments); return undefined; };
    var debug = function(){};
//var debug = function(){console.log.apply(console,arguments)};
    exports.debug = function(cb){ debug = cb; };
    var info = function(){};
//var debug = function(){console.log.apply(console,arguments)};
    exports.info = function(cb){ info = cb; };

    var defaults = exports.defaults = {};
    defaults.chan_timeout = 10000; // how long before for ending durable channels w/ no acks
    defaults.seek_timeout = 3000; // shorter tolerance for seeks, is far more lossy
    defaults.chan_autoack = 1000; // is how often we auto ack if the app isn't generating responses in a durable channel
    defaults.chan_resend = 2000; // resend the last packet after this long if it wasn't acked in a durable channel
    defaults.chan_outbuf = 100; // max size of outgoing buffer before applying backpressure
    defaults.chan_inbuf = 50; // how many incoming packets to cache during processing/misses
    defaults.nat_timeout = 30*1000; // nat timeout for inactivity
    defaults.idle_timeout = 2*defaults.nat_timeout; // overall inactivity timeout
    defaults.link_timer = defaults.nat_timeout - (5*1000); // how often the DHT link maintenance runs
    defaults.link_max = 256; // maximum number of links to maintain overall (minimum one packet per link timer)
    defaults.link_k = 8; // maximum number of links to maintain per bucket

// network preference order for paths
    var pathShareOrder = ["bluetooth","webrtc","ipv6","ipv4","http"];

    exports.switch = function()
    {
      var self = {seeds:[], locals:[], lines:{}, bridges:{}, bridgeLine:{}, all:{}, buckets:[], capacity:[], rels:{}, raws:{}, paths:[], bridgeCache:{}, networks:{}, CSets:{}};

      self.load = function(id)
      {
        if(typeof id != "object") return "bad keys";
        self.id = id;
        var err = loadkeys(self);
        if(err) return err;
        if(Object.keys(self.cs).length == 0) return "missing cipher sets";
        self.hashname = parts2hn(self.parts);
        return false;
      }
      self.make = keysgen;

      // configure defaults
      self.seed = true;

      // udp socket stuff
      self.pcounter = 1;
      self.receive = receive;
      // outgoing packets to the network
      self.deliver = function(type, callback){ self.networks[type] = callback};
      self.send = function(path, msg, to){
        if(!msg) return debug("send called w/ no packet, dropping",new Error().stack)&&false;
        if(!path) return debug("send called w/ no path, dropping",new Error().stack)&&false;
        if(!self.networks[path.type]) return false;
        if(to) path = to.pathOut(path);
        debug("<<<<",Date(),msg.length,path&&[path.type,path.ip,path.port,path.id].join(","),to&&to.hashname);
        return self.networks[path.type](path,msg,to);
      };
      self.pathSet = function(path, del)
      {
        var existing;
        if(!path) return;
        if((existing = pathMatch(path,self.paths)))
        {
          if(del) self.paths.splice(self.paths.indexOf(existing),1);
          return;
        }
        debug("local path add",JSON.stringify(path));
        info("self",path.type,JSON.stringify(path));
        self.paths.push(path);
        // trigger pings if we're online
        if(self.isOnline)
        {
          linkMaint(self);
        }
      }

      // need some seeds to connect to, addSeed({ip:"1.2.3.4", port:5678, public:"PEM"})
      self.addSeed = addSeed;

      // map a hashname to an object, whois(hashname)
      self.whois = whois;
      self.whokey = whokey;
      self.start = function(hashname,type,arg,cb)
      {
        var hn = self.whois(hashname);
        if(!hn) return cb("invalid hashname");
        return hn.start(type,arg,cb);
      }

      // connect to the network, online(callback(err))
      self.online = online;

      // handle new reliable channels coming in from anyone
      self.listen = function(type, callback){
        if(typeof type != "string" || typeof callback != "function") return warn("invalid arguments to listen");
        if(type.substr(0,1) !== "_") type = "_"+type;
        self.rels[type] = callback;
      };
      // advanced usage only
      self.raw = function(type, callback){
        if(typeof type != "string" || typeof callback != "function") return warn("invalid arguments to raw");
        self.raws[type] = callback;
      };

      // internal listening unreliable channels
      self.raws["peer"] = inPeer;
      self.raws["connect"] = inConnect;
      self.raws["seek"] = inSeek;
      self.raws["path"] = inPath;
      self.raws["link"] = inLink;

      // primarily internal, to seek/connect to a hashname
      self.seek = seek;

      // for modules
      self.pencode = pencode;
      self.pdecode = pdecode;
      self.isLocalIP = isLocalIP;
      self.randomHEX = randomHEX;
      self.uriparse = uriparse;
      self.pathMatch = pathMatch;
      self.isHashname = function(hex){return isHEX(hex, 64)};
      self.isBridge = isBridge;
      self.wraps = channelWraps;
      self.waits = [];
      self.waiting = false
      self.wait = function(bool){
        if(bool) return self.waits.push(true);
        self.waits.pop();
        if(self.waiting && self.waits.length == 0) self.waiting();
      }
      self.ping = function(){
        if(!self.tracer) self.tracer = randomHEX(16);
        var js = {type:"ping",trace:self.tracer};
        Object.keys(self.parts).forEach(function(csid){js[csid] = true;});
        return js;
      }

      linkLoop(self);
      return self;
    }

    /* CHANNELS API
     hn.channel(type, arg, callback)
     - used by app to create a reliable channel of given type
     - arg contains .js and .body for the first packet
     - callback(err, arg, chan, cbDone)
     - called when any packet is received (or error/fail)
     - given the response .js .body in arg
     - cbDone when arg is processed
     - chan.send() to send packets
     - chan.wrap(bulk|stream) to modify interface, replaces this callback handler
     - chan.bulk(str, cbDone) / onBulk(cbDone(err, str))
     - chan.read/write
     hn.raw(type, arg, callback)
     - arg contains .js and .body to create an unreliable channel
     - callback(err, arg, chan)
     - called on any packet or error
     - given the response .js .body in arg
     - chan.send() to send packets

     self.channel(type, callback)
     - used to listen for incoming reliable channel starts
     - callback(err, arg, chan, cbDone)
     - called for any answer or subsequent packets
     - chan.wrap() to modify
     self.raw(type, callback)
     - used to listen for incoming unreliable channel starts
     - callback(err, arg, chan)
     - called for any incoming packets
     */

// these are called once a reliable channel is started both ways to add custom functions for the app
    var channelWraps = {
      "bulk":function(chan){
        // handle any incoming bulk flow
        var bulkIn = "";
        chan.callback = function(end, packet, chan, cb)
        {
          cb();
          if(packet.body) bulkIn += packet.body;
          if(!chan.onBulk) return;
          if(end) chan.onBulk(end!==true?end:false, bulkIn);
        }
        // handle (optional) outgoing bulk flow
        chan.bulk = function(data, callback)
        {
          // break data into chunks and send out, no backpressure yet
          while(data)
          {
            var chunk = data.substr(0,1000);
            data = data.substr(1000);
            var packet = {body:chunk};
            if(!data) packet.callback = callback; // last packet gets confirmed
            chan.send(packet);
          }
          chan.end();
        }
      }
    }

// do the maintenance work for links
    function linkLoop(self)
    {
      self.bridgeCache = {}; // reset cache for any bridging
//  hnReap(self); // remove any dead ones, temporarily disabled due to node crypto compiled cleanup bug
      linkMaint(self); // ping all of them
      setTimeout(function(){linkLoop(self)}, defaults.link_timer);
    }

// delete any defunct hashnames!
    function hnReap(self)
    {
      var hn;
      function del(why)
      {
        if(hn.lineOut) delete self.lines[hn.lineOut];
        delete self.all[hn.hashname];
        debug("reaping ", hn.hashname, why);
      }
      Object.keys(self.all).forEach(function(h){
        hn = self.all[h];
        debug("reap check",hn.hashname,Date.now()-hn.sentAt,Date.now()-hn.recvAt,Object.keys(hn.chans).length);
        if(hn.isSeed) return;
        if(Object.keys(hn.chans).length > 0) return; // let channels clean themselves up
        if(Date.now() - hn.at < hn.timeout()) return; // always leave n00bs around for a while
        if(!hn.sentAt) return del("never sent anything, gc");
        if(!hn.recvAt) return del("sent open, never received");
        if(Date.now() - hn.sentAt > hn.timeout()) return del("we stopped sending to them");
        if(Date.now() - hn.recvAt > hn.timeout()) return del("they stopped responding to us");
      });
    }

// every link that needs to be maintained, ping them
    function linkMaint(self)
    {
      // process every bucket
      Object.keys(self.buckets).forEach(function(bucket){
        // sort by age and send maintenance to only k links
        var sorted = self.buckets[bucket].sort(function(a,b){ return a.age - b.age });
        if(sorted.length) debug("link maintenance on bucket",bucket,sorted.length);
        sorted.slice(0,defaults.link_k).forEach(function(hn){
          if(!hn.linked || !pathValid(hn.to)) return;
          if((Date.now() - hn.linked.sentAt) < Math.ceil(defaults.link_timer/2)) return; // we sent to them recently
          hn.linked.send({js:{seed:self.seed}});
        });
      });
    }

// configures or checks
    function isBridge(arg)
    {
      var self = this;
      if(arg === true) self.bridging = true;
      if(self.bridging) return true;
      if(!arg) return self.bridging;

      var check = (typeof arg == "string")?self.whois(arg):arg;
      if(check && check.bridging) return true;
      return false;
    }

    function addSeed(arg) {
      var self = this;
      if(!arg.parts) return warn("invalid args to addSeed",arg);
      var seed = self.whokey(arg.parts,false,arg.keys);
      if(!seed) return warn("invalid seed info",arg);
      if(Array.isArray(arg.paths)) arg.paths.forEach(function(path){
        path = seed.pathGet(path);
        path.seed = true;
      });
      seed.isSeed = true;
      self.seeds.push(seed);
    }

    function online(callback)
    {
      var self = this;
      if(self.waits.length > 0) return self.waiting = function(){self.online(callback)};
      self.isOnline = true;
      // ping lan
      self.send({type:"lan"}, pencode(self.ping()));

      var dones = self.seeds.length;
      if(!dones) {
        warn("no seeds");
        return callback(null,0);
      }

      // safely callback only once or when all seeds return
      function done()
      {
        if(!dones) return; // already called back
        var alive = self.seeds.filter(function(seed){return pathValid(seed.to)}).length;
        if(alive)
        {
          callback(null,alive);
          dones = 0;
          return;
        }
        dones--;
        // done checking seeds
        if(!dones) callback(self.locals.length?null:"offline",self.locals.length);
      }

      self.seeds.forEach(function(seed){
        seed.link(function(){
          if(pathValid(seed.to)) seed.pathSync();
          done();
        });
      });
    }

// self.receive, raw incoming udp data
    function receive(msg, path)
    {
      var self = this;
      var packet = pdecode(msg);
      if(!packet) return warn("failed to decode a packet from", path, (new Buffer(msg)).toString("hex"));
      if(packet.length == 2) return; // empty packets are NAT pings

      packet.sender = path;
      packet.id = self.pcounter++;
      packet.at = Date.now();
      debug(">>>>",Date(),msg.length, packet.head.length, path&&[path.type,path.ip,path.port,path.id].join(","));

      // handle any discovery requests
      if(packet.js.type == "ping") return inPing(self, packet);
      if(packet.js.type == "pong") return inPong(self, packet);

      // either it's an open
      if(packet.head.length == 1)
      {
        var open = deopenize(self, packet);
        if (!open || !open.verify) return warn("couldn't decode open (possibly using the wrong public key?)",open&&open.err);
        if (!isHEX(open.js.line, 32)) return warn("invalid line id enclosed",open.js.line);
        if(open.js.to !== self.hashname) return warn("open for wrong hashname",open.js.to);
        var csid = partsMatch(self.parts,open.js.from);
        if(csid != open.csid) return warn("open with mismatch CSID",csid,open.csid);

        var from = self.whokey(open.js.from,open.key);
        if (!from) return warn("invalid hashname", open.js.from);
        from.csid = open.csid;

        // make sure this open is legit
        if (typeof open.js.at != "number") return warn("invalid at", open.js.at);

        // older open, ignore it
        if(from.openAt && open.js.at < from.openAt) return debug("dropping older open");
        from.openAt = open.js.at;

        debug("inOpen verified", from.hashname,path&&JSON.stringify(path.json));

        // ignore incoming opens if too fast or recent duplicates
        if(open.js.line == from.lineIn)
        {
          var age = Date.now() - (from.openAcked||0);
          if((age < defaults.seek_timeout) || (age < defaults.nat_timeout && from.openDup >= 3)) return;
          from.openDup++;
        }else{
          from.openDup = 0;
        }

        // always minimally flag activity and send an open ack back via network or relay
        var openAck = from.open(); // inits line crypto
        from.active();
        from.openAcked = Date.now();
        path = from.pathIn(path);
        if(path) self.send(path,openAck,from);
        else if(from.relayChan) from.relayChan.send({body:openAck});

        // only do new line setup once
        if(open.js.line != from.lineIn)
        {
          from.lineIn = open.js.line;
          debug("new line",from.lineIn,from.lineOut);
          self.CSets[open.csid].openline(from, open);
          self.lines[from.lineOut] = from;

          // force reset old channels
          Object.keys(from.chans).forEach(function(id){
            var chan = from.chans[id];
            if(chan)
            {
              // SPECIAL CASE: skip channels that haven't received a packet, they're new waiting outgoing-opening ones!
              if(!chan.recvAt) return;
              // fail all other active channels
              from.receive({js:{c:chan.id,err:"reset"}});
            }
            // actually remove so new ones w/ same id can come in
            delete from.chans[id];
          });
        }

        return;
      }

      // or it's a line
      if(packet.head.length == 0)
      {
        var lineID = packet.body.slice(0,16).toString("hex");
        var from = self.lines[lineID];

        // a matching line is required to decode the packet
        if(!from) {
          if(!self.bridgeLine[lineID]) return debug("unknown line received", lineID, packet.sender);
          debug("BRIDGE",JSON.stringify(self.bridgeLine[lineID]),lineID);
          var id = crypto.createHash("sha256").update(packet.body).digest("hex")
          if(self.bridgeCache[id]) return; // drop duplicates
          self.bridgeCache[id] = true;
          // flat out raw retransmit any bridge packets
          return self.send(self.bridgeLine[lineID],pencode(false,packet.body));
        }

        // decrypt and process
        var err;
        if((err = self.CSets[from.csid].delineize(from, packet))) return debug("couldn't decrypt line",err,packet.sender);
        from.linedAt = from.openAt;
        from.active();
        from.receive(packet);
        return;
      }

      if(Object.keys(packet.js).length > 0) warn("dropping incoming packet of unknown type", packet.js, packet.sender);
    }

    function whokey(parts, key, keys)
    {
      var self = this;
      if(typeof parts != "object") return false;
      var csid = partsMatch(self.parts,parts);
      if(!csid) return false;
      var hn = self.whois(parts2hn(parts));
      if(!hn) return false;
      if(keys) key = keys[csid]; // convenience for addSeed
      var err = loadkey(self,hn,csid,key);
      if(err)
      {
        warn("whokey err",hn.hashname,err);
        return false;
      }
      if(crypto.createHash("sha256").update(hn.key).digest("hex") != parts[csid])
      {
        warn("whokey part mismatch",hn.hashname,csid,parts[csid],crypto.createHash("sha256").update(hn.key).digest("hex"));
        delete hn.key;
        return false;
      }
      hn.parts = parts;

      return hn;
    }

// this creates a hashname identity object (or returns existing), optional from creates a via relationship
    function whois(hashname)
    {
      var self = this;
      // validations
      if(!hashname) { warn("whois called without a hashname", hashname, new Error().stack); return false; }
      if(typeof hashname != "string") { warn("wrong type, should be string", typeof hashname,hashname); return false; }
      if(!isHEX(hashname, 64)) { warn("whois called without a valid hashname", hashname); return false; }

      // never return ourselves
      if(hashname === self.hashname) { debug("whois called for self"); return false; }

      var hn = self.all[hashname];
      if(hn) return hn;

      // make a new one
      hn = self.all[hashname] = {hashname:hashname, chans:{}, self:self, paths:[], isAlive:0, sendwait:[]};
      hn.at = Date.now();
      hn.bucket = dhash(self.hashname, hashname);
      if(!self.buckets[hn.bucket]) self.buckets[hn.bucket] = [];

      // to create a new channels to this hashname
      var sort = [self.hashname,hashname].sort();
      hn.chanOut = (sort[0] == self.hashname) ? 2 : 1;
      hn.start = channel;
      hn.raw = raw;

      hn.pathGet = function(path)
      {
        if(typeof path != "object" || typeof path.type != "string") return false;

        var match = pathMatch(path, hn.paths);
        if(match) return match;

        // clone and also preserve original (hackey)
        path = JSON.parse(JSON.stringify(path));
        if(!path.json) path.json = JSON.parse(JSON.stringify(path));

        debug("adding new path",hn.paths.length,JSON.stringify(path.json));
        info(hn.hashname,path.type,JSON.stringify(path.json));
        hn.paths.push(path);

        // track overall if they have a public IP network
        if(!isLocalPath(path)) hn.isPublic = true;

        // if possibly behind the same NAT (same public ip), set flag to allow/ask to share local paths
        if(path.type == "ipv4") self.paths.forEach(function(path2){
          if(path2.type == "ipv4" && path2.ip == path.ip) hn.isLocal = true;
        })

        return path;
      }

      hn.pathOut = function(path)
      {
        path = hn.pathGet(path);
        if(!path) return false;

        // send a NAT hole punching empty packet the first time
        if(!path.sentAt && path.type == "ipv4") self.send(path,pencode());

        path.sentAt = Date.now();
        if(!pathValid(hn.to) && pathValid(path)) hn.to = path;
        return path;
      }

      hn.pathEnd = function(path)
      {
        if(path.seed) return false; // never remove a seed-path
        if(hn.to == path) hn.to = false;
        path.gone = true;
        var index = hn.paths.indexOf(path);
        if(index >= 0) hn.paths.splice(index,1);
        debug("PATH END",JSON.stringify(path.json));
        return false;
      }

      // manage network information consistently, called on all validated incoming packets
      hn.pathIn = function(path)
      {
        path = hn.pathGet(path);
        if(!path) return false;

        // first time we've seen em
        if(!path.recvAt && !path.sentAt)
        {
          debug("PATH INNEW",isLocalPath(path)?"local":"public",JSON.stringify(path.json),hn.paths.map(function(p){return JSON.stringify(p.json)}));

          // update public ipv4 info
          if(path.type == "ipv4" && !isLocalIP(path.ip))
          {
            hn.ip = path.ip;
            hn.port = path.port;
          }

          // cull any invalid paths of the same type
          hn.paths.forEach(function(other){
            if(other == path) return;
            if(other.type != path.type) return;
            if(!pathValid(other)) return hn.pathEnd(other);
            // remove any previous path on the same IP
            if(path.ip && other.ip == path.ip) return hn.pathEnd(other);
            // remove any previous http path entirely
            if(path.type == "http") return hn.pathEnd(other);
          });

          // any custom non-public paths, we must bridge for
          if(pathShareOrder.indexOf(path.type) == -1) hn.bridging = true;

          // track overall if we trust them as local
          if(isLocalPath(path) && !hn.isLocal)
          {
            hn.isLocal = true;
            hn.pathSync();
          }
        }

        // always update default to newest
        path.recvAt = Date.now();
        hn.to = path;

        return path;
      }

      // track whenever a hashname is active
      hn.active = function()
      {
        self.recvAt = Date.now();

        // if we've not been active, (re)sync paths
        if(!hn.recvAt || (Date.now() - hn.recvAt) > defaults.nat_timeout) setTimeout(function(){hn.pathSync()},10);
        hn.recvAt = Date.now();

        // resend any waiting packets (if they're still valid)
        hn.sendwait.forEach(function(packet){
          if(!hn.chans[packet.js.c]) return;
          hn.send(packet);
        });
        hn.sendwait = [];
      }

      // try to send a packet to a hashname, doing whatever is possible/necessary
      hn.send = function(packet){
        if(Buffer.isBuffer(packet)) console.log("lined packet?!",hn.hashname,typeof hn.sendwait.length,new Error().stack);
        // if there's a line, try sending it via a valid network path!
        if(hn.lineIn)
        {
          debug("line sending",hn.hashname,hn.lineIn);
          var lined = self.CSets[hn.csid].lineize(hn, packet);
          hn.sentAt = Date.now();

          // directed packets, just dump and done
          if(packet.to) return self.send(packet.to, lined, hn);

          // if there's a valid path to them, just use it
          if(pathValid(hn.to)) return self.send(hn.to, lined, hn);

          // if relay, always send it there
          if(hn.relayChan) return hn.relayChan.send({body:lined});

          // everything else falls through
        }

        // we've fallen through, either no line, or no valid paths
        hn.openAt = false;

        // add to queue to send on line
        if(hn.sendwait.indexOf(packet) == -1) hn.sendwait.push(packet);

        // TODO should we rate-limit the flow into this section?
        debug("alive failthrough",hn.sendSeek,Object.keys(hn.vias||{}));

        // always send to open all known paths to increase restart-resiliency
        if(hn.open()) hn.paths.forEach(function(path){
          self.send(path, hn.open(), hn);
        });

        // todo change all .see processing to add via info, and change inConnect
        function vias()
        {
          if(!hn.vias) return;
          var todo = hn.vias;
          delete hn.vias; // never use more than once so we re-seek
          // send a peer request to all of them
          Object.keys(todo).forEach(function(via){
            self.whois(via).peer(hn.hashname,todo[via]);
          });
        }

        // if there's via information, just try that
        if(hn.vias) return vias();

        // never too fast, worst case is to try to seek again
        if(!hn.sendSeek || (Date.now() - hn.sendSeek) > 5000)
        {
          hn.sendSeek = Date.now();
          self.seek(hn, function(err){
            if(!hn.sendwait.length) return; // already connected
            vias(); // process any new vias
          });
        }

      }

      // handle all incoming line packets
      hn.receive = function(packet)
      {
//    if((Math.floor(Math.random()*10) == 4)) return warn("testing dropping randomly!");
        if(!packet.js || typeof packet.js.c != "number") return warn("dropping invalid channel packet",packet.js);

        // normalize/track sender network path
        packet.sender = hn.pathIn(packet.sender);
        packet.from = hn;

        // find any existing channel
        var chan = hn.chans[packet.js.c];
        debug("LINEIN",chan&&chan.type,JSON.stringify(packet.js),packet.body&&packet.body.length);
        if(chan === false) return; // drop packet for a closed channel
        if(chan) return chan.receive(packet);

        // start a channel if one doesn't exist, check either reliable or unreliable types
        var listening = {};
        if(typeof packet.js.seq == "undefined") listening = self.raws;
        if(packet.js.seq === 0) listening = self.rels;
        // ignore/drop unknowns
        if(!listening[packet.js.type]) return;

        // verify incoming new chan id
        if(packet.js.c % 2 == hn.chanOut % 2) return warn("channel id incorrect",packet.js.c,hn.chanOut)

        // make the correct kind of channel;
        var kind = (listening == self.raws) ? "raw" : "start";
        var chan = hn[kind](packet.js.type, {bare:true,id:packet.js.c}, listening[packet.js.type]);
        chan.receive(packet);
      }

      hn.chanEnded = function(id)
      {
        if(!hn.chans[id]) return;
        debug("channel ended",id,hn.chans[id].type,hn.hashname);
        hn.chans[id] = false;
      }

      // track other hashnames this one sees
      hn.sees = function(address)
      {
        if(typeof address != "string") warn("invalid see address",address,hn.hashname);
        if(typeof address != "string") return false;
        var parts = address.split(",");
        if(!self.isHashname(parts[0]) || parts[0] == self.hashname) return false;
        var see = self.whois(parts[0]);
        if(!see) return false;
        // save suggested path if given/valid
        if(parts.length >= 4 && parts[2].split(".").length == 4 && parseInt(parts[3]) > 0) see.pathGet({type:"ipv4",ip:parts[2],port:parseInt(parts[3])});
        if(!see.vias) see.vias = {};
        // save suggested csid if we don't know one yet
        see.vias[hn.hashname] = see.cisd || parts[1];
        return see;
      }

      // just make a seek request conveniently
      hn.seek = function(hashname, callback)
      {
        var bucket = dhash(hn.hashname, hashname);
        var prefix = hashname.substr(0, Math.ceil((255-bucket)/4)+2);
        hn.raw("seek", {timeout:defaults.seek_timeout, retry:3, js:{"seek":prefix}}, function(err, packet, chan){
          callback(packet.js.err,Array.isArray(packet.js.see)?packet.js.see:[]);
        });
      }

      // return our address to them
      hn.address = function(to)
      {
        if(!to) return "";
        var csid = partsMatch(hn.parts,to.parts);
        if(!csid) return "";
        if(!hn.ip) return [hn.hashname,csid].join(",");
        return [hn.hashname,csid,hn.ip,hn.port].join(",");
      }

      // request a new link to them
      hn.link = function(callback)
      {
        if(!callback) callback = function(){}

        debug("LINKTRY",hn.hashname);
        var js = {seed:self.seed};
        js.see = self.buckets[hn.bucket].sort(function(a,b){ return a.age - b.age }).filter(function(a){ return a.seed }).map(function(seed){ return seed.address(hn) }).slice(0,8);
        // add some distant ones if none
        if(js.see.length < 8) Object.keys(self.buckets).forEach(function(bucket){
          if(js.see.length >= 8) return;
          self.buckets[bucket].sort(function(a,b){ return a.age - b.age }).forEach(function(seed){
            if(js.see.length >= 8 || !seed.seed || js.see.indexOf(seed.address(hn)) != -1) return;
            js.see.push(seed.address(hn));
          });
        });

        if(self.isBridge(hn)) js.bridges = self.paths.filter(function(path){return !isLocalPath(path)}).map(function(path){return path.type});

        if(hn.linked)
        {
          hn.linked.send({js:js});
          return callback();
        }

        hn.linked = hn.raw("link", {retry:3, js:js, timeout:defaults.idle_timeout}, function(err, packet, chan){
          inLink(err, packet, chan);
          callback(packet.js.err);
        });
      }

      // send a peer request and set up relay tunnel
      hn.peer = function(hashname, csid)
      {
        if(!csid || !self.parts[csid]) return;
        var js = {"peer":hashname};
        js.paths = hn.pathsOut();
        hn.raw("peer",{timeout:defaults.nat_timeout, js:js, body:getkey(self,csid)}, function(err, packet, chan){
          if(!chan.relayTo) chan.relayTo = self.whois(hashname);
          inRelay(chan, packet);
        });
      }

      // return the current open packet
      hn.open = function()
      {
        if(!hn.parts) return false; // can't open if no key
        if(!hn.opened) hn.opened = openize(self,hn);
        return hn.opened;
      }

      // generate current paths array to them, for peer and paths requests
      hn.pathsOut = function()
      {
        var paths = [];
        self.paths.forEach(function(path){
          if(isLocalPath(path) && !hn.isLocal) return;
          paths.push(path);
        });
        return paths;
      }

      // send a path sync
      hn.pathSync = function()
      {
        if(hn.pathSyncing) return;
        hn.pathSyncing = true;
        debug("pathSync",hn.hashname);
        var js = {};
        var paths = hn.pathsOut();
        if(paths.length > 0) js.paths = paths;
        var alive = [];
        hn.raw("path",{js:js, timeout:10*1000}, function(err, packet){
          if(err)
          {
            hn.pathSyncing = false;
            return;
          }

          // if path answer is from a seed, update our public ip/port in case we're behind a NAT
          if(packet.from.isSeed && typeof packet.js.path == "object" && packet.js.path.type == "ipv4" && !isLocalIP(packet.js.path.ip))
          {
            debug("updating public ipv4",JSON.stringify(self.pub4),JSON.stringify(packet.js.path));
            self.pathSet(self.pub4,true);
            self.pub4 = {type:"ipv4", ip:packet.js.path.ip, port:parseInt(packet.js.path.port)};
            self.pathSet(self.pub4);
          }

          if(!packet.sender) return; // no sender path is bad

          // add to all answers and update best default from active ones
          alive.push(packet.sender);
          var best = packet.sender;
          alive.forEach(function(path){
            if(pathShareOrder.indexOf(best.type) < pathShareOrder.indexOf(path.type)) return;
            if(isLocalPath(best)) return; // always prefer (the first) local paths
            best = path;
          });
          debug("pathSync best",hn.hashname,JSON.stringify(best.json));
          hn.to = best;
        });
      }

      // create a ticket buffer to this hn w/ this packet
      hn.ticket = function(packet)
      {
        if(self.pencode(packet).length > 1024) return false;
        return ticketize(self, hn, packet);
      }

      // decode a ticket buffer from them
      hn.ticketed = function(ticket)
      {
        packet = pdecode(ticket);
        if(!packet) return false;
        return deticketize(self, hn, packet);
      }

      return hn;
    }

// seek the dht for this hashname
    function seek(hn, callback)
    {
      var self = this;
      if(typeof hn == "string") hn = self.whois(hn);
      if(!callback) callback = function(){};
      if(!hn) return callback("invalid hashname");

      var did = {};
      var doing = {};
      var queue = [];
      var wise = {};
      var closest = 255;

      // load all seeds and sort to get the top 3
      var seeds = []
      Object.keys(self.buckets).forEach(function(bucket){
        self.buckets[bucket].forEach(function(link){
          if(link.hashname == hn) return; // ignore the one we're (re)seeking
          if(link.seed && pathValid(link.to)) seeds.push(link);
        });
      });
      seeds.sort(function(a,b){ return dhash(hn.hashname,a.hashname) - dhash(hn.hashname,b.hashname) }).slice(0,3).forEach(function(seed){
        wise[seed.hashname] = true;
        queue.push(seed.hashname);
      });

      debug("seek starting with",queue,seeds.length);

      // always process potentials in order
      function sort()
      {
        queue = queue.sort(function(a,b){
          return dhash(hn.hashname,a) - dhash(hn.hashname,b)
        });
      }

      // track when we finish
      function done(err)
      {
        // get all the hashnames we used/found and do final sort to return
        Object.keys(did).forEach(function(k){ if(queue.indexOf(k) == -1) queue.push(k); });
        Object.keys(doing).forEach(function(k){ if(queue.indexOf(k) == -1) queue.push(k); });
        sort();
        while(cb = hn.seeking.shift()) cb(err, queue.slice());
      }

      // track callback(s);
      if(!hn.seeking) hn.seeking = [];
      hn.seeking.push(callback);
      if(hn.seeking.length > 1) return;

      // main loop, multiples of these running at the same time
      function loop(onetime){
        if(!hn.seeking.length) return; // already returned
        debug("SEEK LOOP",queue);
        // if nothing left to do and nobody's doing anything, failed :(
        if(Object.keys(doing).length == 0 && queue.length == 0) return done("failed to find the hashname");

        // get the next one to ask
        var mine = onetime||queue.shift();
        if(!mine) return; // another loop() is still running

        // if we found it, yay! :)
        if(mine == hn.hashname) return done();
        // skip dups
        if(did[mine] || doing[mine]) return onetime||loop();
        var distance = dhash(hn.hashname, mine);
        if(distance > closest) return onetime||loop(); // don't "back up" further away
        if(wise[mine]) closest = distance; // update distance if trusted
        doing[mine] = true;
        var to = self.whois(mine);
        to.seek(hn.hashname, function(err, sees){
          sees.forEach(function(address){
            var see = to.sees(address);
            if(!see) return;
            // if this is the first entry and from a wise one, give them wisdom too
            if(wise[to.hashname] && sees.indexOf(address) == 0) wise[see.hashname] = true;
            queue.push(see.hashname);
          });
          sort();
          did[mine] = true;
          delete doing[mine];
          onetime||loop();
        });
      }

      // start three of them
      loop();loop();loop();

      // also force query any locals
      self.locals.forEach(function(local){loop(local.hashname)});
    }

// create an unreliable channel
    function raw(type, arg, callback)
    {
      var hn = this;
      var chan = {type:type, callback:callback};
      chan.id = arg.id;
      chan.startAt = Date.now();
      if(!chan.id)
      {
        chan.id = hn.chanOut;
        hn.chanOut += 2;
      }
      chan.isOut = (chan.id % 2 == hn.chanOut % 2);
      hn.chans[chan.id] = chan;

      // raw channels always timeout/expire after the last received packet
      function timer()
      {
        if(chan.timer) clearTimeout(chan.timer);
        chan.timer = setTimeout(function(){
          // signal incoming error if still open, restarts timer
          if(!chan.ended) return hn.receive({js:{err:"timeout",c:chan.id}});
          // clean up references if ended
          hn.chanEnded(chan.id);
        }, arg.timeout);
      }
      chan.timeout = function(timeout)
      {
        arg.timeout = timeout;
        timer();
      }
      chan.timeout(arg.timeout || defaults.chan_timeout);

      chan.hashname = hn.hashname; // for convenience

      debug("new unreliable channel",hn.hashname,chan.type,chan.id);

      // process packets at a raw level, very little to do
      chan.receive = function(packet)
      {
        if(!hn.chans[chan.id]) return debug("dropping receive packet to dead channel",chan.id,packet.js)
        chan.opened = true;
        chan.ended = chan.ended || packet.js.err || packet.js.end;
        chan.recvAt = Date.now();
        chan.last = packet.sender;
        chan.callback(chan.ended, packet, chan);
        timer();
      }

      // minimal wrapper to send raw packets
      chan.send = function(packet)
      {
        if(!hn.chans[chan.id]) return debug("dropping send packet to dead channel",chan.id,packet.js);
        if(!packet.js) packet.js = {};
        packet.js.c = chan.id;
        chan.ended = chan.ended || packet.js.err || packet.js.end;
        chan.sentAt = Date.now();
        debug("SEND",chan.type,JSON.stringify(packet.js),packet.body&&packet.body.length);
        hn.send(packet);
      }

      // convenience
      chan.end = function()
      {
        if(chan.ended) return;
        chan.send({js:{end:true}});
      }

      chan.fail = function(err)
      {
        if(chan.ended) return;
        chan.ended = err || "failed";
        hn.send({js:{err:chan.ended,c:chan.id}});
      }


      // send optional initial packet with type set
      if(arg.js)
      {
        arg.js.type = type;
        chan.send(arg);
        // retry if asked to, TODO use timeout for better time
        if(arg.retry)
        {
          var at = 1000;
          function retry(){
            if(chan.ended || chan.opened) return; // means we're gone or received a packet
            chan.send(arg);
            if(at < 4000) at *= 2;
            arg.retry--;
            if(arg.retry) setTimeout(retry, at);
          };
          setTimeout(retry, at);
        }
      }

      return chan;
    }

// create a reliable channel with a friendlier interface
    function channel(type, arg, callback)
    {
      var hn = this;
      var chan = {inq:[], outq:[], outSeq:0, inDone:-1, outConfirmed:-1, lastAck:-1, callback:callback};
      chan.id = arg.id;
      chan.startAt = Date.now();
      if(!chan.id)
      {
        chan.id = hn.chanOut;
        hn.chanOut += 2;
      }
      chan.isOut = (chan.id % 2 == hn.chanOut % 2);
      hn.chans[chan.id] = chan;
      // app originating if not bare, be friendly w/ the type, don't double-underscore if they did already
      if(!arg.bare && type.substr(0,1) !== "_") type = "_"+type;
      chan.type = type; // save for debug
      if(chan.type.substr(0,1) != "_") chan.safe = true; // means don't _ escape the json
      chan.hashname = hn.hashname; // for convenience

      debug("new channel",hn.hashname,chan.type,chan.id);

      // configure default timeout, for resend
      chan.timeout = function(timeout)
      {
        arg.timeout = timeout;
      }
      chan.timeout(arg.timeout || defaults.chan_timeout);

      // used by app to change how it interfaces with the channel
      chan.wrap = function(wrap)
      {
        if(!channelWraps[wrap]) return false;
        return channelWraps[wrap](chan);
      }

      // called to do eventual cleanup
      function cleanup()
      {
        if(chan.timer) clearTimeout(chan.timer);
        chan.timer = setTimeout(function(){
          chan.ended = chan.ended || true;
          hn.chanEnded(chan.id);
        }, arg.timeout);
      }

      // process packets at a raw level, handle all miss/ack tracking and ordering
      chan.receive = function(packet)
      {
        // if it's an incoming error, bail hard/fast
        if(packet.js.err)
        {
          chan.inq = [];
          chan.ended = packet.js.err;
          chan.callback(packet.js.err, packet, chan, function(){});
          cleanup();
          return;
        }

        chan.recvAt = Date.now();
        chan.opened = true;
        chan.last = packet.sender;

        // process any valid newer incoming ack/miss
        var ack = parseInt(packet.js.ack);
        if(ack > chan.outSeq) return warn("bad ack, dropping entirely",chan.outSeq,ack);
        var miss = Array.isArray(packet.js.miss) ? packet.js.miss : [];
        if(miss.length > 100) {
          warn("too many misses", miss.length, chan.id, packet.from.hashname);
          miss = miss.slice(0,100);
        }
        if(miss.length > 0 || ack > chan.lastAck)
        {
          debug("miss processing",ack,chan.lastAck,miss,chan.outq.length);
          chan.lastAck = ack;
          // rebuild outq, only keeping newer packets, resending any misses
          var outq = chan.outq;
          chan.outq = [];
          outq.forEach(function(pold){
            // packet acknowleged!
            if(pold.js.seq <= ack) {
              if(pold.callback) pold.callback();
              if(pold.js.end) cleanup();
              return;
            }
            chan.outq.push(pold);
            if(miss.indexOf(pold.js.seq) == -1) return;
            // resend misses but not too frequently
            if(Date.now() - pold.resentAt < 1000) return;
            pold.resentAt = Date.now();
            chan.ack(pold);
          });
        }

        // don't process packets w/o a seq, no batteries included
        var seq = packet.js.seq;
        if(!(seq >= 0)) return;

        // auto trigger an ack in case none were sent
        if(!chan.acker) chan.acker = setTimeout(function(){ delete chan.acker; chan.ack();}, defaults.chan_autoack);

        // drop duplicate packets, always force an ack
        if(seq <= chan.inDone || chan.inq[seq-(chan.inDone+1)]) return chan.forceAck = true;

        // drop if too far ahead, must ack
        if(seq-chan.inDone > defaults.chan_inbuf)
        {
          warn("chan too far behind, dropping", seq, chan.inDone, chan.id, packet.from.hashname);
          return chan.forceAck = true;
        }

        // stash this seq and process any in sequence, adjust for yacht-based array indicies
        chan.inq[seq-(chan.inDone+1)] = packet;
        debug("INQ",Object.keys(chan.inq),chan.inDone,chan.handling);
        chan.handler();
      }

      // wrapper to deliver packets in series
      chan.handler = function()
      {
        if(chan.handling) return;
        var packet = chan.inq[0];
        // always force an ack when there's misses yet
        if(!packet && chan.inq.length > 0) chan.forceAck = true;
        if(!packet) return;
        chan.handling = true;
        chan.ended = chan.ended || packet.js.end;
        if(!chan.safe) packet.js = packet.js._ || {}; // unescape all content json
        chan.callback(chan.ended, packet, chan, function(ack){
          // catch whenever it was ended to do cleanup
          chan.inq.shift();
          chan.inDone++;
          chan.handling = false;
          if(ack) chan.ack(); // auto-ack functionality
          // cleanup eventually
          if(chan.ended) cleanup();
          chan.handler();
        });
      }

      // resend the last sent packet if it wasn't acked
      chan.resend = function()
      {
        if(chan.ended) return;
        if(!chan.outq.length) return;
        var lastpacket = chan.outq[chan.outq.length-1];
        // timeout force-end the channel
        if(Date.now() - lastpacket.sentAt > arg.timeout)
        {
          hn.receive({js:{err:"timeout",c:chan.id}});
          return;
        }
        debug("channel resending");
        chan.ack(lastpacket);
        setTimeout(function(){chan.resend()}, defaults.chan_resend); // recurse until chan_timeout
      }

      // add/create ack/miss values and send
      chan.ack = function(packet)
      {
        if(!packet) debug("ACK CHECK",chan.id,chan.outConfirmed,chan.inDone);

        // these are just empty "ack" requests
        if(!packet)
        {
          // drop if no reason to ack so calling .ack() harmless when already ack'd
          if(!chan.forceAck && chan.outConfirmed == chan.inDone) return;
          packet = {js:{}};
        }
        chan.forceAck = false;

        // confirm only what's been processed
        if(chan.inDone >= 0) chan.outConfirmed = packet.js.ack = chan.inDone;

        // calculate misses, if any
        delete packet.js.miss; // when resending packets, make sure no old info slips through
        if(chan.inq.length > 0)
        {
          packet.js.miss = [];
          for(var i = 0; i < chan.inq.length; i++)
          {
            if(!chan.inq[i]) packet.js.miss.push(chan.inDone+i+1);
          }
        }

        // now validate and send the packet
        packet.js.c = chan.id;
        debug("SEND",chan.type,JSON.stringify(packet.js));
        cleanup();
        hn.send(packet);
      }

      // send content reliably
      chan.send = function(arg)
      {
        // create a new packet from the arg
        if(!arg) arg = {};
        // immediate fail errors
        if(arg.err)
        {
          if(chan.ended) return;
          chan.ended = arg.err;
          hn.send({js:{err:arg.err,c:chan.id}});
          return cleanup();
        }
        var packet = {};
        packet.js = chan.safe ? arg.js : {_:arg.js};
        if(arg.type) packet.js.type = arg.type;
        if(arg.end) packet.js.end = arg.end;
        packet.body = arg.body;
        packet.callback = arg.callback;

        // do durable stuff
        packet.js.seq = chan.outSeq++;

        // reset/update tracking stats
        packet.sentAt = Date.now();
        chan.outq.push(packet);

        // add optional ack/miss and send
        chan.ack(packet);

        // to auto-resend if it isn't acked
        if(chan.resender) clearTimeout(chan.resender);
        chan.resender = setTimeout(function(){chan.resend()}, defaults.chan_resend);
        return chan;
      }

      // convenience
      chan.end = function()
      {
        if(chan.ended) return chan.ack();
        chan.send({js:{end:true}});
      }

      // send error immediately, flexible arguments
      chan.fail = function(arg)
      {
        var err = "failed";
        if(typeof arg == "string") err = arg;
        if(typeof arg == "object" && arg.js && arg.js.err) err = arg.js.err;
        chan.send({err:err});
      }

      // send optional initial packet with type set
      if(arg.js)
      {
        arg.type = type;
        chan.send(arg);
      }

      return chan;
    }

    function inRelay(chan, packet)
    {
      var to = chan.relayTo;
      var self = packet.from.self;

      // if the active relay is failing, try to create one via a bridge
      if((packet.js.err || packet.js.warn) && !chan.migrating && to.relayChan == chan && !to.to)
      {
        debug("relay failing, trying to migrate",to.hashname);
        chan.migrating = true;
        // try to find all bridges w/ a matching path type
        var bridges = [];
        to.paths.forEach(function(path){
          if(!self.bridges[path.type]) return;
          Object.keys(self.bridges[path.type]).forEach(function(id){
            if(bridges.indexOf(id) == -1) bridges.push(id);
          });
        });
        // TODO, some way to sort them, retry?
        var done;
        bridges.forEach(function(id){
          if(done) return;
          if(id == to.hashname || id == packet.from.hashname) return; // lolz
          var hn = self.whois(id);
          if(!pathValid(hn.to)) return;
          // send peer request through the bridge
          done = hn.peer(to.hashname,to.csid);
        });
      }

      if(packet.js.err || packet.js.end)
      {
        debug("ending relay from",chan.hashname,"to",to.hashname,packet.js.err||packet.js.end);
        if(to.relayChan == chan) to.relayChan = false;
        return;
      }

      // clear any older default paths
      if(to.to && to.to.recvAt < chan.startAt) to.to = false;

      // most recent is always the current default back
      to.relayChan = chan;

      // if the sender has created a bridge, clone their path as the packet's origin!
      var path = (packet.js.bridge) ? JSON.parse(JSON.stringify(packet.sender.json)) : false;
      if(packet.body && packet.body.length) self.receive(packet.body, path);

      // always try a path sync to upgrade the relay
      to.pathSync();
    }

// someone's trying to connect to us, send an open to them
    function inConnect(err, packet, chan)
    {
      // if this channel is acting as a relay
      if(chan.relayTo) return inRelay(chan, packet);

      var to = chan.relayTo = packet.from.self.whokey(packet.js.from,packet.body);
      if(!chan.relayTo) return warn("invalid connect request from",packet.from.hashname,packet.js);

      // up the timeout to the nat default
      chan.timeout(defaults.nat_timeout);

      // try the suggested paths
      if(Array.isArray(packet.js.paths)) packet.js.paths.forEach(function(path){
        if(typeof path.type != "string") return debug("bad path",JSON.stringify(path));
        packet.from.self.send(path,to.open(),to);
      });

      // send back an open through the connect too
      chan.send({body:to.open()});

      // we know they see them too
      packet.from.sees(to.hashname);
    }

    function relay(self, from, to, packet)
    {
      if(from.ended && !to.ended) return to.send({js:{err:"disconnected"}});
      if(to.ended && !from.ended) return from.send({js:{err:"disconnected"}});

      // check to see if we should set the bridge flag for line packets
      var js = {};
      if(self.isBridge(from.hashname) || self.isBridge(to.hashname))
      {
        var bp = pdecode(packet.body);
        var id = bp && bp.body && bp.body.length > 16 && bp.body.slice(0,16).toString("hex");
        // only create bridge once from valid line packet
        if(id && bp.head.length == 0 && !to.bridged && to.last && !self.lines[id])
        {
          to.bridged = true;
          debug("auto-bridging",to.hashname,id,JSON.stringify(to.last.json))
          self.bridgeLine[id] = JSON.parse(JSON.stringify(to.last.json));
        }
      }

      // have to seen both directions to bridge
      if(from.bridged && to.bridged) js = {"bridge":true};

      // throttle
      if(!from.relayed || Date.now() - from.relayed > 1000)
      {
        from.relayed = Date.now();
        from.relays = 0;
      }
      from.relays++;
      if(from.relays > 5)
      {
        debug("relay too fast, warning",from.relays);
        js.warn = "toofast";
        // TODO start dropping these again in production
//    from.send({js:js});
//    return;
      }

      from.relayed = Date.now();
      to.send({js:js, body:packet.body});
    }

// be the middleman to help NAT hole punch
    function inPeer(err, packet, chan)
    {
      if(err) return;
      var self = packet.from.self;
      if(chan.relay) return relay(self, chan, chan.relay, packet);

      if(!isHEX(packet.js.peer, 64)) return;
      var peer = self.whois(packet.js.peer);
      if(!peer) return;

      // only accept peer if active network or support bridging for either party
      if(!(pathValid(peer.to) || self.isBridge(packet.from.hashname) || self.isBridge(peer.hashname))) return debug("disconnected peer request");

      // sanity on incoming paths array
      if(!Array.isArray(packet.js.paths)) packet.js.paths = [];

      // insert our known usable/safe sender paths
      packet.from.paths.forEach(function(path){
        if(!path.recvAt) return;
        if(pathShareOrder.indexOf(path.type) == -1) return;
        if(isLocalPath(path) && !peer.isLocal) return;
        packet.js.paths.push(path.json);
      });

      // load/cleanse all paths
      var js = {from:packet.from.parts,paths:[]};
      packet.js.paths.forEach(function(path){
        if(typeof path.type != "string") return;
        if(pathMatch(path,js.paths)) return; // duplicate
        js.paths.push(path);
      });

      // start relay via connect, must bundle the senders key so the recipient can open them
      chan.timeout(defaults.nat_timeout);
      chan.relay = peer.raw("connect",{js:js, body:packet.body},function(err, packet, chan2){
        if(err) return;
        relay(self, chan2, chan, packet);
      });
    }

// return a see to anyone closer
    function inSeek(err, packet, chan)
    {
      if(err) return;
      if(!isHEX(packet.js.seek)) return warn("invalid seek of ", packet.js.seek, "from:", packet.from.hashname);
      var self = packet.from.self;
      var seek = packet.js.seek;

      var see = [];
      var seen = {};

      // see if we have any seeds to add
      var bucket = dhash(self.hashname, packet.js.seek);
      var links = self.buckets[bucket] ? self.buckets[bucket] : [];

      // first, sort by age and add the most wise one
      links.sort(function(a,b){ return a.age - b.age}).forEach(function(seed){
        if(see.length) return;
        if(!seed.seed) return;
        see.push(seed.address(packet.from));
        seen[seed.hashname] = true;
      });

      // sort by distance for more
      links.sort(function(a,b){ return dhash(seek,a.hashname) - dhash(seek,b.hashname)}).forEach(function(link){
        if(seen[link.hashname]) return;
        if(link.seed || link.hashname.substr(0,seek.length) == seek)
        {
          see.push(link.address(packet.from));
          seen[link.hashname] = true;
        }
      });

      var answer = {end:true, see:see.filter(function(x){return x}).slice(0,8)};
      chan.send({js:answer});
    }

// accept a dht link
    function inLink(err, packet, chan)
    {
      if(err) return;
      var self = packet.from.self;
      chan.timeout(defaults.nat_timeout*2); // two NAT windows to be safe

      // add in this link
      debug("LINKUP",packet.from.hashname);
      if(!packet.from.age) packet.from.age = Date.now();
      packet.from.linked = chan;
      packet.from.seed = packet.js.seed;
      if(self.buckets[packet.from.bucket].indexOf(packet.from) == -1) self.buckets[packet.from.bucket].push(packet.from);

      // if it was a local seed, add them to list to always-query
      if(packet.from.seed && packet.from.isLocal && self.locals.indexOf(packet.from) == -1) self.locals.push(packet.from);

      // send a response if this is a new incoming
      if(!chan.sentAt) packet.from.link();

      // look for any see and check to see if we should create a link
      if(Array.isArray(packet.js.see)) packet.js.see.forEach(function(address){
        var hn = packet.from.sees(address);
        if(!hn || hn.linked) return;
        if(self.buckets[hn.bucket].length < defaults.link_k) hn.link();
      });

      // check for bridges
      if(Array.isArray(packet.js.bridges)) packet.js.bridges.forEach(function(type){
        if(!self.bridges[type]) self.bridges[type] = {};
        self.bridges[type][packet.from.hashname] = Date.now();
      });

      // let mainteanance handle
      chan.callback = inMaintenance;
    }

    function inMaintenance(err, packet, chan)
    {
      // ignore if this isn't the main link
      if(!packet.from || !packet.from.linked || packet.from.linked != chan) return;
      var self = packet.from.self;
      if(err)
      {
        debug("LINKDOWN",packet.from.hashname,err);
        delete packet.from.linked;
        var index = self.buckets[packet.from.bucket].indexOf(packet.from);
        if(index > -1) self.buckets[packet.from.bucket].splice(index,1);
        // if this channel was ever active, try to re-start it
        if(chan.recvAt) packet.from.link();
        return;
      }

      // update seed status
      packet.from.seed = packet.js.seed;

      // only send a response if we've not sent one in a while
      if((Date.now() - chan.sentAt) > Math.ceil(defaults.link_timer/2)) chan.send({js:{seed:self.seed}});
    }

// update/respond to network state
    function inPath(err, packet, chan)
    {
      if(err) return;
      var self = packet.from.self;

      // add any/all suggested paths
      if(Array.isArray(packet.js.paths)) packet.js.paths.forEach(function(path){packet.from.pathGet(path)});

      // send back on all paths
      packet.from.paths.forEach(function(path){
        var js = {};
        if(pathShareOrder.indexOf(path.type) >= 0) js.path = path.json;
        chan.send({js:js, to:path});
      });
    }

// someone's looking for a local seed
    function inPing(self, packet)
    {
      if(packet.js.trace == self.tracer) return; // ignore ourselves
      if(self.locals.length > 1) return; // more than one locally is announcing already
      if(self.lanSkip && self.lanSkip == packet.js.trace) return; // often immediate duplicates, skip them
      debug("PING-PONG",packet.js,packet.sender);
      self.lanSkip = packet.js.trace;
      // announce ourself as the seed back
      var csid = partsMatch(self.parts,packet.js);
      if(!csid) return;
      var js = {type:"pong",from:self.parts,trace:packet.js.trace};
      self.send(packet.sender, pencode(js, getkey(self,csid)));
    }

// answers from any LAN broadcast notice we sent
    function inPong(self, packet)
    {
      debug("PONG",JSON.stringify(packet.js),JSON.stringify(packet.sender));
      if(packet.js.trace != self.tracer) return;
      if(self.locals.length >= 5) return warn("locals full");
      if(!packet.body || packet.body.length == 0) return;
      var to = self.whokey(packet.js.from,packet.body);
      if(!to) return warn("invalid lan request from",packet.js.from,packet.sender);
      to.local = true;
      debug("local seed open",to.hashname,JSON.stringify(packet.sender));
      self.send(packet.sender,to.open(),to);
      to.link();
    }

// utility functions

// just return true/false if it's at least the format of a sha1
    function isHEX(str, len)
    {
      if(typeof str !== "string") return false;
      if(len && str.length !== len) return false;
      if(str.replace(/[a-f0-9]+/i, "").length !== 0) return false;
      return true;
    }

// XOR distance between two hex strings, high is furthest bit, 0 is closest bit, -1 is error
    function dhash(h1, h2) {
      // convert to nibbles, easier to understand
      var n1 = hex2nib(h1);
      var n2 = hex2nib(h2);
      if(!n1.length || !n2.length) return -1;
      // compare nibbles
      var sbtab = [-1,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3];
      var ret = 252;
      for (var i = 0; i < n1.length; i++) {
        if(!n2[i]) return ret;
        var diff = n1[i] ^ n2[i];
        if (diff) return ret + sbtab[diff];
        ret -= 4;
      }
      return ret;
    }

// convert hex string to nibble array
    function hex2nib(hex)
    {
      var ret = [];
      for (var i = 0; i < hex.length / 2; i ++) {
        var bite = parseInt(hex.substr(i * 2, 2), 16);
        if (isNaN(bite)) return [];
        ret[ret.length] = bite >> 4;
        ret[ret.length] = bite & 0xf;
      }
      return ret;
    }

    function pathMatch(path1, paths)
    {
      var match;
      if(!path1 || !Array.isArray(paths)) return match;
      paths.forEach(function(path2){
        if(!path2 || path2.type != path1.type) return;
        switch(path1.type)
        {
          case "ipv4":
          case "ipv6":
            if(path1.ip == path2.ip && path1.port == path2.port) match = path2;
            break;
          case "http":
            if(path1.http == path2.http) match = path2;
            break;
          default:
            // all other paths match based on id, local, webrtc, etc
            if(path1.id === path2.id) match = path2;
        }
      });
      return match;
    }

// validate if a network path is acceptable to stop at
    function pathValid(path)
    {
      if(!path || path.gone) return false;
      if(!path.recvAt) return false; // all else must receive to be valid
      if(Date.now() - path.recvAt < defaults.nat_timeout) return true; // received anything recently is good
      return false;
    }

    function partsMatch(parts1, parts2)
    {
      if(typeof parts1 != "object" || typeof parts2 != "object") return false;
      var ids = Object.keys(parts1).sort();
      var csid;
      while(csid = ids.pop()) if(parts2[csid]) return csid;
      return false;
    }

    function isLocalPath(path)
    {
      if(!path || !path.type) return false;
      if(path.type == "bluetooth") return true;
      if(path.type == "http" && typeof path.http == "string") return isLocalIP(require("url").parse(path.http).hostname);
      if(["ipv4","ipv6"].indexOf(path.type) >= 0) return isLocalIP(path.ip);
      // http?
      return false;
    }

// return if an IP is local or public
    function isLocalIP(ip)
    {
      // ipv6 ones
      if(ip.indexOf(":") >= 0)
      {
        if(ip.indexOf("::") == 0) return true; // localhost
        if(ip.indexOf("fc00") == 0) return true;
        if(ip.indexOf("fe80") == 0) return true;
        return false;
      }

      var parts = ip.split(".");
      if(parts[0] == "0") return true;
      if(parts[0] == "127") return true; // localhost
      if(parts[0] == "10") return true;
      if(parts[0] == "192" && parts[1] == "168") return true;
      if(parts[0] == "172" && parts[1] >= 16 && parts[1] <= 31) return true;
      if(parts[0] == "169" && parts[1] == "254") return true; // link local
      return false;
    }

// return random bytes, in hex
    function randomHEX(len)
    {
      return crypto.randomBytes(len).toString("hex");
    }

    function parts2hn(parts)
    {
      var rollup = new Buffer(0);
      Object.keys(parts).sort().forEach(function(id){
        rollup = crypto.createHash("sha256").update(Buffer.concat([rollup,new Buffer(id)])).digest();
        rollup = crypto.createHash("sha256").update(Buffer.concat([rollup,new Buffer(parts[id])])).digest();
      });
      return rollup.toString("hex");
    }

// encode a packet
    function pencode(js, body)
    {
      // be flexible, take {js:{},body:...} as first arg
      if(!body && js && js.js)
      {
        body = js.body;
        js = js.js;
      }
      var head = (typeof js == "number") ? new Buffer(String.fromCharCode(js)) : new Buffer(js?JSON.stringify(js):"", "utf8");
      if(typeof body == "string") body = new Buffer(body, "binary");
      body = body || new Buffer(0);
      var len = new Buffer(2);
      len.writeInt16BE(head.length, 0);
      return Buffer.concat([len, head, body]);
    }

// packet decoding
    function pdecode(packet)
    {
      if(!packet) return undefined;
      var buf = (typeof packet == "string") ? new Buffer(packet, "binary") : packet;
      if(packet.length < 2) return undefined;

      // read and validate the json length
      var len = buf.readUInt16BE(0);
      if(len > (buf.length - 2)) return undefined;
      var head = buf.slice(2, len+2);
      var body = buf.slice(len + 2);

      // parse out the json
      var js = {};
      if(len > 1)
      {
        try {
          js = JSON.parse(head.toString("utf8"));
        } catch(E) {
          console.log("couldn't parse JS",buf.toString("hex"),E);
          return undefined;
        }
      }
      return {js:js, length:buf.length, head:head.toString("binary"), body:body};
    }

    function getkey(id, csid)
    {
      return id.cs && id.cs[csid] && id.cs[csid].key;
    }

    function loadkeys(self)
    {
      self.cs = {};
      self.keys = {};
      self.parts = {};
      var err = false;
      Object.keys(self.id).forEach(function(csid){
        if(csid.length != 2) return; // only csid keys
        self.cs[csid] = {};
        if(!self.CSets[csid]) err = csid+" not supported";
        err = err||self.CSets[csid].loadkey(self.cs[csid], self.id[csid], self.id[csid+"_secret"]);
        self.keys[csid] = self.id[csid];
        self.parts[csid] = crypto.createHash("sha256").update(self.cs[csid].key).digest("hex");
      });
      return err;
    }

    function loadkey(self, id, csid, key)
    {
      id.csid = csid;
      return self.CSets[csid].loadkey(id, key);
    }

    function keysgen(cbDone,cbStep)
    {
      var self = this;
      var ret = {};
      var todo = Object.keys(self.CSets);
      if(todo.length == 0) return cbDone("no sets supported");
      function pop(err)
      {
        if(err) return cbDone(err);
        var csid = todo.pop();
        if(!csid){
          self.load(ret);
          return cbDone(null, ret);
        }
        self.CSets[csid].genkey(ret,pop,cbStep);
      }
      pop();
    }

    function ticketize(self, to, inner)
    {
      if(!to.csid)
      {
        console.log("can't ticket w/ no key");
        return false;
      }
      // clone the recipient CS stuff to gen new ephemeral line state
      var tcs = {};
      self.CSets[to.csid].loadkey(tcs,to.key);
      return self.CSets[to.csid].openize(self, tcs, pencode(inner));
    }

    function deticketize(self, from, open)
    {
      var ret;
      var csid = open.head.charCodeAt().toString(16);
      if(!self.CSets[csid] || csid != from.csid) ret = {err:"invalid CSID of "+csid};
      else{
        open.from = from;
        try{ret = self.CSets[csid].deopenize(self, open);}catch(E){ret = {err:E};}
      }
      if(ret.err || !ret.inner)
      {
        debug("deticketize failed",ret.err);
        return false;
      }
      return ret.inner;
    }

    function openize(self, to)
    {
      if(!to.csid)
      {
        console.log("can't open w/ no key");
        return undefined;
      }
      if(!to.lineOut) to.lineOut = randomHEX(16);
      if(!to.lineAt) to.lineAt = Date.now();
      var inner = {}
      inner.at = to.lineAt; // always the same for the generated line id/key
      inner.to = to.hashname;
      inner.from = self.parts;
      inner.line = to.lineOut;
      return self.CSets[to.csid].openize(self, to, inner);
    }

    function deopenize(self, open)
    {
//  console.log("DEOPEN",open.body.length);
      var ret;
      var csid = open.head.charCodeAt().toString(16);
      if(!self.CSets[csid]) return {err:"unknown CSID of "+csid};
      try{ret = self.CSets[csid].deopenize(self, open);}catch(E){return {err:E};}
      ret.csid = csid;
      return ret;
    }

    var urllib = require("url");
    function uriparse(uri)
    {
      // node's uri parser enforces dns max 63 chars per label, grr!
      if(typeof uri !== "string") uri = "";
      var hashname = uri.match(/[0-9A-Fa-f]{64}/);
      if(!hashname) return urllib.parse(uri);
      var full = hashname[0];
      var part = full.substr(0,32);
      var u = urllib.parse(uri.replace(full,part));
      if(u.hostname != part) return urllib.parse(uri); // hashname was not the hostname
      Object.keys(u).forEach(function(k){
        if(typeof u[k] != "string") return;
        u[k] = u[k].replace(part,full);
      });
      return u;
    }

  }).call(this,require("buffer").Buffer)
},{"buffer":29,"crypto":35,"url":70}],21:[function(require,module,exports){
  exports.json = require("./seeds.json");
  exports.install = function(self, args)
  {
    var seeds = exports.json;
    if(args && args.seeds)
    {
      if(typeof args.seeds == "string") seeds = require(args.seeds);
      if(typeof args.seeds == "object") seeds = args.seeds;
    }
    Object.keys(seeds).forEach(function(seed){self.addSeed(seeds[seed])});
  }
},{"./seeds.json":22}],22:[function(require,module,exports){
  module.exports={
  "876d5ce8956009afc010fc908ca29617a444db660cd5598d81bb6a5a2635ba7a": {
    "paths": [
      {
        "type": "http",
        "http": "http://azure.lewisl.net:42424"
      }
    ],
    "parts": {
      "2a": "a9b3da6d514c8aeb1cc001f5423dbf80f0c523a000b1087286fd1b18168d9e3e",
      "1a": "fc1c470beb1ca7fdb6ecf7a7e3b542e087e0e7705d91666e7a124bc2aeeea9bf"
    },
    "keys": {
      "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Lb4LwKUW1D3XI/jK5cBtbO17e/6oSD5myO/wYOIyRcJpDgRe////94ugsPGO/FtDnNdWTJ8/bpRGkxnlHadSGA0K3hukx+SOSdddzB/wAp86l0eCuiIBeDfnBYvxC4KmiRHFHMXSRYq2HWSzH2Knz65g/6VI/Qe/F4M8+A19Wxq1RBDtLcigJtkUdJ/y4TUdSwAPaM/mcQFwjCqssC8sgH6LzqPP43+yloxqG5Hx4IsWgcnBzaCQh8yYbP04nH7fd19gPXyWCSjo3CdSwnvfCHiU/eulXT1wubMhR0ZI/XrF3fC8tglgAOsqSxBdwpWo7iZzrTX2sxV8QWnZ5xsmwIDAQAB",
      "1a": "BO7ZnXZ6VorqlSXhXLfkHtPwctqM53eL3WRqRX/RHGVB2QuTYwLMnw=="
    }
  }
}
//  {
//    "5c63d7fb6a101471f15064ed05141b342cce9f3bebeb1616d8fc83dab35e61d5": {
//      "paths": [
//        {
//          "type": "http",
//          "http": "http://azure.lewisl.net:42424"
//        },
//        {
//          "type": "ipv4",
//          "ip": "23.100.21.191",
//          "port": 42424
//        }
//      ],
//      "parts": {
//        "2a": "8cb716b34f138d72d32ba1d79cab4bb0d713bc3b959936b2273be29a15d9e437",
//        "1a": "0360efab9c139a9e6cd49b945ce93efef3f39b7f0238bb5e087ea0ed4b935835"
//      },
//      "keys": {
//        "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxlm1hU1Oks9sHFbAiwevgjwirVmyEjxNmMUNV3lZZrejk3K0J59AOpt4ohEsGzySIumALLGpDSX+HAiuvEQF1PQnZW1kqtaGyiHymQH0V56FN5RYzpBXIOkE+eel2Ge3WhIGDP7v2jg6rIL3h0b+H9fbX3ixfPQC0NE796wB2xu5thX7ylM3DSFfcFUGh3P1WDXgejluAsw8AzSC1GjvH+Bw0gtNA7aFHiyrxhvAc5EEaeBQbbdBBANsb41ToWjhnFdgWEZUHFGVXdh0WyHDMNiSp+9JMHpbgb/zct+dVCGMK5HEDB05nPRadLkSbQIUUQLxEYUVC+Yvfangi0NSwQIDAQAB",
//        "1a": "PK+9AzIMgPMTD+rr8v1Oct2KYRslcr3nNznM7jZgWmDneqSFfqI50Q=="
//      }
//    }
//  }

},{}],23:[function(require,module,exports){
  (function (Buffer){
    exports.install = function(self)
    {
      self.sock = function(req)
      {
        if(self.isHashname(req)) req = {to:req};
        if(typeof req != "object") return console.log("invalid args")&&false;
        var to = self.whois(req.to);
        if(!to) return console.log("invalid to hashname",req.to)&&false;
        delete req.to;
        var chan = to.start("sock",{bare:true,js:req});
        return chan.wrap("stream");
      }
      self.onSock = function(cbSock)
      {
        self.rels["sock"] = function(err, packet, chan, callback)
        {
          if(err) return;
          callback();
          cbSock(chan.wrap("stream"));
        }
      }

      self.wraps["stream"] = function(chan)
      {
        var pipe = new require("stream").Duplex();

        pipe.on("finish",function(){
          chan.send({js:{end:true}});
        });

        pipe.on("error",function(err){
          chan.fail({js:{err:err}});
        });

        pipe._write = function(data,enc,cbWrite)
        {
          if(chan.ended) return cbWrite("closed");
          // chunk it
          while(data.length)
          {
            var chunk = data.slice(0,1000);
            data = data.slice(1000);
            var packet = {js:{},body:chunk};
            // last packet gets continuation callback
            if(!data.length)
            {
              packet.callback = cbWrite;
              if(pipe.ended) packet.js.end = true;
            }
            chan.send(packet);
          }
        }

        // convenience to end with optional data
        pipe.end = function(data)
        {
          pipe.ended = true;
          if(!data) data = new Buffer(0);
          pipe.write(data);
        }

        // handle backpressure flag from the pipe.push()
        var more = false;
        pipe._read = function(size){
          if(more) more();
          more = false;
        };

        chan.callback = function(err, packet, chan, cbMore) {
          // was a wait writing, let it through
          if(packet.body) if(!pipe.push(packet.body)) more = cbMore;
          if(err) pipe.push(null);
          if(!more) cbMore();
        }

        return pipe;
      }
    }
  }).call(this,require("buffer").Buffer)
},{"buffer":29}],24:[function(require,module,exports){
  exports.install = function(self)
  {
    self.TSockets = {};
    self.socket = function(uri, callback)
    {
      if(typeof uri != "string") return warn("invalid TS uri")&&false;
      // detect connecting socket
      if(uri.indexOf("ts://") == 0)
      {
        var parts = uri.substr(5).split("/");
        var to = self.whois(parts.shift());
        if(!to) return warn("invalid TS hashname")&&false;
        var pathname = parts.join("/");
        if(!pathname) pathname = "/";
        var chan = to.start("ts",{bare:true,js:{path:pathname}});
        chan.wrap("TS");
        return chan.socket;
      }
      if(uri.indexOf("/") != 0) return warn("invalid TS listening uri")&&false;
      self.TSockets[uri] = callback;
    }
    self.rels["ts"] = function(err, packet, chan, callback)
    {
      if(err) return;
      var self = packet.from.self;
      callback();

      // ensure valid request
      if(typeof packet.js.path != "string" || !self.TSockets[packet.js.path]) return chan.err("unknown path");

      // create the socket and hand back to app
      chan.wrap("TS");
      self.TSockets[packet.js.path](chan.socket);
      chan.send({js:{open:true}});
    }


    self.wraps["TS"] = function(chan){
      chan.socket = {data:"", hashname:chan.hashname, id:chan.id};
      chan.callback = function(err, packet, chan, callback){
        chan.socket.readyState = 1;
        if(chan.socket.onopen)
        {
          chan.socket.onopen();
          delete chan.socket.onopen;
        }
        if(packet.body) chan.socket.data += packet.body;
        if(packet.js.done)
        {
          // allow ack-able onmessage handler instead
          if(chan.socket.onmessageack) chan.socket.onmessageack(chan.socket, callback);
          else{
            if(chan.socket.onmessage) chan.socket.onmessage(chan.socket);
            chan.socket.data = "";
            callback();
          }
        }else{
          callback();
        }
        if(err)
        {
          chan.socket.readyState = 2;
          if(err != true && chan.socket.onerror) chan.socket.onerror(err);
          if(chan.socket.onclose) chan.socket.onclose();
        }
      }
      // set up TS object for external use
      chan.socket.readyState = chan.lastIn ? 1 : 0; // if channel was already active, set state 1
      chan.socket.send = function(data, callback){
        if(chan.socket.readyState != 1) return console.log("sending fail to TS readyState",chan.socket.readyState)&&false;
        // chunk it
        while(data)
        {
          var chunk = data.substr(0,1000);
          data = data.substr(1000);
          var packet = {js:{},body:chunk};
          // last packet gets confirmed/flag
          if(!data)
          {
            packet.callback = callback;
            packet.js.done = true;
          }
          chan.send(packet);
        }
      }
      chan.socket.close = function(){
        chan.socket.readyState = 2;
        chan.done();
      }
      return chan.socket;
    }
  }
},{}],25:[function(require,module,exports){
  (function (Buffer){
    var stream = require("stream");
    var urllib = require("url");
    var httplib = require("http");

    exports.install = function(self)
    {
      self.thtp = {};
      self.thtp.request = function(args, cbRequest)
      {
        if(!cbRequest) cbRequest = function(){};
        if(typeof args == "string") args = {uri:args}; // convenience
        if(typeof args != "object" || !(args.uri || args.url || args.hashname)) return errored("invalid args",cbRequest);

        if(args.hashname) args.uri = "thtp://"+args.hashname+args.path;
        var uri = self.uriparse(args.uri||args.url);

        if(uri.protocol != "thtp:") return errored("invalid protocol "+uri.protocol,cbRequest);
        if(uri.hostname == self.hashname) return errored("can't request self",cbRequest);
        var to;
        if(!(to = self.whois(uri.hostname))) return errored("invalid hashname",cbRequest);

        var js = {};
        if(typeof args.headers == "object") Object.keys(args.headers).forEach(function(header){
          js[header.toLowerCase()] = args.headers[header].toString();
        });
        if(args.body) js["content-length"] = args.body.length.toString();
        js.method = args.method || "get";
        js.path = uri.path;

        var body = self.pencode(js,args.body);
        js = {};

        // single-shot requests
        if(body.length <= 1000) js.end = true;

        var pin = new Buffer(0);
//    console.log("REQ",js,body);
        var pipe = streamer(to.start("thtp",{bare:true,js:js,body:body.slice(0,1000)},function(err,packet,chan,cbChan){
          cbChan(true);
//      console.log("PACKET",packet.js,packet.body.length)
          if(pipe.headers)
          {
            pipe.push(packet.body);
            if(err) pipe.emit("end");
            return;
          }

          if(packet.body) pin = Buffer.concat([pin,packet.body]);
          var http;
          if(!(http = self.pdecode(pin)))
          {
            // no packet (yet)
            if(err) cbRequest(500,pipe);
            return;
          }

          pipe.status = parseInt(http.js.status) || 500;
          pipe.headers = http.js;
          cbRequest(pipe.status >= 300?pipe.status.toString():false,pipe); // flag error for status too
          if(http.body) pipe.push(http.body);
          if(err) pipe.emit("end");
        }));

        // any remainder
        if(body.length > 1000) pipe.end(body.slice(1000));

        return pipe;
      }

      self.thtp.listen = function(cbListen)
      {
        self.rels["thtp"] = function(err, packet, chan, cbStart)
        {

          var pipe;
          var pin = new Buffer(0);
          chan.callback = function(err, packet, chan, cbChan)
          {
            cbChan(true);
            // just streaming the body
            if(pipe)
            {
              if(packet.body) pipe.push(packet.body);
              if(err) pipe.emit("end");
              return;
            }

            // if parsing the request yet
            pin = Buffer.concat([pin,packet.body]);
            if(!(http = self.pdecode(pin)))
            {
              if(err) chan.end();
              return;
            }

//        console.log("REQ",http,http.js);
            // new thtp request
            if(typeof http.js.method != "string" || typeof http.js.path != "string") return chan.err("invalid");

            pipe = streamer(chan);
            pipe.method = http.js.method;
            pipe.path = http.js.path;
            delete http.js.method;
            delete http.js.path;
            pipe.headers = http.js;
            cbListen(pipe,function(args){
              if(!args) args = {};
              if(args.err) return errored(err,chan.err);

              var js = {}
              if(typeof args.headers == "object") Object.keys(args.headers).forEach(function(header){
                js[header.toLowerCase()] = args.headers[header].toString();
              });
              js.status = args.status || 200;
              if(args.json) args.body = JSON.stringify(args.json);
              if(args.body) js["content-length"] = args.body.length.toString();
              var phttp = self.pencode(js,args.body);

              var js = {};
              if(args.body && phttp.length <= 1000) js.end = true;
              chan.send({js:js,body:phttp.slice(0,1000)});
              if(phttp.length >1000) pipe.write(phttp.slice(1000));
              return pipe;
            });
            if(http.body) pipe.push(http.body);
            if(err) pipe.emit("end");
          }
          chan.callback(err,packet,chan,cbStart);
        }
      }

      var mPaths = {};
      self.thtp.match = function(uri, cbMatch)
      {
        var path = self.uriparse(uri).pathname;
        mPaths[path] = cbMatch;
        if(Object.keys(mPaths).length > 1) return;
        self.thtp.listen(function(req,cbRes){
          var match;
          Object.keys(mPaths).forEach(function(path){
            if(req.path.indexOf(path) != 0) return;
            if(match && match.length > path) return; // prefer longest match
            match = path;
          })
//      console.log("CHECKING",req.path,match);
          if(match) return mPaths[match](req,cbRes);
          cbRes({status:404,body:"not found"});
        });
      }

      // this is super simplistic, it'll need a lot of edge case fixes
      self.thtp.proxy = function(args)
      {
        if(args.address == "0.0.0.0") args.address = "127.0.0.1";
        self.thtp.listen(function(req,cbRes){
          var opt = {host:args.address,port:args.port,headers:req.headers,method:req.method,path:req.path};
          req.pipe(httplib.request(opt, function(res){
            res.pipe(cbRes({status:res.statusCode,headers:res.headers}));
          }));
        });
      }
    }

// convenience wrapper
    function errored(err, cb)
    {
      cb(err);
      var pipe = stream.Readable();
      pipe._read = function(){}; // TODO
      pipe.emit("end");
      return pipe;
    }

    function streamer(chan)
    {
      var pipe = stream.Duplex();
      pipe._read = function(){}; // TODO
      pipe.on("finish",function(){
        chan.send({js:{end:true}});
      });
      pipe._write = function(data,enc,cbWrite)
      {
        // chunk it
        while(data.length)
        {
          var chunk = data.slice(0,1000);
          data = data.slice(1000);
          var packet = {js:{},body:chunk};
          // last packet gets confirmed/flag
          if(!data.length)
          {
            packet.callback = cbWrite;
            if(pipe.ended) packet.js.end = true;
          }
          chan.send(packet);
        }
      }
      pipe.end = function(data)
      {
        pipe.ended = true;
        if(!data) data = new Buffer(0);
        pipe.write(data);
      }
      return pipe;
    }
  }).call(this,require("buffer").Buffer)
},{"buffer":29,"http":46,"stream":69,"url":70}],26:[function(require,module,exports){
  (function (Buffer){
    var crypto = require("crypto");

    exports.install = function(self)
    {
      var tokens = {};
      self.token = function(token, callback)
      {
        if(typeof token == "function")
        {
          callback = token;
          token = false;
        }
        if(!token)
        {
          var bytes = new Buffer(self.hashname,"hex");
          var rand = new Buffer(self.randomHEX(8),"hex");
          var hash = crypto.createHash("sha256").update(Buffer.concat([bytes,rand])).digest();
          token = Buffer.concat([bytes.slice(0,16),rand,hash.slice(0,8)]).toString("hex");
        }
        if(callback) tokens[token] = callback;
        return token;
      }

      self.raws["token"] = function(err, packet, chan)
      {
        if(err) return;
        var self = packet.from.self;

        // ensure valid request
        if(!self.isHashname(packet.js.token)) return chan.err("invalid");

        if(tokens[packet.js.token])
        {
          tokens[packet.js.token](packet.from);
          return chan.send({js:{end:true}});
        }

        if(!self.tokens) return chan.err("unknown");

        self.tokens(packet.js.token, packet.from, function(err){
          if(err) chan.err(err);
          can.send({js:{end:true}});
        });
      }

      self.dispense = function(token, callback)
      {
        self.seek(token, function(err, see){
          if(!Array.isArray(see)) return callback(err||"not found");
          var match;
          see.forEach(function(hn){
            if(hn.substr(0,32) != token.substr(0,32)) return;
            var bytes = new Buffer(hn,"hex");
            var rand = new Buffer(token.substr(32,16),"hex");
            var hash = crypto.createHash("sha256").update(Buffer.concat([bytes,rand])).digest();
            token2 = Buffer.concat([bytes.slice(0,16),rand,hash.slice(0,8)]).toString("hex");
            if(token == token2) match = hn;
          });
          if(!match || !(match = self.whois(match))) return callback("not found");
          match.raw("token",{js:{token:token},retries:3}, function(err){
            callback((err !== true)?err:false, match);
          });
        });
      }
    }
  }).call(this,require("buffer").Buffer)
},{"buffer":29,"crypto":35}],27:[function(require,module,exports){
  (function (Buffer){
    var rtc = require("webrtc-peer");

    exports.install = function(self)
    {
      if(!rtc.hasWebRTC) return false;
      self.pathSet({type:"webrtc"});

      var conns = {};
      var peers = {};

      function init(initiate,chan,to)
      {
        chan.wrap("TS"); // takes over channel callbacks, creates chan.socket
        peers[to] = chan;

        var pch;
        chan.socket.onopen = function()
        {
          pch = new rtc.peer({initiate:initiate, _self:"self", _peer:to});
          pch.DEBUG = true;
          pch.onsignal = function(signal) {
            console.log("RTC OUT", signal);
            chan.socket.send(JSON.stringify(signal));
          }
          pch.onconnection = function() {
            console.log("RTC CONNECTED");
            conns[to] = pch;
            if(chan.cached) pch.send(chan.cached);
          }
          pch.onmessage = function(safe) {
            self.receive(new Buffer(safe, "base64"),{type:"webrtc"});
          }
        }
        chan.socket.onmessage = function(data) {
          console.log("RTC IN", data);
          try {
            data = JSON.parse(data.data)
          } catch (E) {
            return console.log("rtc parse error", E, data.data)
          }
          pch.signal(data);
        }
      }

      self.deliver("webrtc", function(path, msg, to) {
        var safe = msg.toString("base64");
        // have a conn already
        if(conns[to.hashname]) return conns[to.hashname].send(safe);
        // if signalling, just cache the most recent
        if(peers[to.hashname]) return peers[to.hashname].cached = safe;
        // start a new signal path
        var chan = to.start("webrtc", {bare:true});
        // it may be possible for chan send to immediately recurse back here before peers[to] is set, hack around it
        setTimeout(function(){ chan.send({type:"webrtc",js:{open:true}}); },10);
        // initialize signalling
        init(true,chan,to.hashname);
      });

      self.rels["webrtc"] = function(err, packet, chan, cb) {
        cb();
        if(err) return;
        var from = packet.from.hashname;
        // detect simultaneous and prefer the highest
        if(peers[from] && chan.id < peers[from].id) return chan.fail("duplicate");
        chan.send({js:{open:true}});
        init(false,chan,from);
      }
    }


  }).call(this,require("buffer").Buffer)
},{"buffer":29,"webrtc-peer":28}],28:[function(require,module,exports){
// everything that's exported
  exports.peer = PeerConnectionHandler;
  exports.iceServers = [{
    "url": "stun:23.21.150.121"
  }];

// PeerConnectionHandler extracted from code in https://github.com/natevw/PeerPouch
  var RTCPeerConnection = window.mozRTCPeerConnection || window.RTCPeerConnection || window.webkitRTCPeerConnection,
    RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate || window.webkitRTCIceCandidate;

  exports.hasWebRTC = RTCPeerConnection ? true : false;

  function PeerConnectionHandler(opts) {
    if(!opts) opts = {};
    opts.reliable = true;
    var cfg = {
        "iceServers": exports.iceServers
      },
      con = (opts.reliable) ? {} : {
        'optional': [{
          'RtpDataChannels': true
        }]
      };

    this._rtc = new RTCPeerConnection(cfg, con);

    this.LOG_SELF = opts._self;
    this.LOG_PEER = opts._peer;
    this._channel = null;

    this.onsignal = null; // caller MUST provide this
    this.onmessage = null; // caller SHOULD provide this
    this.onconnection = null; // …and maybe this

    var handler = this,
      rtc = this._rtc;
    if (opts.initiate) this._setupChannel();
    else rtc.ondatachannel = this._setupChannel.bind(this);
    rtc.onnegotiationneeded = function(evt) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "saw negotiation trigger and will create an offer");
      rtc.createOffer(function(offerDesc) {
        if (handler.DEBUG) console.log(handler.LOG_SELF, "created offer, sending to", handler.LOG_PEER);
        rtc.setLocalDescription(offerDesc, function() {
          console.log("DONE")
        });
        handler._sendSignal(offerDesc);
      }, function(e) {
        console.warn(handler.LOG_SELF, "failed to create offer", e);
      });
    };
    rtc.onicecandidate = function(evt) {
      if (evt.candidate) handler._sendSignal({
        candidate: evt.candidate
      });
    };
    // debugging
    rtc.onicechange = function(evt) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "ICE change", rtc.iceGatheringState, rtc.iceConnectionState);
    };
    rtc.onstatechange = function(evt) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "State change", rtc.signalingState, rtc.readyState)
    };
  }

  PeerConnectionHandler.prototype._sendSignal = function(data) {
    if (!this.onsignal) throw Error("Need to send message but `onsignal` handler is not set.");
    this.onsignal(data);
  };

  PeerConnectionHandler.prototype.signal = function(data) {
    var handler = this,
      rtc = this._rtc;
    if (handler.DEBUG) console.log(this.LOG_SELF, "got data", data, "from", this.LOG_PEER);
    if (data.sdp) rtc.setRemoteDescription(new RTCSessionDescription(data), function() {
      var needsAnswer = (rtc.remoteDescription.type == 'offer');
      if (handler.DEBUG) console.log(handler.LOG_SELF, "set offer, now creating answer:", needsAnswer);
      if (needsAnswer) rtc.createAnswer(function(answerDesc) {
        if (handler.DEBUG) console.log(handler.LOG_SELF, "got anwer, sending back to", handler.LOG_PEER);
        rtc.setLocalDescription(answerDesc);
        handler._sendSignal(answerDesc);
      }, function(e) {
        console.warn(handler.LOG_SELF, "couldn't create answer", e);
      });
    }, function(e) {
      console.warn(handler.LOG_SELF, "couldn't set remote description", e)
    });
    else if (data.candidate) try {
      rtc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (e) {
      console.error("Couldn't add candidate", e);
    }
  };

  PeerConnectionHandler.prototype.send = function(data) {
    if (!this._channel || this._channel.readyState !== 'open') return this.DEBUG && console.log("dropping data, no open channel");
    this._channel.send(data);
  };

  PeerConnectionHandler.prototype._setupChannel = function(evt) {
    var handler = this,
      rtc = this._rtc;
    if (evt)
      if (handler.DEBUG) console.log(this.LOG_SELF, "received data channel", evt.channel.readyState);
    this._channel = (evt) ? evt.channel : rtc.createDataChannel('telehash');
    // NOTE: in Chrome (M32) `this._channel.binaryType === 'arraybuffer'` instead of blob
    this._channel.onopen = function(evt) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "DATA CHANNEL IS OPEN", handler._channel);
      if (handler.onconnection) handler.onconnection(handler._channel); // BOOM!
    };
    this._channel.onmessage = function(evt) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "received message!", evt);
      if (handler.onmessage) handler.onmessage(evt.data);
    };
    if (window.mozRTCPeerConnection) setTimeout(function() {
      rtc.onnegotiationneeded(); // FF doesn't trigger this for us like Chrome does
    }, 0);
    window.dbgChannel = this._channel;
  };


},{}],29:[function(require,module,exports){
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */

  var base64 = require('base64-js')
  var ieee754 = require('ieee754')

  exports.Buffer = Buffer
  exports.SlowBuffer = Buffer
  exports.INSPECT_MAX_BYTES = 50
  Buffer.poolSize = 8192

  /**
   * If `Buffer._useTypedArrays`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (compatible down to IE6)
   */
  Buffer._useTypedArrays = (function () {
    // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
    // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
    // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
    // because we need to be able to add all the node Buffer API methods. This is an issue
    // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
    try {
      var buf = new ArrayBuffer(0)
      var arr = new Uint8Array(buf)
      arr.foo = function () { return 42 }
      return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
    } catch (e) {
      return false
    }
  })()

  /**
   * Class: Buffer
   * =============
   *
   * The Buffer constructor returns instances of `Uint8Array` that are augmented
   * with function properties for all the node `Buffer` API functions. We use
   * `Uint8Array` so that square bracket notation works as expected -- it returns
   * a single octet.
   *
   * By augmenting the instances, we can avoid modifying the `Uint8Array`
   * prototype.
   */
  function Buffer (subject, encoding, noZero) {
    if (!(this instanceof Buffer))
      return new Buffer(subject, encoding, noZero)

    var type = typeof subject

    if (encoding === 'base64' && type === 'string') {
      subject = base64clean(subject)
    }

    // Find the length
    var length
    if (type === 'number')
      length = coerce(subject)
    else if (type === 'string')
      length = Buffer.byteLength(subject, encoding)
    else if (type === 'object')
      length = coerce(subject.length) // assume that object is array-like
    else
      throw new Error('First argument needs to be a number, array or string.')

    var buf
    if (Buffer._useTypedArrays) {
      // Preferred: Return an augmented `Uint8Array` instance for best performance
      buf = Buffer._augment(new Uint8Array(length))
    } else {
      // Fallback: Return THIS instance of Buffer (created by `new`)
      buf = this
      buf.length = length
      buf._isBuffer = true
    }

    var i
    if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
      // Speed optimization -- use set if we're copying from a typed array
      buf._set(subject)
    } else if (isArrayish(subject)) {
      // Treat array-ish objects as a byte array
      if (Buffer.isBuffer(subject)) {
        for (i = 0; i < length; i++)
          buf[i] = subject.readUInt8(i)
      } else {
        for (i = 0; i < length; i++)
          buf[i] = ((subject[i] % 256) + 256) % 256
      }
    } else if (type === 'string') {
      buf.write(subject, 0, encoding)
    } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
      for (i = 0; i < length; i++) {
        buf[i] = 0
      }
    }

    return buf
  }

// STATIC METHODS
// ==============

  Buffer.isEncoding = function (encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'binary':
      case 'base64':
      case 'raw':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true
      default:
        return false
    }
  }

  Buffer.isBuffer = function (b) {
    return !!(b !== null && b !== undefined && b._isBuffer)
  }

  Buffer.byteLength = function (str, encoding) {
    var ret
    str = str.toString()
    switch (encoding || 'utf8') {
      case 'hex':
        ret = str.length / 2
        break
      case 'utf8':
      case 'utf-8':
        ret = utf8ToBytes(str).length
        break
      case 'ascii':
      case 'binary':
      case 'raw':
        ret = str.length
        break
      case 'base64':
        ret = base64ToBytes(str).length
        break
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        ret = str.length * 2
        break
      default:
        throw new Error('Unknown encoding')
    }
    return ret
  }

  Buffer.concat = function (list, totalLength) {
    assert(isArray(list), 'Usage: Buffer.concat(list[, length])')

    if (list.length === 0) {
      return new Buffer(0)
    } else if (list.length === 1) {
      return list[0]
    }

    var i
    if (totalLength === undefined) {
      totalLength = 0
      for (i = 0; i < list.length; i++) {
        totalLength += list[i].length
      }
    }

    var buf = new Buffer(totalLength)
    var pos = 0
    for (i = 0; i < list.length; i++) {
      var item = list[i]
      item.copy(buf, pos)
      pos += item.length
    }
    return buf
  }

  Buffer.compare = function (a, b) {
    assert(Buffer.isBuffer(a) && Buffer.isBuffer(b), 'Arguments must be Buffers')
    var x = a.length
    var y = b.length
    for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
    if (i !== len) {
      x = a[i]
      y = b[i]
    }
    if (x < y) {
      return -1
    }
    if (y < x) {
      return 1
    }
    return 0
  }

// BUFFER INSTANCE METHODS
// =======================

  function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0
    var remaining = buf.length - offset
    if (!length) {
      length = remaining
    } else {
      length = Number(length)
      if (length > remaining) {
        length = remaining
      }
    }

    // must be an even number of digits
    var strLen = string.length
    assert(strLen % 2 === 0, 'Invalid hex string')

    if (length > strLen / 2) {
      length = strLen / 2
    }
    for (var i = 0; i < length; i++) {
      var byte = parseInt(string.substr(i * 2, 2), 16)
      assert(!isNaN(byte), 'Invalid hex string')
      buf[offset + i] = byte
    }
    return i
  }

  function utf8Write (buf, string, offset, length) {
    var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
    return charsWritten
  }

  function asciiWrite (buf, string, offset, length) {
    var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
    return charsWritten
  }

  function binaryWrite (buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length)
  }

  function base64Write (buf, string, offset, length) {
    var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
    return charsWritten
  }

  function utf16leWrite (buf, string, offset, length) {
    var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
    return charsWritten
  }

  Buffer.prototype.write = function (string, offset, length, encoding) {
    // Support both (string, offset, length, encoding)
    // and the legacy (string, encoding, offset, length)
    if (isFinite(offset)) {
      if (!isFinite(length)) {
        encoding = length
        length = undefined
      }
    } else {  // legacy
      var swap = encoding
      encoding = offset
      offset = length
      length = swap
    }

    offset = Number(offset) || 0
    var remaining = this.length - offset
    if (!length) {
      length = remaining
    } else {
      length = Number(length)
      if (length > remaining) {
        length = remaining
      }
    }
    encoding = String(encoding || 'utf8').toLowerCase()

    var ret
    switch (encoding) {
      case 'hex':
        ret = hexWrite(this, string, offset, length)
        break
      case 'utf8':
      case 'utf-8':
        ret = utf8Write(this, string, offset, length)
        break
      case 'ascii':
        ret = asciiWrite(this, string, offset, length)
        break
      case 'binary':
        ret = binaryWrite(this, string, offset, length)
        break
      case 'base64':
        ret = base64Write(this, string, offset, length)
        break
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        ret = utf16leWrite(this, string, offset, length)
        break
      default:
        throw new Error('Unknown encoding')
    }
    return ret
  }

  Buffer.prototype.toString = function (encoding, start, end) {
    var self = this

    encoding = String(encoding || 'utf8').toLowerCase()
    start = Number(start) || 0
    end = (end === undefined) ? self.length : Number(end)

    // Fastpath empty strings
    if (end === start)
      return ''

    var ret
    switch (encoding) {
      case 'hex':
        ret = hexSlice(self, start, end)
        break
      case 'utf8':
      case 'utf-8':
        ret = utf8Slice(self, start, end)
        break
      case 'ascii':
        ret = asciiSlice(self, start, end)
        break
      case 'binary':
        ret = binarySlice(self, start, end)
        break
      case 'base64':
        ret = base64Slice(self, start, end)
        break
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        ret = utf16leSlice(self, start, end)
        break
      default:
        throw new Error('Unknown encoding')
    }
    return ret
  }

  Buffer.prototype.toJSON = function () {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  }

  Buffer.prototype.equals = function (b) {
    assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
    return Buffer.compare(this, b) === 0
  }

  Buffer.prototype.compare = function (b) {
    assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
    return Buffer.compare(this, b)
  }

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function (target, target_start, start, end) {
    var source = this

    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (!target_start) target_start = 0

    // Copy 0 bytes; we're done
    if (end === start) return
    if (target.length === 0 || source.length === 0) return

    // Fatal error conditions
    assert(end >= start, 'sourceEnd < sourceStart')
    assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
    assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
    assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

    // Are we oob?
    if (end > this.length)
      end = this.length
    if (target.length - target_start < end - start)
      end = target.length - target_start + start

    var len = end - start

    if (len < 100 || !Buffer._useTypedArrays) {
      for (var i = 0; i < len; i++) {
        target[i + target_start] = this[i + start]
      }
    } else {
      target._set(this.subarray(start, start + len), target_start)
    }
  }

  function base64Slice (buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf)
    } else {
      return base64.fromByteArray(buf.slice(start, end))
    }
  }

  function utf8Slice (buf, start, end) {
    var res = ''
    var tmp = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; i++) {
      if (buf[i] <= 0x7F) {
        res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
        tmp = ''
      } else {
        tmp += '%' + buf[i].toString(16)
      }
    }

    return res + decodeUtf8Char(tmp)
  }

  function asciiSlice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i])
    }
    return ret
  }

  function binarySlice (buf, start, end) {
    return asciiSlice(buf, start, end)
  }

  function hexSlice (buf, start, end) {
    var len = buf.length

    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len

    var out = ''
    for (var i = start; i < end; i++) {
      out += toHex(buf[i])
    }
    return out
  }

  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
    }
    return res
  }

  Buffer.prototype.slice = function (start, end) {
    var len = this.length
    start = clamp(start, len, 0)
    end = clamp(end, len, len)

    if (Buffer._useTypedArrays) {
      return Buffer._augment(this.subarray(start, end))
    } else {
      var sliceLen = end - start
      var newBuf = new Buffer(sliceLen, undefined, true)
      for (var i = 0; i < sliceLen; i++) {
        newBuf[i] = this[i + start]
      }
      return newBuf
    }
  }

// `get` will be removed in Node 0.13+
  Buffer.prototype.get = function (offset) {
    console.log('.get() is deprecated. Access using array indexes instead.')
    return this.readUInt8(offset)
  }

// `set` will be removed in Node 0.13+
  Buffer.prototype.set = function (v, offset) {
    console.log('.set() is deprecated. Access using array indexes instead.')
    return this.writeUInt8(v, offset)
  }

  Buffer.prototype.readUInt8 = function (offset, noAssert) {
    if (!noAssert) {
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset < this.length, 'Trying to read beyond buffer length')
    }

    if (offset >= this.length)
      return

    return this[offset]
  }

  function readUInt16 (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
    }

    var len = buf.length
    if (offset >= len)
      return

    var val
    if (littleEndian) {
      val = buf[offset]
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
    } else {
      val = buf[offset] << 8
      if (offset + 1 < len)
        val |= buf[offset + 1]
    }
    return val
  }

  Buffer.prototype.readUInt16LE = function (offset, noAssert) {
    return readUInt16(this, offset, true, noAssert)
  }

  Buffer.prototype.readUInt16BE = function (offset, noAssert) {
    return readUInt16(this, offset, false, noAssert)
  }

  function readUInt32 (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
    }

    var len = buf.length
    if (offset >= len)
      return

    var val
    if (littleEndian) {
      if (offset + 2 < len)
        val = buf[offset + 2] << 16
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
      val |= buf[offset]
      if (offset + 3 < len)
        val = val + (buf[offset + 3] << 24 >>> 0)
    } else {
      if (offset + 1 < len)
        val = buf[offset + 1] << 16
      if (offset + 2 < len)
        val |= buf[offset + 2] << 8
      if (offset + 3 < len)
        val |= buf[offset + 3]
      val = val + (buf[offset] << 24 >>> 0)
    }
    return val
  }

  Buffer.prototype.readUInt32LE = function (offset, noAssert) {
    return readUInt32(this, offset, true, noAssert)
  }

  Buffer.prototype.readUInt32BE = function (offset, noAssert) {
    return readUInt32(this, offset, false, noAssert)
  }

  Buffer.prototype.readInt8 = function (offset, noAssert) {
    if (!noAssert) {
      assert(offset !== undefined && offset !== null,
        'missing offset')
      assert(offset < this.length, 'Trying to read beyond buffer length')
    }

    if (offset >= this.length)
      return

    var neg = this[offset] & 0x80
    if (neg)
      return (0xff - this[offset] + 1) * -1
    else
      return this[offset]
  }

  function readInt16 (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
    }

    var len = buf.length
    if (offset >= len)
      return

    var val = readUInt16(buf, offset, littleEndian, true)
    var neg = val & 0x8000
    if (neg)
      return (0xffff - val + 1) * -1
    else
      return val
  }

  Buffer.prototype.readInt16LE = function (offset, noAssert) {
    return readInt16(this, offset, true, noAssert)
  }

  Buffer.prototype.readInt16BE = function (offset, noAssert) {
    return readInt16(this, offset, false, noAssert)
  }

  function readInt32 (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
    }

    var len = buf.length
    if (offset >= len)
      return

    var val = readUInt32(buf, offset, littleEndian, true)
    var neg = val & 0x80000000
    if (neg)
      return (0xffffffff - val + 1) * -1
    else
      return val
  }

  Buffer.prototype.readInt32LE = function (offset, noAssert) {
    return readInt32(this, offset, true, noAssert)
  }

  Buffer.prototype.readInt32BE = function (offset, noAssert) {
    return readInt32(this, offset, false, noAssert)
  }

  function readFloat (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
    }

    return ieee754.read(buf, offset, littleEndian, 23, 4)
  }

  Buffer.prototype.readFloatLE = function (offset, noAssert) {
    return readFloat(this, offset, true, noAssert)
  }

  Buffer.prototype.readFloatBE = function (offset, noAssert) {
    return readFloat(this, offset, false, noAssert)
  }

  function readDouble (buf, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
    }

    return ieee754.read(buf, offset, littleEndian, 52, 8)
  }

  Buffer.prototype.readDoubleLE = function (offset, noAssert) {
    return readDouble(this, offset, true, noAssert)
  }

  Buffer.prototype.readDoubleBE = function (offset, noAssert) {
    return readDouble(this, offset, false, noAssert)
  }

  Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset < this.length, 'trying to write beyond buffer length')
      verifuint(value, 0xff)
    }

    if (offset >= this.length) return

    this[offset] = value
    return offset + 1
  }

  function writeUInt16 (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
      verifuint(value, 0xffff)
    }

    var len = buf.length
    if (offset >= len)
      return

    for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
      buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        (littleEndian ? i : 1 - i) * 8
    }
    return offset + 2
  }

  Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
    return writeUInt16(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
    return writeUInt16(this, value, offset, false, noAssert)
  }

  function writeUInt32 (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
      verifuint(value, 0xffffffff)
    }

    var len = buf.length
    if (offset >= len)
      return

    for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
      buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
    }
    return offset + 4
  }

  Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
    return writeUInt32(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
    return writeUInt32(this, value, offset, false, noAssert)
  }

  Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset < this.length, 'Trying to write beyond buffer length')
      verifsint(value, 0x7f, -0x80)
    }

    if (offset >= this.length)
      return

    if (value >= 0)
      this.writeUInt8(value, offset, noAssert)
    else
      this.writeUInt8(0xff + value + 1, offset, noAssert)
    return offset + 1
  }

  function writeInt16 (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
      verifsint(value, 0x7fff, -0x8000)
    }

    var len = buf.length
    if (offset >= len)
      return

    if (value >= 0)
      writeUInt16(buf, value, offset, littleEndian, noAssert)
    else
      writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
    return offset + 2
  }

  Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
    return writeInt16(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
    return writeInt16(this, value, offset, false, noAssert)
  }

  function writeInt32 (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
      verifsint(value, 0x7fffffff, -0x80000000)
    }

    var len = buf.length
    if (offset >= len)
      return

    if (value >= 0)
      writeUInt32(buf, value, offset, littleEndian, noAssert)
    else
      writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
    return offset + 4
  }

  Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
    return writeInt32(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
    return writeInt32(this, value, offset, false, noAssert)
  }

  function writeFloat (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
      verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
    }

    var len = buf.length
    if (offset >= len)
      return

    ieee754.write(buf, value, offset, littleEndian, 23, 4)
    return offset + 4
  }

  Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert)
  }

  function writeDouble (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      assert(value !== undefined && value !== null, 'missing value')
      assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
      assert(offset !== undefined && offset !== null, 'missing offset')
      assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
      verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
    }

    var len = buf.length
    if (offset >= len)
      return

    ieee754.write(buf, value, offset, littleEndian, 52, 8)
    return offset + 8
  }

  Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert)
  }

  Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert)
  }

// fill(value, start=0, end=buffer.length)
  Buffer.prototype.fill = function (value, start, end) {
    if (!value) value = 0
    if (!start) start = 0
    if (!end) end = this.length

    assert(end >= start, 'end < start')

    // Fill 0 bytes; we're done
    if (end === start) return
    if (this.length === 0) return

    assert(start >= 0 && start < this.length, 'start out of bounds')
    assert(end >= 0 && end <= this.length, 'end out of bounds')

    var i
    if (typeof value === 'number') {
      for (i = start; i < end; i++) {
        this[i] = value
      }
    } else {
      var bytes = utf8ToBytes(value.toString())
      var len = bytes.length
      for (i = start; i < end; i++) {
        this[i] = bytes[i % len]
      }
    }

    return this
  }

  Buffer.prototype.inspect = function () {
    var out = []
    var len = this.length
    for (var i = 0; i < len; i++) {
      out[i] = toHex(this[i])
      if (i === exports.INSPECT_MAX_BYTES) {
        out[i + 1] = '...'
        break
      }
    }
    return '<Buffer ' + out.join(' ') + '>'
  }

  /**
   * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
   * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
   */
  Buffer.prototype.toArrayBuffer = function () {
    if (typeof Uint8Array !== 'undefined') {
      if (Buffer._useTypedArrays) {
        return (new Buffer(this)).buffer
      } else {
        var buf = new Uint8Array(this.length)
        for (var i = 0, len = buf.length; i < len; i += 1) {
          buf[i] = this[i]
        }
        return buf.buffer
      }
    } else {
      throw new Error('Buffer.toArrayBuffer not supported in this browser')
    }
  }

// HELPER FUNCTIONS
// ================

  var BP = Buffer.prototype

  /**
   * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
   */
  Buffer._augment = function (arr) {
    arr._isBuffer = true

    // save reference to original Uint8Array get/set methods before overwriting
    arr._get = arr.get
    arr._set = arr.set

    // deprecated, will be removed in node 0.13+
    arr.get = BP.get
    arr.set = BP.set

    arr.write = BP.write
    arr.toString = BP.toString
    arr.toLocaleString = BP.toString
    arr.toJSON = BP.toJSON
    arr.equals = BP.equals
    arr.compare = BP.compare
    arr.copy = BP.copy
    arr.slice = BP.slice
    arr.readUInt8 = BP.readUInt8
    arr.readUInt16LE = BP.readUInt16LE
    arr.readUInt16BE = BP.readUInt16BE
    arr.readUInt32LE = BP.readUInt32LE
    arr.readUInt32BE = BP.readUInt32BE
    arr.readInt8 = BP.readInt8
    arr.readInt16LE = BP.readInt16LE
    arr.readInt16BE = BP.readInt16BE
    arr.readInt32LE = BP.readInt32LE
    arr.readInt32BE = BP.readInt32BE
    arr.readFloatLE = BP.readFloatLE
    arr.readFloatBE = BP.readFloatBE
    arr.readDoubleLE = BP.readDoubleLE
    arr.readDoubleBE = BP.readDoubleBE
    arr.writeUInt8 = BP.writeUInt8
    arr.writeUInt16LE = BP.writeUInt16LE
    arr.writeUInt16BE = BP.writeUInt16BE
    arr.writeUInt32LE = BP.writeUInt32LE
    arr.writeUInt32BE = BP.writeUInt32BE
    arr.writeInt8 = BP.writeInt8
    arr.writeInt16LE = BP.writeInt16LE
    arr.writeInt16BE = BP.writeInt16BE
    arr.writeInt32LE = BP.writeInt32LE
    arr.writeInt32BE = BP.writeInt32BE
    arr.writeFloatLE = BP.writeFloatLE
    arr.writeFloatBE = BP.writeFloatBE
    arr.writeDoubleLE = BP.writeDoubleLE
    arr.writeDoubleBE = BP.writeDoubleBE
    arr.fill = BP.fill
    arr.inspect = BP.inspect
    arr.toArrayBuffer = BP.toArrayBuffer

    return arr
  }

  var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

  function base64clean (str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '='
    }
    return str
  }

  function stringtrim (str) {
    if (str.trim) return str.trim()
    return str.replace(/^\s+|\s+$/g, '')
  }

// slice(start, end)
  function clamp (index, len, defaultValue) {
    if (typeof index !== 'number') return defaultValue
    index = ~~index;  // Coerce to integer.
    if (index >= len) return len
    if (index >= 0) return index
    index += len
    if (index >= 0) return index
    return 0
  }

  function coerce (length) {
    // Coerce length to a number (possibly NaN), round up
    // in case it's fractional (e.g. 123.456) then do a
    // double negate to coerce a NaN to 0. Easy, right?
    length = ~~Math.ceil(+length)
    return length < 0 ? 0 : length
  }

  function isArray (subject) {
    return (Array.isArray || function (subject) {
      return Object.prototype.toString.call(subject) === '[object Array]'
    })(subject)
  }

  function isArrayish (subject) {
    return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
  }

  function toHex (n) {
    if (n < 16) return '0' + n.toString(16)
    return n.toString(16)
  }

  function utf8ToBytes (str) {
    var byteArray = []
    for (var i = 0; i < str.length; i++) {
      var b = str.charCodeAt(i)
      if (b <= 0x7F) {
        byteArray.push(b)
      } else {
        var start = i
        if (b >= 0xD800 && b <= 0xDFFF) i++
        var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
        for (var j = 0; j < h.length; j++) {
          byteArray.push(parseInt(h[j], 16))
        }
      }
    }
    return byteArray
  }

  function asciiToBytes (str) {
    var byteArray = []
    for (var i = 0; i < str.length; i++) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
  }

  function utf16leToBytes (str) {
    var c, hi, lo
    var byteArray = []
    for (var i = 0; i < str.length; i++) {
      c = str.charCodeAt(i)
      hi = c >> 8
      lo = c % 256
      byteArray.push(lo)
      byteArray.push(hi)
    }

    return byteArray
  }

  function base64ToBytes (str) {
    return base64.toByteArray(str)
  }

  function blitBuffer (src, dst, offset, length) {
    for (var i = 0; i < length; i++) {
      if ((i + offset >= dst.length) || (i >= src.length))
        break
      dst[i + offset] = src[i]
    }
    return i
  }

  function decodeUtf8Char (str) {
    try {
      return decodeURIComponent(str)
    } catch (err) {
      return String.fromCharCode(0xFFFD) // UTF 8 invalid char
    }
  }

  /*
   * We have to make sure that the value is a valid integer. This means that it
   * is non-negative. It has no fractional component and that it does not
   * exceed the maximum allowed value.
   */
  function verifuint (value, max) {
    assert(typeof value === 'number', 'cannot write a non-number as a number')
    assert(value >= 0, 'specified a negative value for writing an unsigned value')
    assert(value <= max, 'value is larger than maximum value for type')
    assert(Math.floor(value) === value, 'value has a fractional component')
  }

  function verifsint (value, max, min) {
    assert(typeof value === 'number', 'cannot write a non-number as a number')
    assert(value <= max, 'value larger than maximum allowed value')
    assert(value >= min, 'value smaller than minimum allowed value')
    assert(Math.floor(value) === value, 'value has a fractional component')
  }

  function verifIEEE754 (value, max, min) {
    assert(typeof value === 'number', 'cannot write a non-number as a number')
    assert(value <= max, 'value larger than maximum allowed value')
    assert(value >= min, 'value smaller than minimum allowed value')
  }

  function assert (test, message) {
    if (!test) throw new Error(message || 'Failed assertion')
  }

},{"base64-js":30,"ieee754":31}],30:[function(require,module,exports){
  var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  ;(function (exports) {
    'use strict';

    var Arr = (typeof Uint8Array !== 'undefined')
      ? Uint8Array
      : Array

    var PLUS   = '+'.charCodeAt(0)
    var SLASH  = '/'.charCodeAt(0)
    var NUMBER = '0'.charCodeAt(0)
    var LOWER  = 'a'.charCodeAt(0)
    var UPPER  = 'A'.charCodeAt(0)

    function decode (elt) {
      var code = elt.charCodeAt(0)
      if (code === PLUS)
        return 62 // '+'
      if (code === SLASH)
        return 63 // '/'
      if (code < NUMBER)
        return -1 //no match
      if (code < NUMBER + 10)
        return code - NUMBER + 26 + 26
      if (code < UPPER + 26)
        return code - UPPER
      if (code < LOWER + 26)
        return code - LOWER + 26
    }

    function b64ToByteArray (b64) {
      var i, j, l, tmp, placeHolders, arr

      if (b64.length % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      var len = b64.length
      placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

      // base64 is 4/3 + up to two characters of the original data
      arr = new Arr(b64.length * 3 / 4 - placeHolders)

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? b64.length - 4 : b64.length

      var L = 0

      function push (v) {
        arr[L++] = v
      }

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
        push((tmp & 0xFF0000) >> 16)
        push((tmp & 0xFF00) >> 8)
        push(tmp & 0xFF)
      }

      if (placeHolders === 2) {
        tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
        push(tmp & 0xFF)
      } else if (placeHolders === 1) {
        tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
        push((tmp >> 8) & 0xFF)
        push(tmp & 0xFF)
      }

      return arr
    }

    function uint8ToBase64 (uint8) {
      var i,
        extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
        output = "",
        temp, length

      function encode (num) {
        return lookup.charAt(num)
      }

      function tripletToBase64 (num) {
        return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
      }

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
        output += tripletToBase64(temp)
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      switch (extraBytes) {
        case 1:
          temp = uint8[uint8.length - 1]
          output += encode(temp >> 2)
          output += encode((temp << 4) & 0x3F)
          output += '=='
          break
        case 2:
          temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
          output += encode(temp >> 10)
          output += encode((temp >> 4) & 0x3F)
          output += encode((temp << 2) & 0x3F)
          output += '='
          break
      }

      return output
    }

    exports.toByteArray = b64ToByteArray
    exports.fromByteArray = uint8ToBase64
  }(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],31:[function(require,module,exports){
  exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity);
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };

  exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

    buffer[offset + i - d] |= s * 128;
  };

},{}],32:[function(require,module,exports){
  (function (Buffer){
    var createHash = require('sha.js')

    var md5 = toConstructor(require('./md5'))
    var rmd160 = toConstructor(require('ripemd160'))

    function toConstructor (fn) {
      return function () {
        var buffers = []
        var m= {
          update: function (data, enc) {
            if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
            buffers.push(data)
            return this
          },
          digest: function (enc) {
            var buf = Buffer.concat(buffers)
            var r = fn(buf)
            buffers = null
            return enc ? r.toString(enc) : r
          }
        }
        return m
      }
    }

    module.exports = function (alg) {
      if('md5' === alg) return new md5()
      if('rmd160' === alg) return new rmd160()
      return createHash(alg)
    }

  }).call(this,require("buffer").Buffer)
},{"./md5":36,"buffer":29,"ripemd160":37,"sha.js":39}],33:[function(require,module,exports){
  (function (Buffer){
    var createHash = require('./create-hash')

    var blocksize = 64
    var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)

    module.exports = Hmac

    function Hmac (alg, key) {
      if(!(this instanceof Hmac)) return new Hmac(alg, key)
      this._opad = opad
      this._alg = alg

      key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key

      if(key.length > blocksize) {
        key = createHash(alg).update(key).digest()
      } else if(key.length < blocksize) {
        key = Buffer.concat([key, zeroBuffer], blocksize)
      }

      var ipad = this._ipad = new Buffer(blocksize)
      var opad = this._opad = new Buffer(blocksize)

      for(var i = 0; i < blocksize; i++) {
        ipad[i] = key[i] ^ 0x36
        opad[i] = key[i] ^ 0x5C
      }

      this._hash = createHash(alg).update(ipad)
    }

    Hmac.prototype.update = function (data, enc) {
      this._hash.update(data, enc)
      return this
    }

    Hmac.prototype.digest = function (enc) {
      var h = this._hash.digest()
      return createHash(this._alg).update(this._opad).update(h).digest(enc)
    }


  }).call(this,require("buffer").Buffer)
},{"./create-hash":32,"buffer":29}],34:[function(require,module,exports){
  (function (Buffer){
    var intSize = 4;
    var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
    var chrsz = 8;

    function toArray(buf, bigEndian) {
      if ((buf.length % intSize) !== 0) {
        var len = buf.length + (intSize - (buf.length % intSize));
        buf = Buffer.concat([buf, zeroBuffer], len);
      }

      var arr = [];
      var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
      for (var i = 0; i < buf.length; i += intSize) {
        arr.push(fn.call(buf, i));
      }
      return arr;
    }

    function toBuffer(arr, size, bigEndian) {
      var buf = new Buffer(size);
      var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
      for (var i = 0; i < arr.length; i++) {
        fn.call(buf, arr[i], i * 4, true);
      }
      return buf;
    }

    function hash(buf, fn, hashSize, bigEndian) {
      if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
      var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
      return toBuffer(arr, hashSize, bigEndian);
    }

    module.exports = { hash: hash };

  }).call(this,require("buffer").Buffer)
},{"buffer":29}],35:[function(require,module,exports){
  (function (Buffer){
    var rng = require('./rng')

    function error () {
      var m = [].slice.call(arguments).join(' ')
      throw new Error([
        m,
        'we accept pull requests',
        'http://github.com/dominictarr/crypto-browserify'
      ].join('\n'))
    }

    exports.createHash = require('./create-hash')

    exports.createHmac = require('./create-hmac')

    exports.randomBytes = function(size, callback) {
      if (callback && callback.call) {
        try {
          callback.call(this, undefined, new Buffer(rng(size)))
        } catch (err) { callback(err) }
      } else {
        return new Buffer(rng(size))
      }
    }

    function each(a, f) {
      for(var i in a)
        f(a[i], i)
    }

    exports.getHashes = function () {
      return ['sha1', 'sha256', 'md5', 'rmd160']

    }

    var p = require('./pbkdf2')(exports.createHmac)
    exports.pbkdf2 = p.pbkdf2
    exports.pbkdf2Sync = p.pbkdf2Sync


// the least I can do is make error messages for the rest of the node.js/crypto api.
    each(['createCredentials'
      , 'createCipher'
      , 'createCipheriv'
      , 'createDecipher'
      , 'createDecipheriv'
      , 'createSign'
      , 'createVerify'
      , 'createDiffieHellman'
    ], function (name) {
      exports[name] = function () {
        error('sorry,', name, 'is not implemented yet')
      }
    })

  }).call(this,require("buffer").Buffer)
},{"./create-hash":32,"./create-hmac":33,"./pbkdf2":43,"./rng":44,"buffer":29}],36:[function(require,module,exports){
  /*
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */

  var helpers = require('./helpers');

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length
   */
  function core_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  module.exports = function md5(buf) {
    return helpers.hash(buf, core_md5, 16);
  };

},{"./helpers":34}],37:[function(require,module,exports){
  (function (Buffer){

    module.exports = ripemd160



    /*
     CryptoJS v3.1.2
     code.google.com/p/crypto-js
     (c) 2009-2013 by Jeff Mott. All rights reserved.
     code.google.com/p/crypto-js/wiki/License
     */
    /** @preserve
     (c) 2012 by Cédric Mesnil. All rights reserved.

     Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

     - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
     - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

// Constants table
    var zl = [
      0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
      7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
      3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
      1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
      4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
    var zr = [
      5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
      6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
      15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
      8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
      12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
    var sl = [
      11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
      7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
      11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
      9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
    var sr = [
      8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
      9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
      9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
      15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
      8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

    var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
    var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

    var bytesToWords = function (bytes) {
      var words = [];
      for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      }
      return words;
    };

    var wordsToBytes = function (words) {
      var bytes = [];
      for (var b = 0; b < words.length * 32; b += 8) {
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      }
      return bytes;
    };

    var processBlock = function (H, M, offset) {

      // Swap endian
      for (var i = 0; i < 16; i++) {
        var offset_i = offset + i;
        var M_offset_i = M[offset_i];

        // Swap
        M[offset_i] = (
          (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
          (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
          );
      }

      // Working variables
      var al, bl, cl, dl, el;
      var ar, br, cr, dr, er;

      ar = al = H[0];
      br = bl = H[1];
      cr = cl = H[2];
      dr = dl = H[3];
      er = el = H[4];
      // Computation
      var t;
      for (var i = 0; i < 80; i += 1) {
        t = (al +  M[offset+zl[i]])|0;
        if (i<16){
          t +=  f1(bl,cl,dl) + hl[0];
        } else if (i<32) {
          t +=  f2(bl,cl,dl) + hl[1];
        } else if (i<48) {
          t +=  f3(bl,cl,dl) + hl[2];
        } else if (i<64) {
          t +=  f4(bl,cl,dl) + hl[3];
        } else {// if (i<80) {
          t +=  f5(bl,cl,dl) + hl[4];
        }
        t = t|0;
        t =  rotl(t,sl[i]);
        t = (t+el)|0;
        al = el;
        el = dl;
        dl = rotl(cl, 10);
        cl = bl;
        bl = t;

        t = (ar + M[offset+zr[i]])|0;
        if (i<16){
          t +=  f5(br,cr,dr) + hr[0];
        } else if (i<32) {
          t +=  f4(br,cr,dr) + hr[1];
        } else if (i<48) {
          t +=  f3(br,cr,dr) + hr[2];
        } else if (i<64) {
          t +=  f2(br,cr,dr) + hr[3];
        } else {// if (i<80) {
          t +=  f1(br,cr,dr) + hr[4];
        }
        t = t|0;
        t =  rotl(t,sr[i]) ;
        t = (t+er)|0;
        ar = er;
        er = dr;
        dr = rotl(cr, 10);
        cr = br;
        br = t;
      }
      // Intermediate hash value
      t    = (H[1] + cl + dr)|0;
      H[1] = (H[2] + dl + er)|0;
      H[2] = (H[3] + el + ar)|0;
      H[3] = (H[4] + al + br)|0;
      H[4] = (H[0] + bl + cr)|0;
      H[0] =  t;
    };

    function f1(x, y, z) {
      return ((x) ^ (y) ^ (z));
    }

    function f2(x, y, z) {
      return (((x)&(y)) | ((~x)&(z)));
    }

    function f3(x, y, z) {
      return (((x) | (~(y))) ^ (z));
    }

    function f4(x, y, z) {
      return (((x) & (z)) | ((y)&(~(z))));
    }

    function f5(x, y, z) {
      return ((x) ^ ((y) |(~(z))));
    }

    function rotl(x,n) {
      return (x<<n) | (x>>>(32-n));
    }

    function ripemd160(message) {
      var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

      if (typeof message == 'string')
        message = new Buffer(message, 'utf8');

      var m = bytesToWords(message);

      var nBitsLeft = message.length * 8;
      var nBitsTotal = message.length * 8;

      // Add padding
      m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
      m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
        (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
        (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
        );

      for (var i=0 ; i<m.length; i += 16) {
        processBlock(H, m, i);
      }

      // Swap endian
      for (var i = 0; i < 5; i++) {
        // Shortcut
        var H_i = H[i];

        // Swap
        H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
      }

      var digestbytes = wordsToBytes(H);
      return new Buffer(digestbytes);
    }



  }).call(this,require("buffer").Buffer)
},{"buffer":29}],38:[function(require,module,exports){
  var u = require('./util')
  var write = u.write
  var fill = u.zeroFill

  module.exports = function (Buffer) {

    //prototype class for hash functions
    function Hash (blockSize, finalSize) {
      this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
      this._finalSize = finalSize
      this._blockSize = blockSize
      this._len = 0
      this._s = 0
    }

    Hash.prototype.init = function () {
      this._s = 0
      this._len = 0
    }

    function lengthOf(data, enc) {
      if(enc == null)     return data.byteLength || data.length
      if(enc == 'ascii' || enc == 'binary')  return data.length
      if(enc == 'hex')    return data.length/2
      if(enc == 'base64') return data.length/3
    }

    Hash.prototype.update = function (data, enc) {
      var bl = this._blockSize

      //I'd rather do this with a streaming encoder, like the opposite of
      //http://nodejs.org/api/string_decoder.html
      var length
      if(!enc && 'string' === typeof data)
        enc = 'utf8'

      if(enc) {
        if(enc === 'utf-8')
          enc = 'utf8'

        if(enc === 'base64' || enc === 'utf8')
          data = new Buffer(data, enc), enc = null

        length = lengthOf(data, enc)
      } else
        length = data.byteLength || data.length

      var l = this._len += length
      var s = this._s = (this._s || 0)
      var f = 0
      var buffer = this._block
      while(s < l) {
        var t = Math.min(length, f + bl)
        write(buffer, data, enc, s%bl, f, t)
        var ch = (t - f);
        s += ch; f += ch

        if(!(s%bl))
          this._update(buffer)
      }
      this._s = s

      return this

    }

    Hash.prototype.digest = function (enc) {
      var bl = this._blockSize
      var fl = this._finalSize
      var len = this._len*8

      var x = this._block

      var bits = len % (bl*8)

      //add end marker, so that appending 0's creats a different hash.
      x[this._len % bl] = 0x80
      fill(this._block, this._len % bl + 1)

      if(bits >= fl*8) {
        this._update(this._block)
        u.zeroFill(this._block, 0)
      }

      //TODO: handle case where the bit length is > Math.pow(2, 29)
      x.writeInt32BE(len, fl + 4) //big endian

      var hash = this._update(this._block) || this._hash()
      if(enc == null) return hash
      return hash.toString(enc)
    }

    Hash.prototype._update = function () {
      throw new Error('_update must be implemented by subclass')
    }

    return Hash
  }

},{"./util":42}],39:[function(require,module,exports){
  var exports = module.exports = function (alg) {
    var Alg = exports[alg]
    if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
    return new Alg()
  }

  var Buffer = require('buffer').Buffer
  var Hash   = require('./hash')(Buffer)

  exports.sha =
    exports.sha1 = require('./sha1')(Buffer, Hash)
  exports.sha256 = require('./sha256')(Buffer, Hash)

},{"./hash":38,"./sha1":40,"./sha256":41,"buffer":29}],40:[function(require,module,exports){
  /*
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
   * in FIPS PUB 180-1
   * Version 2.1a Copyright Paul Johnston 2000 - 2002.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for details.
   */
  module.exports = function (Buffer, Hash) {

    var inherits = require('util').inherits

    inherits(Sha1, Hash)

    var A = 0|0
    var B = 4|0
    var C = 8|0
    var D = 12|0
    var E = 16|0

    var BE = false
    var LE = true

    var W = new Int32Array(80)

    var POOL = []

    function Sha1 () {
      if(POOL.length)
        return POOL.pop().init()

      if(!(this instanceof Sha1)) return new Sha1()
      this._w = W
      Hash.call(this, 16*4, 14*4)

      this._h = null
      this.init()
    }

    Sha1.prototype.init = function () {
      this._a = 0x67452301
      this._b = 0xefcdab89
      this._c = 0x98badcfe
      this._d = 0x10325476
      this._e = 0xc3d2e1f0

      Hash.prototype.init.call(this)
      return this
    }

    Sha1.prototype._POOL = POOL

    // assume that array is a Uint32Array with length=16,
    // and that if it is the last block, it already has the length and the 1 bit appended.


    var isDV = new Buffer(1) instanceof DataView
    function readInt32BE (X, i) {
      return isDV
        ? X.getInt32(i, false)
        : X.readInt32BE(i)
    }

    Sha1.prototype._update = function (array) {

      var X = this._block
      var h = this._h
      var a, b, c, d, e, _a, _b, _c, _d, _e

      a = _a = this._a
      b = _b = this._b
      c = _c = this._c
      d = _d = this._d
      e = _e = this._e

      var w = this._w

      for(var j = 0; j < 80; j++) {
        var W = w[j]
          = j < 16
          //? X.getInt32(j*4, false)
          //? readInt32BE(X, j*4) //*/ X.readInt32BE(j*4) //*/
          ? X.readInt32BE(j*4)
          : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

        var t =
          add(
            add(rol(a, 5), sha1_ft(j, b, c, d)),
            add(add(e, W), sha1_kt(j))
          );

        e = d
        d = c
        c = rol(b, 30)
        b = a
        a = t
      }

      this._a = add(a, _a)
      this._b = add(b, _b)
      this._c = add(c, _c)
      this._d = add(d, _d)
      this._e = add(e, _e)
    }

    Sha1.prototype._hash = function () {
      if(POOL.length < 100) POOL.push(this)
      var H = new Buffer(20)
      //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
      H.writeInt32BE(this._a|0, A)
      H.writeInt32BE(this._b|0, B)
      H.writeInt32BE(this._c|0, C)
      H.writeInt32BE(this._d|0, D)
      H.writeInt32BE(this._e|0, E)
      return H
    }

    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    function sha1_ft(t, b, c, d) {
      if(t < 20) return (b & c) | ((~b) & d);
      if(t < 40) return b ^ c ^ d;
      if(t < 60) return (b & c) | (b & d) | (c & d);
      return b ^ c ^ d;
    }

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
      return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
        (t < 60) ? -1894007588 : -899497514;
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     * //dominictarr: this is 10 years old, so maybe this can be dropped?)
     *
     */
    function add(x, y) {
      return (x + y ) | 0
      //lets see how this goes on testling.
      //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      //  return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function rol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }

    return Sha1
  }

},{"util":72}],41:[function(require,module,exports){

  /**
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
   * in FIPS 180-2
   * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   *
   */

  var inherits = require('util').inherits
  var BE       = false
  var LE       = true
  var u        = require('./util')

  module.exports = function (Buffer, Hash) {

    var K = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]

    inherits(Sha256, Hash)
    var W = new Array(64)
    var POOL = []
    function Sha256() {
      if(POOL.length) {
        //return POOL.shift().init()
      }
      //this._data = new Buffer(32)

      this.init()

      this._w = W //new Array(64)

      Hash.call(this, 16*4, 14*4)
    };

    Sha256.prototype.init = function () {

      this._a = 0x6a09e667|0
      this._b = 0xbb67ae85|0
      this._c = 0x3c6ef372|0
      this._d = 0xa54ff53a|0
      this._e = 0x510e527f|0
      this._f = 0x9b05688c|0
      this._g = 0x1f83d9ab|0
      this._h = 0x5be0cd19|0

      this._len = this._s = 0

      return this
    }

    var safe_add = function(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    function S (X, n) {
      return (X >>> n) | (X << (32 - n));
    }

    function R (X, n) {
      return (X >>> n);
    }

    function Ch (x, y, z) {
      return ((x & y) ^ ((~x) & z));
    }

    function Maj (x, y, z) {
      return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256 (x) {
      return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256 (x) {
      return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256 (x) {
      return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256 (x) {
      return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    Sha256.prototype._update = function(m) {
      var M = this._block
      var W = this._w
      var a, b, c, d, e, f, g, h
      var T1, T2

      a = this._a | 0
      b = this._b | 0
      c = this._c | 0
      d = this._d | 0
      e = this._e | 0
      f = this._f | 0
      g = this._g | 0
      h = this._h | 0

      for (var j = 0; j < 64; j++) {
        var w = W[j] = j < 16
          ? M.readInt32BE(j * 4)
          : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]

        T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w

        T2 = Sigma0256(a) + Maj(a, b, c);
        h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
      }

      this._a = (a + this._a) | 0
      this._b = (b + this._b) | 0
      this._c = (c + this._c) | 0
      this._d = (d + this._d) | 0
      this._e = (e + this._e) | 0
      this._f = (f + this._f) | 0
      this._g = (g + this._g) | 0
      this._h = (h + this._h) | 0

    };

    Sha256.prototype._hash = function () {
      if(POOL.length < 10)
        POOL.push(this)

      var H = new Buffer(32)

      H.writeInt32BE(this._a,  0)
      H.writeInt32BE(this._b,  4)
      H.writeInt32BE(this._c,  8)
      H.writeInt32BE(this._d, 12)
      H.writeInt32BE(this._e, 16)
      H.writeInt32BE(this._f, 20)
      H.writeInt32BE(this._g, 24)
      H.writeInt32BE(this._h, 28)

      return H
    }

    return Sha256

  }

},{"./util":42,"util":72}],42:[function(require,module,exports){
  exports.write = write
  exports.zeroFill = zeroFill

  exports.toString = toString

  function write (buffer, string, enc, start, from, to, LE) {
    var l = (to - from)
    if(enc === 'ascii' || enc === 'binary') {
      for( var i = 0; i < l; i++) {
        buffer[start + i] = string.charCodeAt(i + from)
      }
    }
    else if(enc == null) {
      for( var i = 0; i < l; i++) {
        buffer[start + i] = string[i + from]
      }
    }
    else if(enc === 'hex') {
      for(var i = 0; i < l; i++) {
        var j = from + i
        buffer[start + i] = parseInt(string[j*2] + string[(j*2)+1], 16)
      }
    }
    else if(enc === 'base64') {
      throw new Error('base64 encoding not yet supported')
    }
    else
      throw new Error(enc +' encoding not yet supported')
  }

//always fill to the end!
  function zeroFill(buf, from) {
    for(var i = from; i < buf.length; i++)
      buf[i] = 0
  }


},{}],43:[function(require,module,exports){
  (function (Buffer){
// JavaScript PBKDF2 Implementation
// Based on http://git.io/qsv2zw
// Licensed under LGPL v3
// Copyright (c) 2013 jduncanator

    var blocksize = 64
    var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)

    module.exports = function (createHmac, exports) {
      exports = exports || {}

      exports.pbkdf2 = function(password, salt, iterations, keylen, cb) {
        if('function' !== typeof cb)
          throw new Error('No callback provided to pbkdf2');
        setTimeout(function () {
          cb(null, exports.pbkdf2Sync(password, salt, iterations, keylen))
        })
      }

      exports.pbkdf2Sync = function(key, salt, iterations, keylen) {
        if('number' !== typeof iterations)
          throw new TypeError('Iterations not a number')
        if(iterations < 0)
          throw new TypeError('Bad iterations')
        if('number' !== typeof keylen)
          throw new TypeError('Key length not a number')
        if(keylen < 0)
          throw new TypeError('Bad key length')

        //stretch key to the correct length that hmac wants it,
        //otherwise this will happen every time hmac is called
        //twice per iteration.
        var key = !Buffer.isBuffer(key) ? new Buffer(key) : key

        if(key.length > blocksize) {
          key = createHash(alg).update(key).digest()
        } else if(key.length < blocksize) {
          key = Buffer.concat([key, zeroBuffer], blocksize)
        }

        var HMAC;
        var cplen, p = 0, i = 1, itmp = new Buffer(4), digtmp;
        var out = new Buffer(keylen);
        out.fill(0);
        while(keylen) {
          if(keylen > 20)
            cplen = 20;
          else
            cplen = keylen;

          /* We are unlikely to ever use more than 256 blocks (5120 bits!)
           * but just in case...
           */
          itmp[0] = (i >> 24) & 0xff;
          itmp[1] = (i >> 16) & 0xff;
          itmp[2] = (i >> 8) & 0xff;
          itmp[3] = i & 0xff;

          HMAC = createHmac('sha1', key);
          HMAC.update(salt)
          HMAC.update(itmp);
          digtmp = HMAC.digest();
          digtmp.copy(out, p, 0, cplen);

          for(var j = 1; j < iterations; j++) {
            HMAC = createHmac('sha1', key);
            HMAC.update(digtmp);
            digtmp = HMAC.digest();
            for(var k = 0; k < cplen; k++) {
              out[k] ^= digtmp[k];
            }
          }
          keylen -= cplen;
          i++;
          p += cplen;
        }

        return out;
      }

      return exports
    }

  }).call(this,require("buffer").Buffer)
},{"buffer":29}],44:[function(require,module,exports){
  (function (Buffer){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid


    (function() {
      var _global = this;

      var mathRNG, whatwgRNG;

      // NOTE: Math.random() does not guarantee "cryptographic quality"
      mathRNG = function(size) {
        var bytes = new Buffer(size);
        var r;

        for (var i = 0, r; i < size; i++) {
          if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
          bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return bytes;
      }

      if (_global.crypto && crypto.getRandomValues) {
        whatwgRNG = function(size) {
          var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
          crypto.getRandomValues(bytes);
          return bytes;
        }
      }

      module.exports = whatwgRNG || mathRNG;

    }())

  }).call(this,require("buffer").Buffer)
},{"buffer":29}],45:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  function EventEmitter() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  }
  module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function(n) {
    if (!isNumber(n) || n < 0 || isNaN(n))
      throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  EventEmitter.prototype.emit = function(type) {
    var er, handler, len, args, i, listeners;

    if (!this._events)
      this._events = {};

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          throw TypeError('Uncaught, unspecified "error" event.');
        }
        return false;
      }
    }

    handler = this._events[type];

    if (isUndefined(handler))
      return false;

    if (isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          len = arguments.length;
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      len = arguments.length;
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];

      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++)
        listeners[i].apply(this, args);
    }

    return true;
  };

  EventEmitter.prototype.addListener = function(type, listener) {
    var m;

    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events)
      this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener)
      this.emit('newListener', type,
        isFunction(listener.listener) ?
          listener.listener : listener);

    if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    else if (isObject(this._events[type]))
    // If we've already got an array, just append.
      this._events[type].push(listener);
    else
    // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (isObject(this._events[type]) && !this._events[type].warned) {
      var m;
      if (!isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
            'leak detected. %d listeners added. ' +
            'Use emitter.setMaxListeners() to increase limit.',
          this._events[type].length);
        if (typeof console.trace === 'function') {
          // not supported in IE 10
          console.trace();
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(type, listener) {
    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    var fired = false;

    function g() {
      this.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    g.listener = listener;
    this.on(type, g);

    return this;
  };

// emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener = function(type, listener) {
    var list, position, length, i;

    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events || !this._events[type])
      return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
      delete this._events[type];
      if (this._events.removeListener)
        this.emit('removeListener', type, listener);

    } else if (isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
          position = i;
          break;
        }
      }

      if (position < 0)
        return this;

      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }

      if (this._events.removeListener)
        this.emit('removeListener', type, listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(type) {
    var key, listeners;

    if (!this._events)
      return this;

    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0)
        this._events = {};
      else if (this._events[type])
        delete this._events[type];
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }

    listeners = this._events[type];

    if (isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else {
      // LIFO order
      while (listeners.length)
        this.removeListener(type, listeners[listeners.length - 1]);
    }
    delete this._events[type];

    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    var ret;
    if (!this._events || !this._events[type])
      ret = [];
    else if (isFunction(this._events[type]))
      ret = [this._events[type]];
    else
      ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    var ret;
    if (!emitter._events || !emitter._events[type])
      ret = 0;
    else if (isFunction(emitter._events[type]))
      ret = 1;
    else
      ret = emitter._events[type].length;
    return ret;
  };

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isUndefined(arg) {
    return arg === void 0;
  }

},{}],46:[function(require,module,exports){
  var http = module.exports;
  var EventEmitter = require('events').EventEmitter;
  var Request = require('./lib/request');
  var url = require('url')

  http.request = function (params, cb) {
    if (typeof params === 'string') {
      params = url.parse(params)
    }
    if (!params) params = {};
    if (!params.host && !params.port) {
      params.port = parseInt(window.location.port, 10);
    }
    if (!params.host && params.hostname) {
      params.host = params.hostname;
    }

    if (!params.scheme) params.scheme = window.location.protocol.split(':')[0];
    if (!params.host) {
      params.host = window.location.hostname || window.location.host;
    }
    if (/:/.test(params.host)) {
      if (!params.port) {
        params.port = params.host.split(':')[1];
      }
      params.host = params.host.split(':')[0];
    }
    if (!params.port) params.port = params.scheme == 'https' ? 443 : 80;

    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
  };

  http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
  };

  http.Agent = function () {};
  http.Agent.defaultMaxSockets = 4;

  var xhrHttp = (function () {
    if (typeof window === 'undefined') {
      throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
      return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
      var axs = [
        'Msxml2.XMLHTTP.6.0',
        'Msxml2.XMLHTTP.3.0',
        'Microsoft.XMLHTTP'
      ];
      for (var i = 0; i < axs.length; i++) {
        try {
          var ax = new(window.ActiveXObject)(axs[i]);
          return function () {
            if (ax) {
              var ax_ = ax;
              ax = null;
              return ax_;
            }
            else {
              return new(window.ActiveXObject)(axs[i]);
            }
          };
        }
        catch (e) {}
      }
      throw new Error('ajax not supported in this browser')
    }
    else {
      throw new Error('ajax not supported in this browser');
    }
  })();

  http.STATUS_CODES = {
    100 : 'Continue',
    101 : 'Switching Protocols',
    102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
    200 : 'OK',
    201 : 'Created',
    202 : 'Accepted',
    203 : 'Non-Authoritative Information',
    204 : 'No Content',
    205 : 'Reset Content',
    206 : 'Partial Content',
    207 : 'Multi-Status',               // RFC 4918
    300 : 'Multiple Choices',
    301 : 'Moved Permanently',
    302 : 'Moved Temporarily',
    303 : 'See Other',
    304 : 'Not Modified',
    305 : 'Use Proxy',
    307 : 'Temporary Redirect',
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Time-out',
    409 : 'Conflict',
    410 : 'Gone',
    411 : 'Length Required',
    412 : 'Precondition Failed',
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Large',
    415 : 'Unsupported Media Type',
    416 : 'Requested Range Not Satisfiable',
    417 : 'Expectation Failed',
    418 : 'I\'m a teapot',              // RFC 2324
    422 : 'Unprocessable Entity',       // RFC 4918
    423 : 'Locked',                     // RFC 4918
    424 : 'Failed Dependency',          // RFC 4918
    425 : 'Unordered Collection',       // RFC 4918
    426 : 'Upgrade Required',           // RFC 2817
    428 : 'Precondition Required',      // RFC 6585
    429 : 'Too Many Requests',          // RFC 6585
    431 : 'Request Header Fields Too Large',// RFC 6585
    500 : 'Internal Server Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Gateway Time-out',
    505 : 'HTTP Version Not Supported',
    506 : 'Variant Also Negotiates',    // RFC 2295
    507 : 'Insufficient Storage',       // RFC 4918
    509 : 'Bandwidth Limit Exceeded',
    510 : 'Not Extended',               // RFC 2774
    511 : 'Network Authentication Required' // RFC 6585
  };
},{"./lib/request":47,"events":45,"url":70}],47:[function(require,module,exports){
  var Stream = require('stream');
  var Response = require('./response');
  var Base64 = require('Base64');
  var inherits = require('inherits');

  var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = [];

    self.uri = (params.scheme || 'http') + '://'
      + params.host
      + (params.port ? ':' + params.port : '')
      + (params.path || '/')
    ;

    if (typeof params.withCredentials === 'undefined') {
      params.withCredentials = true;
    }

    try { xhr.withCredentials = params.withCredentials }
    catch (e) {}

    if (params.responseType) try { xhr.responseType = params.responseType }
    catch (e) {}

    xhr.open(
        params.method || 'GET',
      self.uri,
      true
    );

    self._headers = {};

    if (params.headers) {
      var keys = objectKeys(params.headers);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!self.isSafeRequestHeader(key)) continue;
        var value = params.headers[key];
        self.setHeader(key, value);
      }
    }

    if (params.auth) {
      //basic auth
      this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
    }

    var res = new Response;
    res.on('close', function () {
      self.emit('close');
    });

    res.on('ready', function () {
      self.emit('response', res);
    });

    xhr.onreadystatechange = function () {
      // Fix for IE9 bug
      // SCRIPT575: Could not complete the operation due to error c00c023f
      // It happens when a request is aborted, calling the success callback anyway with readyState === 4
      if (xhr.__aborted) return;
      res.handle(xhr);
    };
  };

  inherits(Request, Stream);

  Request.prototype.setHeader = function (key, value) {
    this._headers[key.toLowerCase()] = value
  };

  Request.prototype.getHeader = function (key) {
    return this._headers[key.toLowerCase()]
  };

  Request.prototype.removeHeader = function (key) {
    delete this._headers[key.toLowerCase()]
  };

  Request.prototype.write = function (s) {
    this.body.push(s);
  };

  Request.prototype.destroy = function (s) {
    this.xhr.__aborted = true;
    this.xhr.abort();
    this.emit('close');
  };

  Request.prototype.end = function (s) {
    if (s !== undefined) this.body.push(s);

    var keys = objectKeys(this._headers);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = this._headers[key];
      if (isArray(value)) {
        for (var j = 0; j < value.length; j++) {
          this.xhr.setRequestHeader(key, value[j]);
        }
      }
      else this.xhr.setRequestHeader(key, value)
    }

    if (this.body.length === 0) {
      this.xhr.send('');
    }
    else if (typeof this.body[0] === 'string') {
      this.xhr.send(this.body.join(''));
    }
    else if (isArray(this.body[0])) {
      var body = [];
      for (var i = 0; i < this.body.length; i++) {
        body.push.apply(body, this.body[i]);
      }
      this.xhr.send(body);
    }
    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
      var len = 0;
      for (var i = 0; i < this.body.length; i++) {
        len += this.body[i].length;
      }
      var body = new(this.body[0].constructor)(len);
      var k = 0;

      for (var i = 0; i < this.body.length; i++) {
        var b = this.body[i];
        for (var j = 0; j < b.length; j++) {
          body[k++] = b[j];
        }
      }
      this.xhr.send(body);
    }
    else {
      var body = '';
      for (var i = 0; i < this.body.length; i++) {
        body += this.body[i].toString();
      }
      this.xhr.send(body);
    }
  };

// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
  Request.unsafeHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "cookie",
    "cookie2",
    "content-transfer-encoding",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "via"
  ];

  Request.prototype.isSafeRequestHeader = function (headerName) {
    if (!headerName) return false;
    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
  };

  var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
  };

  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };

  var indexOf = function (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
      if (xs[i] === x) return i;
    }
    return -1;
  };

},{"./response":48,"Base64":49,"inherits":50,"stream":69}],48:[function(require,module,exports){
  var Stream = require('stream');
  var util = require('util');

  var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
  };

  util.inherits(Response, Stream);

  var capable = {
    streaming : true,
    status2 : true
  };

  function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === '') continue;

      var m = line.match(/^([^:]+):\s*(.*)/);
      if (m) {
        var key = m[1].toLowerCase(), value = m[2];

        if (headers[key] !== undefined) {

          if (isArray(headers[key])) {
            headers[key].push(value);
          }
          else {
            headers[key] = [ headers[key], value ];
          }
        }
        else {
          headers[key] = value;
        }
      }
      else {
        headers[line] = true;
      }
    }
    return headers;
  }

  Response.prototype.getResponse = function (xhr) {
    var respType = String(xhr.responseType).toLowerCase();
    if (respType === 'blob') return xhr.responseBlob || xhr.response;
    if (respType === 'arraybuffer') return xhr.response;
    return xhr.responseText;
  }

  Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
  };

  Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
      try {
        this.statusCode = res.status;
        this.headers = parseHeaders(res);
      }
      catch (err) {
        capable.status2 = false;
      }

      if (capable.status2) {
        this.emit('ready');
      }
    }
    else if (capable.streaming && res.readyState === 3) {
      try {
        if (!this.statusCode) {
          this.statusCode = res.status;
          this.headers = parseHeaders(res);
          this.emit('ready');
        }
      }
      catch (err) {}

      try {
        this._emitData(res);
      }
      catch (err) {
        capable.streaming = false;
      }
    }
    else if (res.readyState === 4) {
      if (!this.statusCode) {
        this.statusCode = res.status;
        this.emit('ready');
      }
      this._emitData(res);

      if (res.error) {
        this.emit('error', this.getResponse(res));
      }
      else this.emit('end');

      this.emit('close');
    }
  };

  Response.prototype._emitData = function (res) {
    var respBody = this.getResponse(res);
    if (respBody.toString().match(/ArrayBuffer/)) {
      this.emit('data', new Uint8Array(respBody, this.offset));
      this.offset = respBody.byteLength;
      return;
    }
    if (respBody.length > this.offset) {
      this.emit('data', respBody.slice(this.offset));
      this.offset = respBody.length;
    }
  };

  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };

},{"stream":69,"util":72}],49:[function(require,module,exports){
  ;(function () {

    var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    object.btoa || (
      object.btoa = function (input) {
        for (
          // initialize result and counter
          var block, charCode, idx = 0, map = chars, output = '';
          // if the next input index does not exist:
          //   change the mapping table to "="
          //   check if d has no fractional digits
          input.charAt(idx | 0) || (map = '=', idx % 1);
          // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt(63 & block >> 8 - idx % 1 * 8)
          ) {
          charCode = input.charCodeAt(idx += 3/4);
          if (charCode > 0xFF) {
            throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
          }
          block = block << 8 | charCode;
        }
        return output;
      });

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    object.atob || (
      object.atob = function (input) {
        input = input.replace(/=+$/, '');
        if (input.length % 4 == 1) {
          throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
          // initialize result and counters
          var bc = 0, bs, buffer, idx = 0, output = '';
          // get next character
          buffer = input.charAt(idx++);
          // character found in table? initialize bit storage and add its ascii value;
          ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
          ) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
        }
        return output;
      });

  }());

},{}],50:[function(require,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }

},{}],51:[function(require,module,exports){
// shim for using process in browser

  var process = module.exports = {};

  process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
      && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
      ;

    if (canSetImmediate) {
      return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
      var queue = [];
      window.addEventListener('message', function (ev) {
        var source = ev.source;
        if ((source === window || source === null) && ev.data === 'process-tick') {
          ev.stopPropagation();
          if (queue.length > 0) {
            var fn = queue.shift();
            fn();
          }
        }
      }, true);

      return function nextTick(fn) {
        queue.push(fn);
        window.postMessage('process-tick', '*');
      };
    }

    return function nextTick(fn) {
      setTimeout(fn, 0);
    };
  })();

  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];

  function noop() {}

  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;

  process.binding = function (name) {
    throw new Error('process.binding is not supported');
  }

// TODO(shtylman)
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
  };

},{}],52:[function(require,module,exports){
  (function (global){
    /*! http://mths.be/punycode v1.2.4 by @mathias */
    ;(function(root) {

      /** Detect free variables */
      var freeExports = typeof exports == 'object' && exports;
      var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;
      var freeGlobal = typeof global == 'object' && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }

      /**
       * The `punycode` object.
       * @name punycode
       * @type Object
       */
      var punycode,

        /** Highest positive signed 32-bit float value */
        maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

        /** Bootstring parameters */
        base = 36,
        tMin = 1,
        tMax = 26,
        skew = 38,
        damp = 700,
        initialBias = 72,
        initialN = 128, // 0x80
        delimiter = '-', // '\x2D'

        /** Regular expressions */
        regexPunycode = /^xn--/,
        regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
        regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

        /** Error messages */
        errors = {
          'overflow': 'Overflow: input needs wider integers to process',
          'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
          'invalid-input': 'Invalid input'
        },

        /** Convenience shortcuts */
        baseMinusTMin = base - tMin,
        floor = Math.floor,
        stringFromCharCode = String.fromCharCode,

        /** Temporary variable */
        key;

      /*--------------------------------------------------------------------------*/

      /**
       * A generic error utility function.
       * @private
       * @param {String} type The error type.
       * @returns {Error} Throws a `RangeError` with the applicable error message.
       */
      function error(type) {
        throw RangeError(errors[type]);
      }

      /**
       * A generic `Array#map` utility function.
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} callback The function that gets called for every array
       * item.
       * @returns {Array} A new array of values returned by the callback function.
       */
      function map(array, fn) {
        var length = array.length;
        while (length--) {
          array[length] = fn(array[length]);
        }
        return array;
      }

      /**
       * A simple `Array#map`-like wrapper to work with domain name strings.
       * @private
       * @param {String} domain The domain name.
       * @param {Function} callback The function that gets called for every
       * character.
       * @returns {Array} A new string of characters returned by the callback
       * function.
       */
      function mapDomain(string, fn) {
        return map(string.split(regexSeparators), fn).join('.');
      }

      /**
       * Creates an array containing the numeric code points of each Unicode
       * character in the string. While JavaScript uses UCS-2 internally,
       * this function will convert a pair of surrogate halves (each of which
       * UCS-2 exposes as separate characters) into a single code point,
       * matching UTF-16.
       * @see `punycode.ucs2.encode`
       * @see <http://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode.ucs2
       * @name decode
       * @param {String} string The Unicode input string (UCS-2).
       * @returns {Array} The new array of code points.
       */
      function ucs2decode(string) {
        var output = [],
          counter = 0,
          length = string.length,
          value,
          extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
              output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
              // unmatched surrogate; only append this code unit, in case the next
              // code unit is the high surrogate of a surrogate pair
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }

      /**
       * Creates a string based on an array of numeric code points.
       * @see `punycode.ucs2.decode`
       * @memberOf punycode.ucs2
       * @name encode
       * @param {Array} codePoints The array of numeric code points.
       * @returns {String} The new Unicode string (UCS-2).
       */
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = '';
          if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
          }
          output += stringFromCharCode(value);
          return output;
        }).join('');
      }

      /**
       * Converts a basic code point into a digit/integer.
       * @see `digitToBasic()`
       * @private
       * @param {Number} codePoint The basic numeric code point value.
       * @returns {Number} The numeric value of a basic code point (for use in
       * representing integers) in the range `0` to `base - 1`, or `base` if
       * the code point does not represent a value.
       */
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }

      /**
       * Converts a digit/integer into a basic code point.
       * @see `basicToDigit()`
       * @private
       * @param {Number} digit The numeric value of a basic code point.
       * @returns {Number} The basic code point whose value (when used for
       * representing integers) is `digit`, which needs to be in the range
       * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
       * used; else, the lowercase form is used. The behavior is undefined
       * if `flag` is non-zero and `digit` has no uppercase form.
       */
      function digitToBasic(digit, flag) {
        //  0..25 map to ASCII a..z or A..Z
        // 26..35 map to ASCII 0..9
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }

      /**
       * Bias adaptation function as per section 3.4 of RFC 3492.
       * http://tools.ietf.org/html/rfc3492#section-3.4
       * @private
       */
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }

      /**
       * Converts a Punycode string of ASCII-only symbols to a string of Unicode
       * symbols.
       * @memberOf punycode
       * @param {String} input The Punycode string of ASCII-only symbols.
       * @returns {String} The resulting string of Unicode symbols.
       */
      function decode(input) {
        // Don't use UCS-2
        var output = [],
          inputLength = input.length,
          out,
          i = 0,
          n = initialN,
          bias = initialBias,
          basic,
          j,
          index,
          oldi,
          w,
          k,
          digit,
          t,
          /** Cached calculation results */
          baseMinusT;

        // Handle the basic code points: let `basic` be the number of input code
        // points before the last delimiter, or `0` if there is none, then copy
        // the first basic code points to the output.

        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }

        for (j = 0; j < basic; ++j) {
          // if it's not a basic code point
          if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
          }
          output.push(input.charCodeAt(j));
        }

        // Main decoding loop: start just after the last delimiter if any basic code
        // points were copied; start at the beginning otherwise.

        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

          // `index` is the index of the next character to be consumed.
          // Decode a generalized variable-length integer into `delta`,
          // which gets added to `i`. The overflow checking is easier
          // if we increase `i` as we go, then subtract off its starting
          // value at the end to obtain `delta`.
          for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

            if (index >= inputLength) {
              error('invalid-input');
            }

            digit = basicToDigit(input.charCodeAt(index++));

            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error('overflow');
            }

            i += digit * w;
            t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

            if (digit < t) {
              break;
            }

            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error('overflow');
            }

            w *= baseMinusT;

          }

          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);

          // `i` was supposed to wrap around from `out` to `0`,
          // incrementing `n` each time, so we'll fix that now:
          if (floor(i / out) > maxInt - n) {
            error('overflow');
          }

          n += floor(i / out);
          i %= out;

          // Insert `n` at position `i` of the output
          output.splice(i++, 0, n);

        }

        return ucs2encode(output);
      }

      /**
       * Converts a string of Unicode symbols to a Punycode string of ASCII-only
       * symbols.
       * @memberOf punycode
       * @param {String} input The string of Unicode symbols.
       * @returns {String} The resulting Punycode string of ASCII-only symbols.
       */
      function encode(input) {
        var n,
          delta,
          handledCPCount,
          basicLength,
          bias,
          j,
          m,
          q,
          k,
          t,
          currentValue,
          output = [],
          /** `inputLength` will hold the number of code points in `input`. */
          inputLength,
          /** Cached calculation results */
          handledCPCountPlusOne,
          baseMinusT,
          qMinusT;

        // Convert the input in UCS-2 to Unicode
        input = ucs2decode(input);

        // Cache the length
        inputLength = input.length;

        // Initialize the state
        n = initialN;
        delta = 0;
        bias = initialBias;

        // Handle the basic code points
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 0x80) {
            output.push(stringFromCharCode(currentValue));
          }
        }

        handledCPCount = basicLength = output.length;

        // `handledCPCount` is the number of code points that have been handled;
        // `basicLength` is the number of basic code points.

        // Finish the basic string - if it is not empty - with a delimiter
        if (basicLength) {
          output.push(delimiter);
        }

        // Main encoding loop:
        while (handledCPCount < inputLength) {

          // All non-basic code points < n have been handled already. Find the next
          // larger one:
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }

          // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
          // but guard against overflow
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
          }

          delta += (m - n) * handledCPCountPlusOne;
          n = m;

          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];

            if (currentValue < n && ++delta > maxInt) {
              error('overflow');
            }

            if (currentValue == n) {
              // Represent delta as a generalized variable-length integer
              for (q = delta, k = base; /* no condition */; k += base) {
                t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }

              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }

          ++delta;
          ++n;

        }
        return output.join('');
      }

      /**
       * Converts a Punycode string representing a domain name to Unicode. Only the
       * Punycoded parts of the domain name will be converted, i.e. it doesn't
       * matter if you call it on a string that has already been converted to
       * Unicode.
       * @memberOf punycode
       * @param {String} domain The Punycode domain name to convert to Unicode.
       * @returns {String} The Unicode representation of the given Punycode
       * string.
       */
      function toUnicode(domain) {
        return mapDomain(domain, function(string) {
          return regexPunycode.test(string)
            ? decode(string.slice(4).toLowerCase())
            : string;
        });
      }

      /**
       * Converts a Unicode string representing a domain name to Punycode. Only the
       * non-ASCII parts of the domain name will be converted, i.e. it doesn't
       * matter if you call it with a domain that's already in ASCII.
       * @memberOf punycode
       * @param {String} domain The domain name to convert, as a Unicode string.
       * @returns {String} The Punycode representation of the given domain name.
       */
      function toASCII(domain) {
        return mapDomain(domain, function(string) {
          return regexNonASCII.test(string)
            ? 'xn--' + encode(string)
            : string;
        });
      }

      /*--------------------------------------------------------------------------*/

      /** Define the public API */
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        'version': '1.2.4',
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <http://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        'ucs2': {
          'decode': ucs2decode,
          'encode': ucs2encode
        },
        'decode': decode,
        'encode': encode,
        'toASCII': toASCII,
        'toUnicode': toUnicode
      };

      /** Expose `punycode` */
      // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:
      if (
        typeof define == 'function' &&
        typeof define.amd == 'object' &&
        define.amd
        ) {
        define('punycode', function() {
          return punycode;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) { // in Node.js or RingoJS v0.8.0+
          freeModule.exports = punycode;
        } else { // in Narwhal or RingoJS v0.7.0-
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else { // in Rhino or a web browser
        root.punycode = punycode;
      }

    }(this));

  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],53:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  module.exports = function(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  };

  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };

},{}],54:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  'use strict';

  var stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  module.exports = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return map(objectKeys(obj), function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (isArray(obj[k])) {
          return map(obj[k], function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
      encodeURIComponent(stringifyPrimitive(obj));
  };

  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };

  function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      res.push(f(xs[i], i));
    }
    return res;
  }

  var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
  };

},{}],55:[function(require,module,exports){
  'use strict';

  exports.decode = exports.parse = require('./decode');
  exports.encode = exports.stringify = require('./encode');

},{"./decode":53,"./encode":54}],56:[function(require,module,exports){
  module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":57}],57:[function(require,module,exports){
  (function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

    module.exports = Duplex;

    /*<replacement>*/
    var objectKeys = Object.keys || function (obj) {
      var keys = [];
      for (var key in obj) keys.push(key);
      return keys;
    }
    /*</replacement>*/


    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/

    var Readable = require('./_stream_readable');
    var Writable = require('./_stream_writable');

    util.inherits(Duplex, Readable);

    forEach(objectKeys(Writable.prototype), function(method) {
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    });

    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);

      Readable.call(this, options);
      Writable.call(this, options);

      if (options && options.readable === false)
        this.readable = false;

      if (options && options.writable === false)
        this.writable = false;

      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;

      this.once('end', onend);
    }

// the no-half-open enforcer
    function onend() {
      // if we allow half-open state, or if the writable side ended,
      // then we're ok.
      if (this.allowHalfOpen || this._writableState.ended)
        return;

      // no more data can be written.
      // But allow more writes to happen in this tick.
      process.nextTick(this.end.bind(this));
    }

    function forEach (xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }

  }).call(this,require("sycGbZ"))
},{"./_stream_readable":59,"./_stream_writable":61,"core-util-is":62,"inherits":50,"sycGbZ":51}],58:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

  module.exports = PassThrough;

  var Transform = require('./_stream_transform');

  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/

  util.inherits(PassThrough, Transform);

  function PassThrough(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);

    Transform.call(this, options);
  }

  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };

},{"./_stream_transform":60,"core-util-is":62,"inherits":50}],59:[function(require,module,exports){
  (function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    module.exports = Readable;

    /*<replacement>*/
    var isArray = require('isarray');
    /*</replacement>*/


    /*<replacement>*/
    var Buffer = require('buffer').Buffer;
    /*</replacement>*/

    Readable.ReadableState = ReadableState;

    var EE = require('events').EventEmitter;

    /*<replacement>*/
    if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    /*</replacement>*/

    var Stream = require('stream');

    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/

    var StringDecoder;

    util.inherits(Readable, Stream);

    function ReadableState(options, stream) {
      options = options || {};

      // the point at which it stops calling _read() to fill the buffer
      // Note: 0 is a valid value, means "don't call _read preemptively ever"
      var hwm = options.highWaterMark;
      this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

      // cast to ints.
      this.highWaterMark = ~~this.highWaterMark;

      this.buffer = [];
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = false;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;

      // In streams that never have any data, and do push(null) right away,
      // the consumer can miss the 'end' event if they do some I/O before
      // consuming the stream.  So, we don't emit('end') until some reading
      // happens.
      this.calledRead = false;

      // a flag to be able to tell if the onwrite cb is called immediately,
      // or on a later tick.  We set this to true at first, becuase any
      // actions that shouldn't happen until "later" should generally also
      // not happen before the first write call.
      this.sync = true;

      // whenever we return null, then we set a flag to say
      // that we're awaiting a 'readable' event emission.
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;


      // object stream flag. Used to make read(n) ignore n and to
      // make all the buffer merging and length checks go away
      this.objectMode = !!options.objectMode;

      // Crypto is kind of old and crusty.  Historically, its default string
      // encoding is 'binary' so we have to make this configurable.
      // Everything else in the universe uses 'utf8', though.
      this.defaultEncoding = options.defaultEncoding || 'utf8';

      // when piping, we only care about 'readable' events that happen
      // after read()ing all the bytes and not getting any pushback.
      this.ranOut = false;

      // the number of writers that are awaiting a drain event in .pipe()s
      this.awaitDrain = 0;

      // if true, a maybeReadMore has been scheduled
      this.readingMore = false;

      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require('string_decoder/').StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }

    function Readable(options) {
      if (!(this instanceof Readable))
        return new Readable(options);

      this._readableState = new ReadableState(options, this);

      // legacy
      this.readable = true;

      Stream.call(this);
    }

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;

      if (typeof chunk === 'string' && !state.objectMode) {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = new Buffer(chunk, encoding);
          encoding = '';
        }
      }

      return readableAddChunk(this, state, chunk, encoding, false);
    };

// Unshift should *always* be something directly out of read()
    Readable.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, '', true);
    };

    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
      var er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit('error', er);
      } else if (chunk === null || chunk === undefined) {
        state.reading = false;
        if (!state.ended)
          onEofChunk(stream, state);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (state.ended && !addToFront) {
          var e = new Error('stream.push() after EOF');
          stream.emit('error', e);
        } else if (state.endEmitted && addToFront) {
          var e = new Error('stream.unshift() after end event');
          stream.emit('error', e);
        } else {
          if (state.decoder && !addToFront && !encoding)
            chunk = state.decoder.write(chunk);

          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) {
            state.buffer.unshift(chunk);
          } else {
            state.reading = false;
            state.buffer.push(chunk);
          }

          if (state.needReadable)
            emitReadable(stream);

          maybeReadMore(stream, state);
        }
      } else if (!addToFront) {
        state.reading = false;
      }

      return needMoreData(state);
    }



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
    function needMoreData(state) {
      return !state.ended &&
        (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
    }

// backwards compatibility.
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require('string_decoder/').StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
    };

// Don't raise the hwm > 128MB
    var MAX_HWM = 0x800000;
    function roundUpToNextPowerOf2(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        // Get the next highest power of 2
        n--;
        for (var p = 1; p < 32; p <<= 1) n |= n >> p;
        n++;
      }
      return n;
    }

    function howMuchToRead(n, state) {
      if (state.length === 0 && state.ended)
        return 0;

      if (state.objectMode)
        return n === 0 ? 0 : 1;

      if (isNaN(n) || n === null) {
        // only flow one buffer at a time
        if (state.flowing && state.buffer.length)
          return state.buffer[0].length;
        else
          return state.length;
      }

      if (n <= 0)
        return 0;

      // If we're asking for more than the target buffer level,
      // then raise the water mark.  Bump up to the next highest
      // power of 2, to prevent increasing it excessively in tiny
      // amounts.
      if (n > state.highWaterMark)
        state.highWaterMark = roundUpToNextPowerOf2(n);

      // don't have that much.  return null, unless we've ended.
      if (n > state.length) {
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        } else
          return state.length;
      }

      return n;
    }

// you can override either this method, or the async _read(n) below.
    Readable.prototype.read = function(n) {
      var state = this._readableState;
      state.calledRead = true;
      var nOrig = n;

      if (typeof n !== 'number' || n > 0)
        state.emittedReadable = false;

      // if we're doing read(0) to trigger a readable event, but we
      // already have a bunch of data in the buffer, then just trigger
      // the 'readable' event and move on.
      if (n === 0 &&
        state.needReadable &&
        (state.length >= state.highWaterMark || state.ended)) {
        emitReadable(this);
        return null;
      }

      n = howMuchToRead(n, state);

      // if we've ended, and we're now clear, then finish it up.
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }

      // All the actual chunk generation logic needs to be
      // *below* the call to _read.  The reason is that in certain
      // synthetic stream cases, such as passthrough streams, _read
      // may be a completely synchronous operation which may change
      // the state of the read buffer, providing enough data when
      // before there was *not* enough.
      //
      // So, the steps are:
      // 1. Figure out what the state of things will be after we do
      // a read from the buffer.
      //
      // 2. If that resulting state will trigger a _read, then call _read.
      // Note that this may be asynchronous, or synchronous.  Yes, it is
      // deeply ugly to write APIs this way, but that still doesn't mean
      // that the Readable class should behave improperly, as streams are
      // designed to be sync/async agnostic.
      // Take note if the _read call is sync or async (ie, if the read call
      // has returned yet), so that we know whether or not it's safe to emit
      // 'readable' etc.
      //
      // 3. Actually pull the requested chunks out of the buffer and return.

      // if we need a readable event, then we need to do some reading.
      var doRead = state.needReadable;

      // if we currently have less than the highWaterMark, then also read some
      if (state.length - n <= state.highWaterMark)
        doRead = true;

      // however, if we've ended, then there's no point, and if we're already
      // reading, then it's unnecessary.
      if (state.ended || state.reading)
        doRead = false;

      if (doRead) {
        state.reading = true;
        state.sync = true;
        // if the length is currently zero, then we *need* a readable event.
        if (state.length === 0)
          state.needReadable = true;
        // call internal read method
        this._read(state.highWaterMark);
        state.sync = false;
      }

      // If _read called its callback synchronously, then `reading`
      // will be false, and we need to re-evaluate how much data we
      // can return to the user.
      if (doRead && !state.reading)
        n = howMuchToRead(nOrig, state);

      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;

      if (ret === null) {
        state.needReadable = true;
        n = 0;
      }

      state.length -= n;

      // If we have nothing in the buffer, then we want to know
      // as soon as we *do* get something into the buffer.
      if (state.length === 0 && !state.ended)
        state.needReadable = true;

      // If we happened to read() exactly the remaining amount in the
      // buffer, and the EOF has been seen at this point, then make sure
      // that we emit 'end' on the very next tick.
      if (state.ended && !state.endEmitted && state.length === 0)
        endReadable(this);

      return ret;
    };

    function chunkInvalid(state, chunk) {
      var er = null;
      if (!Buffer.isBuffer(chunk) &&
        'string' !== typeof chunk &&
        chunk !== null &&
        chunk !== undefined &&
        !state.objectMode &&
        !er) {
        er = new TypeError('Invalid non-string/buffer chunk');
      }
      return er;
    }


    function onEofChunk(stream, state) {
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;

      // if we've ended and we have some data left, then emit
      // 'readable' now to make sure it gets picked up.
      if (state.length > 0)
        emitReadable(stream);
      else
        endReadable(stream);
    }

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (state.emittedReadable)
        return;

      state.emittedReadable = true;
      if (state.sync)
        process.nextTick(function() {
          emitReadable_(stream);
        });
      else
        emitReadable_(stream);
    }

    function emitReadable_(stream) {
      stream.emit('readable');
    }


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(function() {
          maybeReadMore_(stream, state);
        });
      }
    }

    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended &&
        state.length < state.highWaterMark) {
        stream.read(0);
        if (len === state.length)
        // didn't get any data, stop spinning.
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
    Readable.prototype._read = function(n) {
      this.emit('error', new Error('not implemented'));
    };

    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;

      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;

      var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
        dest !== process.stdout &&
        dest !== process.stderr;

      var endFn = doEnd ? onend : cleanup;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once('end', endFn);

      dest.on('unpipe', onunpipe);
      function onunpipe(readable) {
        if (readable !== src) return;
        cleanup();
      }

      function onend() {
        dest.end();
      }

      // when the dest drains, it reduces the awaitDrain counter
      // on the source.  This would be more elegant with a .once()
      // handler in flow(), but adding and removing repeatedly is
      // too slow.
      var ondrain = pipeOnDrain(src);
      dest.on('drain', ondrain);

      function cleanup() {
        // cleanup event handlers once the pipe is broken
        dest.removeListener('close', onclose);
        dest.removeListener('finish', onfinish);
        dest.removeListener('drain', ondrain);
        dest.removeListener('error', onerror);
        dest.removeListener('unpipe', onunpipe);
        src.removeListener('end', onend);
        src.removeListener('end', cleanup);

        // if the reader is waiting for a drain event from this
        // specific writer, then it would cause it to never start
        // flowing again.
        // So, if this is awaiting a drain, then we just call it now.
        // If we don't know, then assume that we are waiting for one.
        if (!dest._writableState || dest._writableState.needDrain)
          ondrain();
      }

      // if the dest has an error, then stop piping into it.
      // however, don't suppress the throwing behavior for this.
      function onerror(er) {
        unpipe();
        dest.removeListener('error', onerror);
        if (EE.listenerCount(dest, 'error') === 0)
          dest.emit('error', er);
      }
      // This is a brutally ugly hack to make sure that our error handler
      // is attached before any userland ones.  NEVER DO THIS.
      if (!dest._events || !dest._events.error)
        dest.on('error', onerror);
      else if (isArray(dest._events.error))
        dest._events.error.unshift(onerror);
      else
        dest._events.error = [onerror, dest._events.error];



      // Both close and finish should trigger unpipe, but only once.
      function onclose() {
        dest.removeListener('finish', onfinish);
        unpipe();
      }
      dest.once('close', onclose);
      function onfinish() {
        dest.removeListener('close', onclose);
        unpipe();
      }
      dest.once('finish', onfinish);

      function unpipe() {
        src.unpipe(dest);
      }

      // tell the dest that it's being piped to
      dest.emit('pipe', src);

      // start the flow if it hasn't been started already.
      if (!state.flowing) {
        // the handler that waits for readable events after all
        // the data gets sucked out in flow.
        // This would be easier to follow with a .once() handler
        // in flow(), but that is too slow.
        this.on('readable', pipeOnReadable);

        state.flowing = true;
        process.nextTick(function() {
          flow(src);
        });
      }

      return dest;
    };

    function pipeOnDrain(src) {
      return function() {
        var dest = this;
        var state = src._readableState;
        state.awaitDrain--;
        if (state.awaitDrain === 0)
          flow(src);
      };
    }

    function flow(src) {
      var state = src._readableState;
      var chunk;
      state.awaitDrain = 0;

      function write(dest, i, list) {
        var written = dest.write(chunk);
        if (false === written) {
          state.awaitDrain++;
        }
      }

      while (state.pipesCount && null !== (chunk = src.read())) {

        if (state.pipesCount === 1)
          write(state.pipes, 0, null);
        else
          forEach(state.pipes, write);

        src.emit('data', chunk);

        // if anyone needs a drain, then we have to wait for that.
        if (state.awaitDrain > 0)
          return;
      }

      // if every destination was unpiped, either before entering this
      // function, or in the while loop, then stop flowing.
      //
      // NB: This is a pretty rare edge case.
      if (state.pipesCount === 0) {
        state.flowing = false;

        // if there were data event listeners added, then switch to old mode.
        if (EE.listenerCount(src, 'data') > 0)
          emitDataEvents(src);
        return;
      }

      // at this point, no one needed a drain, so we just ran out of data
      // on the next readable event, start it over again.
      state.ranOut = true;
    }

    function pipeOnReadable() {
      if (this._readableState.ranOut) {
        this._readableState.ranOut = false;
        flow(this);
      }
    }


    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;

      // if we're not piping anywhere, then do nothing.
      if (state.pipesCount === 0)
        return this;

      // just one destination.  most common case.
      if (state.pipesCount === 1) {
        // passed in one, but it's not the right one.
        if (dest && dest !== state.pipes)
          return this;

        if (!dest)
          dest = state.pipes;

        // got a match.
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener('readable', pipeOnReadable);
        state.flowing = false;
        if (dest)
          dest.emit('unpipe', this);
        return this;
      }

      // slow case. multiple pipe destinations.

      if (!dest) {
        // remove all.
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener('readable', pipeOnReadable);
        state.flowing = false;

        for (var i = 0; i < len; i++)
          dests[i].emit('unpipe', this);
        return this;
      }

      // try to find the right one.
      var i = indexOf(state.pipes, dest);
      if (i === -1)
        return this;

      state.pipes.splice(i, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];

      dest.emit('unpipe', this);

      return this;
    };

// set up data events if they are asked for
// Ensure readable listeners eventually get something
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);

      if (ev === 'data' && !this._readableState.flowing)
        emitDataEvents(this);

      if (ev === 'readable' && this.readable) {
        var state = this._readableState;
        if (!state.readableListening) {
          state.readableListening = true;
          state.emittedReadable = false;
          state.needReadable = true;
          if (!state.reading) {
            this.read(0);
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }

      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
    Readable.prototype.resume = function() {
      emitDataEvents(this);
      this.read(0);
      this.emit('resume');
    };

    Readable.prototype.pause = function() {
      emitDataEvents(this, true);
      this.emit('pause');
    };

    function emitDataEvents(stream, startPaused) {
      var state = stream._readableState;

      if (state.flowing) {
        // https://github.com/isaacs/readable-stream/issues/16
        throw new Error('Cannot switch to old mode now.');
      }

      var paused = startPaused || false;
      var readable = false;

      // convert to an old-style stream.
      stream.readable = true;
      stream.pipe = Stream.prototype.pipe;
      stream.on = stream.addListener = Stream.prototype.on;

      stream.on('readable', function() {
        readable = true;

        var c;
        while (!paused && (null !== (c = stream.read())))
          stream.emit('data', c);

        if (c === null) {
          readable = false;
          stream._readableState.needReadable = true;
        }
      });

      stream.pause = function() {
        paused = true;
        this.emit('pause');
      };

      stream.resume = function() {
        paused = false;
        if (readable)
          process.nextTick(function() {
            stream.emit('readable');
          });
        else
          this.read(0);
        this.emit('resume');
      };

      // now make it start, just in case it hadn't already.
      stream.emit('readable');
    }

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
    Readable.prototype.wrap = function(stream) {
      var state = this._readableState;
      var paused = false;

      var self = this;
      stream.on('end', function() {
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self.push(chunk);
        }

        self.push(null);
      });

      stream.on('data', function(chunk) {
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (!chunk || !state.objectMode && !chunk.length)
          return;

        var ret = self.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });

      // proxy all the other methods.
      // important when wrapping filters and duplexes.
      for (var i in stream) {
        if (typeof stream[i] === 'function' &&
          typeof this[i] === 'undefined') {
          this[i] = function(method) { return function() {
            return stream[method].apply(stream, arguments);
          }}(i);
        }
      }

      // proxy certain important events.
      var events = ['error', 'close', 'destroy', 'pause', 'resume'];
      forEach(events, function(ev) {
        stream.on(ev, self.emit.bind(self, ev));
      });

      // when we try to consume some more bytes, simply unpause the
      // underlying stream.
      self._read = function(n) {
        if (paused) {
          paused = false;
          stream.resume();
        }
      };

      return self;
    };



// exposed for testing purposes only.
    Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
    function fromList(n, state) {
      var list = state.buffer;
      var length = state.length;
      var stringMode = !!state.decoder;
      var objectMode = !!state.objectMode;
      var ret;

      // nothing in the list, definitely empty.
      if (list.length === 0)
        return null;

      if (length === 0)
        ret = null;
      else if (objectMode)
        ret = list.shift();
      else if (!n || n >= length) {
        // read it all, truncate the array.
        if (stringMode)
          ret = list.join('');
        else
          ret = Buffer.concat(list, length);
        list.length = 0;
      } else {
        // read just some of it.
        if (n < list[0].length) {
          // just take a part of the first list item.
          // slice is the same for buffers and strings.
          var buf = list[0];
          ret = buf.slice(0, n);
          list[0] = buf.slice(n);
        } else if (n === list[0].length) {
          // first list is a perfect match
          ret = list.shift();
        } else {
          // complex case.
          // we have enough to cover it, but it spans past the first buffer.
          if (stringMode)
            ret = '';
          else
            ret = new Buffer(n);

          var c = 0;
          for (var i = 0, l = list.length; i < l && c < n; i++) {
            var buf = list[0];
            var cpy = Math.min(n - c, buf.length);

            if (stringMode)
              ret += buf.slice(0, cpy);
            else
              buf.copy(ret, c, 0, cpy);

            if (cpy < buf.length)
              list[0] = buf.slice(cpy);
            else
              list.shift();

            c += cpy;
          }
        }
      }

      return ret;
    }

    function endReadable(stream) {
      var state = stream._readableState;

      // If we get here before consuming all the bytes, then that is a
      // bug in node.  Should never happen.
      if (state.length > 0)
        throw new Error('endReadable called on non-empty stream');

      if (!state.endEmitted && state.calledRead) {
        state.ended = true;
        process.nextTick(function() {
          // Check that we didn't get one last unshift.
          if (!state.endEmitted && state.length === 0) {
            state.endEmitted = true;
            stream.readable = false;
            stream.emit('end');
          }
        });
      }
    }

    function forEach (xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }

    function indexOf (xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }

  }).call(this,require("sycGbZ"))
},{"buffer":29,"core-util-is":62,"events":45,"inherits":50,"isarray":63,"stream":69,"string_decoder/":64,"sycGbZ":51}],60:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

  module.exports = Transform;

  var Duplex = require('./_stream_duplex');

  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/

  util.inherits(Transform, Duplex);


  function TransformState(options, stream) {
    this.afterTransform = function(er, data) {
      return afterTransform(stream, er, data);
    };

    this.needTransform = false;
    this.transforming = false;
    this.writecb = null;
    this.writechunk = null;
  }

  function afterTransform(stream, er, data) {
    var ts = stream._transformState;
    ts.transforming = false;

    var cb = ts.writecb;

    if (!cb)
      return stream.emit('error', new Error('no writecb in Transform class'));

    ts.writechunk = null;
    ts.writecb = null;

    if (data !== null && data !== undefined)
      stream.push(data);

    if (cb)
      cb(er);

    var rs = stream._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      stream._read(rs.highWaterMark);
    }
  }


  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);

    Duplex.call(this, options);

    var ts = this._transformState = new TransformState(options, this);

    // when the writable side finishes, then flush out anything remaining.
    var stream = this;

    // start out asking for a readable event once data is transformed.
    this._readableState.needReadable = true;

    // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
    this._readableState.sync = false;

    this.once('finish', function() {
      if ('function' === typeof this._flush)
        this._flush(function(er) {
          done(stream, er);
        });
      else
        done(stream);
    });
  }

  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
  Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error('not implemented');
  };

  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  };

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
  Transform.prototype._read = function(n) {
    var ts = this._transformState;

    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      // mark that we need a transform, so that any data that comes in
      // will get processed, now that we've asked for it.
      ts.needTransform = true;
    }
  };


  function done(stream, er) {
    if (er)
      return stream.emit('error', er);

    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
    var ws = stream._writableState;
    var rs = stream._readableState;
    var ts = stream._transformState;

    if (ws.length)
      throw new Error('calling transform done when ws.length != 0');

    if (ts.transforming)
      throw new Error('calling transform done when still transforming');

    return stream.push(null);
  }

},{"./_stream_duplex":57,"core-util-is":62,"inherits":50}],61:[function(require,module,exports){
  (function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

    module.exports = Writable;

    /*<replacement>*/
    var Buffer = require('buffer').Buffer;
    /*</replacement>*/

    Writable.WritableState = WritableState;


    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/


    var Stream = require('stream');

    util.inherits(Writable, Stream);

    function WriteReq(chunk, encoding, cb) {
      this.chunk = chunk;
      this.encoding = encoding;
      this.callback = cb;
    }

    function WritableState(options, stream) {
      options = options || {};

      // the point at which write() starts returning false
      // Note: 0 is a valid value, means that we always return false if
      // the entire buffer is not flushed immediately on write()
      var hwm = options.highWaterMark;
      this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

      // object stream flag to indicate whether or not this stream
      // contains buffers or objects.
      this.objectMode = !!options.objectMode;

      // cast to ints.
      this.highWaterMark = ~~this.highWaterMark;

      this.needDrain = false;
      // at the start of calling end()
      this.ending = false;
      // when end() has been called, and returned
      this.ended = false;
      // when 'finish' is emitted
      this.finished = false;

      // should we decode strings into buffers before passing to _write?
      // this is here so that some node-core streams can optimize string
      // handling at a lower level.
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;

      // Crypto is kind of old and crusty.  Historically, its default string
      // encoding is 'binary' so we have to make this configurable.
      // Everything else in the universe uses 'utf8', though.
      this.defaultEncoding = options.defaultEncoding || 'utf8';

      // not an actual buffer we keep track of, but a measurement
      // of how much we're waiting to get pushed to some underlying
      // socket or file.
      this.length = 0;

      // a flag to see when we're in the middle of a write.
      this.writing = false;

      // a flag to be able to tell if the onwrite cb is called immediately,
      // or on a later tick.  We set this to true at first, becuase any
      // actions that shouldn't happen until "later" should generally also
      // not happen before the first write call.
      this.sync = true;

      // a flag to know if we're processing previously buffered items, which
      // may call the _write() callback in the same tick, so that we don't
      // end up in an overlapped onwrite situation.
      this.bufferProcessing = false;

      // the callback that's passed to _write(chunk,cb)
      this.onwrite = function(er) {
        onwrite(stream, er);
      };

      // the callback that the user supplies to write(chunk,encoding,cb)
      this.writecb = null;

      // the amount that is being written when _write is called.
      this.writelen = 0;

      this.buffer = [];

      // True if the error was already emitted and should not be thrown again
      this.errorEmitted = false;
    }

    function Writable(options) {
      var Duplex = require('./_stream_duplex');

      // Writable ctor is applied to Duplexes, though they're not
      // instanceof Writable, they're instanceof Readable.
      if (!(this instanceof Writable) && !(this instanceof Duplex))
        return new Writable(options);

      this._writableState = new WritableState(options, this);

      // legacy.
      this.writable = true;

      Stream.call(this);
    }

// Otherwise people can pipe Writable streams, which is just wrong.
    Writable.prototype.pipe = function() {
      this.emit('error', new Error('Cannot pipe. Not readable.'));
    };


    function writeAfterEnd(stream, state, cb) {
      var er = new Error('write after end');
      // TODO: defer error events consistently everywhere, not just the cb
      stream.emit('error', er);
      process.nextTick(function() {
        cb(er);
      });
    }

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      if (!Buffer.isBuffer(chunk) &&
        'string' !== typeof chunk &&
        chunk !== null &&
        chunk !== undefined &&
        !state.objectMode) {
        var er = new TypeError('Invalid non-string/buffer chunk');
        stream.emit('error', er);
        process.nextTick(function() {
          cb(er);
        });
        valid = false;
      }
      return valid;
    }

    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;

      if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }

      if (Buffer.isBuffer(chunk))
        encoding = 'buffer';
      else if (!encoding)
        encoding = state.defaultEncoding;

      if (typeof cb !== 'function')
        cb = function() {};

      if (state.ended)
        writeAfterEnd(this, state, cb);
      else if (validChunk(this, state, chunk, cb))
        ret = writeOrBuffer(this, state, chunk, encoding, cb);

      return ret;
    };

    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode &&
        state.decodeStrings !== false &&
        typeof chunk === 'string') {
        chunk = new Buffer(chunk, encoding);
      }
      return chunk;
    }

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
    function writeOrBuffer(stream, state, chunk, encoding, cb) {
      chunk = decodeChunk(state, chunk, encoding);
      if (Buffer.isBuffer(chunk))
        encoding = 'buffer';
      var len = state.objectMode ? 1 : chunk.length;

      state.length += len;

      var ret = state.length < state.highWaterMark;
      // we must ensure that previous needDrain will not be reset to false.
      if (!ret)
        state.needDrain = true;

      if (state.writing)
        state.buffer.push(new WriteReq(chunk, encoding, cb));
      else
        doWrite(stream, state, len, chunk, encoding, cb);

      return ret;
    }

    function doWrite(stream, state, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }

    function onwriteError(stream, state, sync, er, cb) {
      if (sync)
        process.nextTick(function() {
          cb(er);
        });
      else
        cb(er);

      stream._writableState.errorEmitted = true;
      stream.emit('error', er);
    }

    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }

    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;

      onwriteStateUpdate(state);

      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        // Check if we're actually ready to finish, but don't emit yet
        var finished = needFinish(stream, state);

        if (!finished && !state.bufferProcessing && state.buffer.length)
          clearBuffer(stream, state);

        if (sync) {
          process.nextTick(function() {
            afterWrite(stream, state, finished, cb);
          });
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }

    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      cb();
      if (finished)
        finishMaybe(stream, state);
    }

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit('drain');
      }
    }


// if there's something in the buffer waiting, then process it
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;

      for (var c = 0; c < state.buffer.length; c++) {
        var entry = state.buffer[c];
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;

        doWrite(stream, state, len, chunk, encoding, cb);

        // if we didn't call the onwrite immediately, then
        // it means that we need to wait until it does.
        // also, that means that the chunk and cb are currently
        // being processed, so move the buffer counter past them.
        if (state.writing) {
          c++;
          break;
        }
      }

      state.bufferProcessing = false;
      if (c < state.buffer.length)
        state.buffer = state.buffer.slice(c);
      else
        state.buffer.length = 0;
    }

    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error('not implemented'));
    };

    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;

      if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }

      if (typeof chunk !== 'undefined' && chunk !== null)
        this.write(chunk, encoding);

      // ignore unnecessary end() calls.
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };


    function needFinish(stream, state) {
      return (state.ending &&
        state.length === 0 &&
        !state.finished &&
        !state.writing);
    }

    function finishMaybe(stream, state) {
      var need = needFinish(stream, state);
      if (need) {
        state.finished = true;
        stream.emit('finish');
      }
      return need;
    }

    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once('finish', cb);
      }
      state.ended = true;
    }

  }).call(this,require("sycGbZ"))
},{"./_stream_duplex":57,"buffer":29,"core-util-is":62,"inherits":50,"stream":69,"sycGbZ":51}],62:[function(require,module,exports){
  (function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;

    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;

    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;

    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;

    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;

    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;

    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;

    function isError(e) {
      return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;

    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;

    function isPrimitive(arg) {
      return arg === null ||
        typeof arg === 'boolean' ||
        typeof arg === 'number' ||
        typeof arg === 'string' ||
        typeof arg === 'symbol' ||  // ES6 symbol
        typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;

    function isBuffer(arg) {
      return Buffer.isBuffer(arg);
    }
    exports.isBuffer = isBuffer;

    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }).call(this,require("buffer").Buffer)
},{"buffer":29}],63:[function(require,module,exports){
  module.exports = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

},{}],64:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  var Buffer = require('buffer').Buffer;

  var isBufferEncoding = Buffer.isEncoding
    || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
        default: return false;
      }
    }


  function assertEncoding(encoding) {
    if (encoding && !isBufferEncoding(encoding)) {
      throw new Error('Unknown encoding: ' + encoding);
    }
  }

  var StringDecoder = exports.StringDecoder = function(encoding) {
    this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
    assertEncoding(encoding);
    switch (this.encoding) {
      case 'utf8':
        // CESU-8 represents each of Surrogate Pair by 3-bytes
        this.surrogateSize = 3;
        break;
      case 'ucs2':
      case 'utf16le':
        // UTF-16 represents each of Surrogate Pair by 2-bytes
        this.surrogateSize = 2;
        this.detectIncompleteChar = utf16DetectIncompleteChar;
        break;
      case 'base64':
        // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
        this.surrogateSize = 3;
        this.detectIncompleteChar = base64DetectIncompleteChar;
        break;
      default:
        this.write = passThroughWrite;
        return;
    }

    this.charBuffer = new Buffer(6);
    this.charReceived = 0;
    this.charLength = 0;
  };


  StringDecoder.prototype.write = function(buffer) {
    var charStr = '';
    var offset = 0;

    // if our last write ended with an incomplete multibyte character
    while (this.charLength) {
      // determine how many remaining bytes this buffer has to offer for this char
      var i = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

      // add the new bytes to the char buffer
      buffer.copy(this.charBuffer, this.charReceived, offset, i);
      this.charReceived += (i - offset);
      offset = i;

      if (this.charReceived < this.charLength) {
        // still not enough chars in this buffer? wait for more ...
        return '';
      }

      // get the character that was split
      charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

      // lead surrogate (D800-DBFF) is also the incomplete character
      var charCode = charStr.charCodeAt(charStr.length - 1);
      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        this.charLength += this.surrogateSize;
        charStr = '';
        continue;
      }
      this.charReceived = this.charLength = 0;

      // if there are no more bytes in this buffer, just emit our char
      if (i == buffer.length) return charStr;

      // otherwise cut off the characters end from the beginning of this buffer
      buffer = buffer.slice(i, buffer.length);
      break;
    }

    var lenIncomplete = this.detectIncompleteChar(buffer);

    var end = buffer.length;
    if (this.charLength) {
      // buffer the incomplete character bytes we got
      buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
      this.charReceived = lenIncomplete;
      end -= lenIncomplete;
    }

    charStr += buffer.toString(this.encoding, 0, end);

    var end = charStr.length - 1;
    var charCode = charStr.charCodeAt(end);
    // lead surrogate (D800-DBFF) is also the incomplete character
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      var size = this.surrogateSize;
      this.charLength += size;
      this.charReceived += size;
      this.charBuffer.copy(this.charBuffer, size, 0, size);
      this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
      return charStr.substring(0, end);
    }

    // or just emit the charStr
    return charStr;
  };

  StringDecoder.prototype.detectIncompleteChar = function(buffer) {
    // determine how many bytes we have to check at the end of this buffer
    var i = (buffer.length >= 3) ? 3 : buffer.length;

    // Figure out if one of the last i bytes of our buffer announces an
    // incomplete char.
    for (; i > 0; i--) {
      var c = buffer[buffer.length - i];

      // See http://en.wikipedia.org/wiki/UTF-8#Description

      // 110XXXXX
      if (i == 1 && c >> 5 == 0x06) {
        this.charLength = 2;
        break;
      }

      // 1110XXXX
      if (i <= 2 && c >> 4 == 0x0E) {
        this.charLength = 3;
        break;
      }

      // 11110XXX
      if (i <= 3 && c >> 3 == 0x1E) {
        this.charLength = 4;
        break;
      }
    }

    return i;
  };

  StringDecoder.prototype.end = function(buffer) {
    var res = '';
    if (buffer && buffer.length)
      res = this.write(buffer);

    if (this.charReceived) {
      var cr = this.charReceived;
      var buf = this.charBuffer;
      var enc = this.encoding;
      res += buf.slice(0, cr).toString(enc);
    }

    return res;
  };

  function passThroughWrite(buffer) {
    return buffer.toString(this.encoding);
  }

  function utf16DetectIncompleteChar(buffer) {
    var incomplete = this.charReceived = buffer.length % 2;
    this.charLength = incomplete ? 2 : 0;
    return incomplete;
  }

  function base64DetectIncompleteChar(buffer) {
    var incomplete = this.charReceived = buffer.length % 3;
    this.charLength = incomplete ? 3 : 0;
    return incomplete;
  }

},{"buffer":29}],65:[function(require,module,exports){
  module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":58}],66:[function(require,module,exports){
  exports = module.exports = require('./lib/_stream_readable.js');
  exports.Readable = exports;
  exports.Writable = require('./lib/_stream_writable.js');
  exports.Duplex = require('./lib/_stream_duplex.js');
  exports.Transform = require('./lib/_stream_transform.js');
  exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":57,"./lib/_stream_passthrough.js":58,"./lib/_stream_readable.js":59,"./lib/_stream_transform.js":60,"./lib/_stream_writable.js":61}],67:[function(require,module,exports){
  module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":60}],68:[function(require,module,exports){
  module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":61}],69:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  module.exports = Stream;

  var EE = require('events').EventEmitter;
  var inherits = require('inherits');

  inherits(Stream, EE);
  Stream.Readable = require('readable-stream/readable.js');
  Stream.Writable = require('readable-stream/writable.js');
  Stream.Duplex = require('readable-stream/duplex.js');
  Stream.Transform = require('readable-stream/transform.js');
  Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
  Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

  function Stream() {
    EE.call(this);
  }

  Stream.prototype.pipe = function(dest, options) {
    var source = this;

    function ondata(chunk) {
      if (dest.writable) {
        if (false === dest.write(chunk) && source.pause) {
          source.pause();
        }
      }
    }

    source.on('data', ondata);

    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }

    dest.on('drain', ondrain);

    // If the 'end' option is not supplied, dest.end() will be called when
    // source gets the 'end' or 'close' events.  Only dest.end() once.
    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on('end', onend);
      source.on('close', onclose);
    }

    var didOnEnd = false;
    function onend() {
      if (didOnEnd) return;
      didOnEnd = true;

      dest.end();
    }


    function onclose() {
      if (didOnEnd) return;
      didOnEnd = true;

      if (typeof dest.destroy === 'function') dest.destroy();
    }

    // don't leave dangling pipes when there are errors.
    function onerror(er) {
      cleanup();
      if (EE.listenerCount(this, 'error') === 0) {
        throw er; // Unhandled stream error in pipe.
      }
    }

    source.on('error', onerror);
    dest.on('error', onerror);

    // remove all the event listeners that were added.
    function cleanup() {
      source.removeListener('data', ondata);
      dest.removeListener('drain', ondrain);

      source.removeListener('end', onend);
      source.removeListener('close', onclose);

      source.removeListener('error', onerror);
      dest.removeListener('error', onerror);

      source.removeListener('end', cleanup);
      source.removeListener('close', cleanup);

      dest.removeListener('close', cleanup);
    }

    source.on('end', cleanup);
    source.on('close', cleanup);

    dest.on('close', cleanup);

    dest.emit('pipe', source);

    // Allow for unix-like usage: A.pipe(B).pipe(C)
    return dest;
  };

},{"events":45,"inherits":50,"readable-stream/duplex.js":56,"readable-stream/passthrough.js":65,"readable-stream/readable.js":66,"readable-stream/transform.js":67,"readable-stream/writable.js":68}],70:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  var punycode = require('punycode');

  exports.parse = urlParse;
  exports.resolve = urlResolve;
  exports.resolveObject = urlResolveObject;
  exports.format = urlFormat;

  exports.Url = Url;

  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
  }

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
  var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

  // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

  // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
  // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
  // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
  // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && isObject(url) && url instanceof Url) return url;

    var u = new Url;
    u.parse(url, parseQueryString, slashesDenoteHost);
    return u;
  }

  Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
    if (!isString(url)) {
      throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
    }

    var rest = url;

    // trim before proceeding.
    // This is to support parse stuff like "  http://foo.com  \n"
    rest = rest.trim();

    var proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      this.protocol = lowerProto;
      rest = rest.substr(proto.length);
    }

    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        this.slashes = true;
      }
    }

    if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      //
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the last @ sign, unless some host-ending character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      //
      // ex:
      // http://a@b@c/ => user:a@b host:c
      // http://a@b?@c => user:a host:c path:/?@c

      // v0.12 TODO(isaacs): This is not quite how Chrome does things.
      // Review our test case against browsers more comprehensively.

      // find the first instance of any hostEndingChars
      var hostEnd = -1;
      for (var i = 0; i < hostEndingChars.length; i++) {
        var hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }

      // at this point, either we have an explicit point where the
      // auth portion cannot go past, or the last @ char is the decider.
      var auth, atSign;
      if (hostEnd === -1) {
        // atSign can be anywhere.
        atSign = rest.lastIndexOf('@');
      } else {
        // atSign must be in auth portion.
        // http://a@b/c@d => host:b auth:a path:/c@d
        atSign = rest.lastIndexOf('@', hostEnd);
      }

      // Now we have a portion which is definitely the auth.
      // Pull that off.
      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        this.auth = decodeURIComponent(auth);
      }

      // the host is the remaining to the left of the first non-host char
      hostEnd = -1;
      for (var i = 0; i < nonHostChars.length; i++) {
        var hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }
      // if we still have not hit it, then the entire thing is a host.
      if (hostEnd === -1)
        hostEnd = rest.length;

      this.host = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd);

      // pull out port.
      this.parseHost();

      // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.
      this.hostname = this.hostname || '';

      // if hostname begins with [ and ends with ]
      // assume that it's an IPv6 address.
      var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

      // validate a little.
      if (!ipv6Hostname) {
        var hostparts = this.hostname.split(/\./);
        for (var i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;
          if (!part.match(hostnamePartPattern)) {
            var newpart = '';
            for (var j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                // we replace non-ASCII char with a temporary placeholder
                // we need this to make sure size of hostname is not
                // broken by replacing non-ASCII by nothing
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            }
            // we test again with ASCII char only
            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);
              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }
              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }
              this.hostname = validParts.join('.');
              break;
            }
          }
        }
      }

      if (this.hostname.length > hostnameMaxLen) {
        this.hostname = '';
      } else {
        // hostnames are always lower case.
        this.hostname = this.hostname.toLowerCase();
      }

      if (!ipv6Hostname) {
        // IDNA Support: Returns a puny coded representation of "domain".
        // It only converts the part of the domain name that
        // has non ASCII characters. I.e. it dosent matter if
        // you call it with a domain that already is in ASCII.
        var domainArray = this.hostname.split('.');
        var newOut = [];
        for (var i = 0; i < domainArray.length; ++i) {
          var s = domainArray[i];
          newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
        }
        this.hostname = newOut.join('.');
      }

      var p = this.port ? ':' + this.port : '';
      var h = this.hostname || '';
      this.host = h + p;
      this.href += this.host;

      // strip [ and ] from the hostname
      // the host field still retains them, though
      if (ipv6Hostname) {
        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        if (rest[0] !== '/') {
          rest = '/' + rest;
        }
      }
    }

    // now rest is set to the post-host stuff.
    // chop off any delim chars.
    if (!unsafeProtocol[lowerProto]) {

      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (var i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        var esc = encodeURIComponent(ae);
        if (esc === ae) {
          esc = escape(ae);
        }
        rest = rest.split(ae).join(esc);
      }
    }


    // chop off from the tail first.
    var hash = rest.indexOf('#');
    if (hash !== -1) {
      // got a fragment string.
      this.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf('?');
    if (qm !== -1) {
      this.search = rest.substr(qm);
      this.query = rest.substr(qm + 1);
      if (parseQueryString) {
        this.query = querystring.parse(this.query);
      }
      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      this.search = '';
      this.query = {};
    }
    if (rest) this.pathname = rest;
    if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
      this.pathname = '/';
    }

    //to support http.request
    if (this.pathname || this.search) {
      var p = this.pathname || '';
      var s = this.search || '';
      this.path = p + s;
    }

    // finally, reconstruct the href based on what has been validated.
    this.href = this.format();
    return this;
  };

// format a parsed object into a url string
  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (isString(obj)) obj = urlParse(obj);
    if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
    return obj.format();
  }

  Url.prototype.format = function() {
    var auth = this.auth || '';
    if (auth) {
      auth = encodeURIComponent(auth);
      auth = auth.replace(/%3A/i, ':');
      auth += '@';
    }

    var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

    if (this.host) {
      host = auth + this.host;
    } else if (this.hostname) {
      host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
      if (this.port) {
        host += ':' + this.port;
      }
    }

    if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
      query = querystring.stringify(this.query);
    }

    var search = this.search || (query && ('?' + query)) || '';

    if (protocol && protocol.substr(-1) !== ':') protocol += ':';

    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.
    if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }

    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;

    pathname = pathname.replace(/[?#]/g, function(match) {
      return encodeURIComponent(match);
    });
    search = search.replace('#', '%23');

    return protocol + host + pathname + search + hash;
  };

  function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
  }

  Url.prototype.resolve = function(relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
  };

  function urlResolveObject(source, relative) {
    if (!source) return relative;
    return urlParse(source, false, true).resolveObject(relative);
  }

  Url.prototype.resolveObject = function(relative) {
    if (isString(relative)) {
      var rel = new Url();
      rel.parse(relative, false, true);
      relative = rel;
    }

    var result = new Url();
    Object.keys(this).forEach(function(k) {
      result[k] = this[k];
    }, this);

    // hash is always overridden, no matter what.
    // even href="" will remove it.
    result.hash = relative.hash;

    // if the relative url is empty, then there's nothing left to do here.
    if (relative.href === '') {
      result.href = result.format();
      return result;
    }

    // hrefs like //foo/bar always cut to the protocol.
    if (relative.slashes && !relative.protocol) {
      // take everything except the protocol from relative
      Object.keys(relative).forEach(function(k) {
        if (k !== 'protocol')
          result[k] = relative[k];
      });

      //urlParse appends trailing / to urls like http://www.example.com
      if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
        result.path = result.pathname = '/';
      }

      result.href = result.format();
      return result;
    }

    if (relative.protocol && relative.protocol !== result.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
      if (!slashedProtocol[relative.protocol]) {
        Object.keys(relative).forEach(function(k) {
          result[k] = relative[k];
        });
        result.href = result.format();
        return result;
      }

      result.protocol = relative.protocol;
      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');
        while (relPath.length && !(relative.host = relPath.shift()));
        if (!relative.host) relative.host = '';
        if (!relative.hostname) relative.hostname = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        result.pathname = relPath.join('/');
      } else {
        result.pathname = relative.pathname;
      }
      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || '';
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port;
      // to support http.request
      if (result.pathname || result.search) {
        var p = result.pathname || '';
        var s = result.search || '';
        result.path = p + s;
      }
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }

    var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
        relative.host ||
        relative.pathname && relative.pathname.charAt(0) === '/'
        ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
        (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

    // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // result.protocol has already been set by now.
    // Later on, put the first path part into the host field.
    if (psychotic) {
      result.hostname = '';
      result.port = null;
      if (result.host) {
        if (srcPath[0] === '') srcPath[0] = result.host;
        else srcPath.unshift(result.host);
      }
      result.host = '';
      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;
        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;
          else relPath.unshift(relative.host);
        }
        relative.host = null;
      }
      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }

    if (isRelAbs) {
      // it's absolute.
      result.host = (relative.host || relative.host === '') ?
        relative.host : result.host;
      result.hostname = (relative.hostname || relative.hostname === '') ?
        relative.hostname : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath;
      // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!isNullOrUndefined(relative.search)) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        result.hostname = result.host = srcPath.shift();
        //occationaly the auth can get stuck only in host
        //this especialy happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ?
          result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      result.search = relative.search;
      result.query = relative.query;
      //to support http.request
      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
          (result.search ? result.search : '');
      }
      result.href = result.format();
      return result;
    }

    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      result.pathname = null;
      //to support http.request
      if (result.search) {
        result.path = '/' + result.search;
      } else {
        result.path = null;
      }
      result.href = result.format();
      return result;
    }

    // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.
    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

    // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];
      if (last == '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }

    if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }

    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
      srcPath.push('');
    }

    var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

    // put the host back
    if (psychotic) {
      result.hostname = result.host = isAbsolute ? '' :
        srcPath.length ? srcPath.shift() : '';
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
        result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }

    mustEndAbs = mustEndAbs || (result.host && srcPath.length);

    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }

    if (!srcPath.length) {
      result.pathname = null;
      result.path = null;
    } else {
      result.pathname = srcPath.join('/');
    }

    //to support request.http
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
        (result.search ? result.search : '');
    }
    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  };

  Url.prototype.parseHost = function() {
    var host = this.host;
    var port = portPattern.exec(host);
    if (port) {
      port = port[0];
      if (port !== ':') {
        this.port = port.substr(1);
      }
      host = host.substr(0, host.length - port.length);
    }
    if (host) this.hostname = host;
  };

  function isString(arg) {
    return typeof arg === "string";
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isNull(arg) {
    return arg === null;
  }
  function isNullOrUndefined(arg) {
    return  arg == null;
  }

},{"punycode":52,"querystring":55}],71:[function(require,module,exports){
  module.exports = function isBuffer(arg) {
    return arg && typeof arg === 'object'
      && typeof arg.copy === 'function'
      && typeof arg.fill === 'function'
      && typeof arg.readUInt8 === 'function';
  }
},{}],72:[function(require,module,exports){
  (function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }

      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      // Allow for deprecating things in the process of starting up.
      if (isUndefined(global.process)) {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }

      if (process.noDeprecation === true) {
        return fn;
      }

      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }

      return deprecated;
    };


    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || '';
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };


    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };

// Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };


    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];

      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
          '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }


    function stylizeNoColor(str, styleType) {
      return str;
    }


    function arrayToHash(array) {
      var hash = {};

      array.forEach(function(val, idx) {
        hash[val] = true;
      });

      return hash;
    }


    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }

      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }

      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);

      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }

      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }

      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }

      var base = '', array = false, braces = ['{', '}'];

      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }

      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }

      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }

      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }

      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }

      ctx.seen.push(value);

      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }

      ctx.seen.pop();

      return reduceToSingleString(output, base, braces);
    }


    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
          .replace(/'/g, "\\'")
          .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }


    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }


    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            key, true));
        }
      });
      return output;
    }


    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
            .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    }


    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf('\n') >= 0) numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);

      if (length > 60) {
        return braces[0] +
          (base === '' ? '' : base + '\n ') +
          ' ' +
          output.join(',\n  ') +
          ' ' +
          braces[1];
      }

      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;

    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;

    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;

    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;

    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;

    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;

    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;

    function isError(e) {
      return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;

    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;

    function isPrimitive(arg) {
      return arg === null ||
        typeof arg === 'boolean' ||
        typeof arg === 'number' ||
        typeof arg === 'string' ||
        typeof arg === 'symbol' ||  // ES6 symbol
        typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;

    exports.isBuffer = require('./support/isBuffer');

    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }


    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }


// log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = require('inherits');

    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;

      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };

    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

  }).call(this,require("sycGbZ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":71,"inherits":50,"sycGbZ":51}]},{},[1])

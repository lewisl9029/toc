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
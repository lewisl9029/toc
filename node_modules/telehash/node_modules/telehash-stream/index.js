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
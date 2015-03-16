var path = require("path");
var th = require("telehash");
var seeds = require("./seeds.json");
th.debug(console.log);
th.init({id:path.resolve("server.json"),seeds:seeds},function(err,self){
  if(err) return console.log(err);
  require("./index.js").install(self);
  self.thtp.listen(function(req,cbRes){
    console.log(req.method,req.path,req.headers);
    if(req.path == "/foobar") return cbRes().end("foobar");
    if(req.path == "/stdin") return process.stdin.pipe(cbRes());
    cbRes({status:200,body:req.path});
  });
  console.log("listening at thtp://"+self.hashname+"/")
})
var path = require("path");
var th = require("telehash");
//th.debug(console.log);
th.init({id:path.resolve("client.json"),seeds:path.resolve("seeds.json")},function(err,self){
  if(err) return console.log(err);
  require("./index.js").install(self);
  self.thtp.request(process.argv[2],function(err,res){
    console.log("got response",err,res&&res.status);
  }).on("end",process.exit).pipe(process.stdout);
})
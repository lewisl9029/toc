var path = require("path");
var th = require("telehash");
//th.debug(console.log);
th.init({id:path.resolve("token.json"),seeds:path.resolve("seeds.json")},function(err,self){
  if(err) return console.log(err);
  require("./index.js").install(self);
  self.dispense(process.argv[2],function(err,from){
    if(err) return console.log("error dispensing",err);
    console.log("dispensed from",from.hashname);
  });
})
var path = require("path");
var th = require("telehash");
var seeds = require("./seeds.json");
//th.debug(console.log);
th.init({id:path.resolve("dispense.json"),seeds:seeds},function(err,self){
  if(err) return console.log(err);
  require("./index.js").install(self);
  console.log(self.token(function(from){
    console.log("dispensed to",from.hashname);
  }));
});
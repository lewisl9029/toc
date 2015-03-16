var path = require("path");
var th = require("telehash");
//th.debug(console.log);

var express = require("express");
var app = express();

app.get('/hello.txt', function(req, res){
  res.end('Hello World\n');
});

var server = app.listen(0, function() {
  th.init({id:path.resolve("server.json"),seeds:path.resolve("seeds.json")},function(err,self){
    if(err) return console.log(err);
    require("./index.js").install(self);
    self.thtp.proxy(server.address());
    console.log("listening at thtp://"+self.hashname+"/")
  })
});


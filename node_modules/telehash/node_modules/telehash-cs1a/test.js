//var cs1a = require("./browser.js");
var cs1a = require("./node.js");

// dummy functions
cs1a.install({pdecode:function(){console.log("pdecode",arguments);return {}},pencode:function(){console.log("pencode",arguments);return new Buffer(0)}});

var a = {parts:{}};
var b = {parts:{}};
cs1a.genkey(a,function(){
  console.log("genkey",a);
  cs1a.genkey(b,function(){
    console.log("genkey",b);
    var id = {cs:{"1a":{}}};
    cs1a.loadkey(id.cs["1a"],a["1a"],a["1a_secret"]);
    var to = {};
    cs1a.loadkey(to,b["1a"]);
    console.log(id,to);
    var open = cs1a.openize(id,to,{});
    console.log("opened",open);
  });
});

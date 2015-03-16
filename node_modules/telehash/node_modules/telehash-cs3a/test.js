//var cs = require("./browser.js");
var cs = require("./node.js");

// dummy functions
cs.install({CSets:{},pdecode:function(){console.log("pdecode",arguments);return {}},pencode:function(){console.log("pencode",arguments);return new Buffer(1)}});

var a = {parts:{}};
var b = {parts:{}};
cs.genkey(a,function(){
  console.log("genkey",a);
  cs.genkey(b,function(){
    console.log("genkey",b);
    var id = {cs:{"3a":{}}};
    cs.loadkey(id.cs["3a"],a["3a"],a["3a_secret"]);
    var to = {lineOut:"00"};
    cs.loadkey(to,b["3a"]);
    console.log(id,to);
    var open = cs.openize(id,to,{});
    console.log("opened",open);
  });
});

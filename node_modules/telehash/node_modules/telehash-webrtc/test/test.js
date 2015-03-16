// TODO, figure out how to use the background browser testing stuff based on other webrtc modules?
var telehash = require("telehash");
telehash.log({debug:function(){console.log.apply(console, arguments);}});
var webrtc = require("../browser.js");
telehash.add(webrtc);
telehash.load({id:'test'}, function(err, mesh){
  if(err) return console.log(err);
  window.mesh = mesh; // for dev console
  console.log("mesh loaded",mesh.hashname);
  console.log("paths",JSON.stringify(mesh.paths()));
  mesh.accept = mesh.link; // auto-accept
  mesh.discover(true); // tries default local router
});

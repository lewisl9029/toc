try{
  var wrtc = require('wrtc');
}catch(E){
  
}

exports.name = 'webrtc';

exports.mesh = function(mesh, cbExt)
{
//  console.log("not supported for node yet");
  cbExt();
}
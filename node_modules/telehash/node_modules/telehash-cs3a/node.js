try{
  var sodium = require("sodium").api;
  var cs3a = require("./cs3a.js");
  cs3a.crypt(sodium);

  Object.keys(cs3a).forEach(function(f){ exports[f] = cs3a[f];});  
}catch(E){
  exports.install = function(){
    console.log("CS3a failed to load",E);    
  }
}


// load common module
exports = module.exports = require('./cs3a.js');

// try compiled sodium, fall back to pure js one (TODO)
try{
  if(process.env.PURE == 'true') throw new Error("pure requested");
  var sodium = require("sodium").api;
  // load node-specific crypto methods
  exports.crypt(sodium);
}catch(E){
  console.log("CS3a failed to load (TODO use tweetnacl.js?):",E);
}

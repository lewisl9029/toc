/* */ 
var composeP = require("./composeP");
var reverse = require("./reverse");
module.exports = function pipeP() {
  return composeP.apply(this, reverse(arguments));
};

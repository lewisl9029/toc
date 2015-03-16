/* */ 
var compose = require("./compose");
var reverse = require("./reverse");
module.exports = function pipe() {
  return compose.apply(this, reverse(arguments));
};

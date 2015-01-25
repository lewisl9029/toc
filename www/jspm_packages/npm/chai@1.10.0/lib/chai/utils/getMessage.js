/* */ 
var flag = require("./flag"),
    getActual = require("./getActual"),
    inspect = require("./inspect"),
    objDisplay = require("./objDisplay");
module.exports = function(obj, args) {
  var negate = flag(obj, 'negate'),
      val = flag(obj, 'object'),
      expected = args[3],
      actual = getActual(obj, args),
      msg = negate ? args[2] : args[1],
      flagMsg = flag(obj, 'message');
  if (typeof msg === "function")
    msg = msg();
  msg = msg || '';
  msg = msg.replace(/#{this}/g, objDisplay(val)).replace(/#{act}/g, objDisplay(actual)).replace(/#{exp}/g, objDisplay(expected));
  return flagMsg ? flagMsg + ': ' + msg : msg;
};

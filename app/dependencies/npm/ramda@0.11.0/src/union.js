/* */ 
var _concat = require("./internal/_concat");
var _curry2 = require("./internal/_curry2");
var compose = require("./compose");
var uniq = require("./uniq");
module.exports = _curry2(compose(uniq, _concat));

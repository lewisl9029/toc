/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function eq(a, b) {
  if (a === 0) {
    return 1 / a === 1 / b;
  } else {
    return a === b || (a !== a && b !== b);
  }
});

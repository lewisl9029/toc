/* */ 
var g = typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : this;
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;
var oldRuntime = hadRuntime && g.regeneratorRuntime;
delete g.regeneratorRuntime;
module.exports = require("./runtime");
if (hadRuntime) {
  g.regeneratorRuntime = oldRuntime;
} else {
  delete g.regeneratorRuntime;
}
module.exports = {
  "default": module.exports,
  __esModule: true
};

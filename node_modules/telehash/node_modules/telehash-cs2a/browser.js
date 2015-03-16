var cs2a = require("./cs2a.js");
var ecc = require("ecc-jsbn");
require("./forge.min.js"); // PITA not browserify compat
cs2a.crypt(ecc,forge);

Object.keys(cs2a).forEach(function(f){ exports[f] = cs2a[f]; });


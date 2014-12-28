var fs = require('../');
var constants = require('constants');

exports.perms = function(path) {
  var pmask = constants.S_IRWXU
            | constants.S_IRWXG
            | constants.S_IRWXO;
            
  var stats = fs.statSync(path);
  return stats.mode & pmask; 
};

exports.reset = function() {
  for (var key in localStorage) {
    if (!key.match(/^testfs/)) continue;
    if (key === 'testfs:///') {
      localStorage.setItem(key, '');
    }
    else if (key !== 'testfs-meta:///') {
      localStorage.removeItem(key);
    }
  }
};

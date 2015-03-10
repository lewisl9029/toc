var CleanCSS = require('clean-css');
var fs = require('fs');
var path = require('path');

function escape(source) {
  return source
    .replace(/(["\\])/g, '\\$1')
    .replace(/[\f]/g, "\\f")
    .replace(/[\b]/g, "\\b")
    .replace(/[\n]/g, "\\n")
    .replace(/[\t]/g, "\\t")
    .replace(/[\r]/g, "\\r")
    .replace(/[\u2028]/g, "\\u2028")
    .replace(/[\u2029]/g, "\\u2029");
}

var cssInject = "(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})";

module.exports = function bundle(loads, opts) {
  var stubDefines = loads.map(function(load) {
    return "System\.register('" + load.name + "', [], false, function() {});";
  }).join('\n');

  var cssOutput = loads.map(function(load) {
    return new CleanCSS({
      target: this.separateCSS ? opts.outFile : '.',
      relativeTo: path.dirname(load.address.substring('file:'.length)),
    }).minify(load.source).styles;
  }).reduce(function(s1, s2) {
    return s1 + s2;
  }, '');

  // write a separate CSS file if necessary
  if (this.separateCSS) {
    fs.writeFileSync(opts.outFile.replace(/\.js$/, '.css'), cssOutput);
    return stubDefines;
  }

  return [stubDefines, cssInject, '("' + escape(cssOutput) + '");'].join('\n');
}

/* */ 
var fs = require("fs");
code = fs.readFileSync('./tv4.min.js', {encoding: 'utf-8'});
var props = code.match(/\.[a-zA-Z0-9]+[\.\(\[]/g);
var groups = {
  'validate*': /^validate/,
  'scanned*': /^scanned/,
  '*knownPropertyPaths': /knownPropertyPaths$/
};
var propertyNames = {};
props.forEach(function(entry) {
  var propName = entry.substring(1, entry.length - 1);
  var propGroup = propName;
  for (var key in groups) {
    if (groups[key].test(propName)) {
      propGroup = key;
      break;
    }
  }
  if (typeof propertyNames[propGroup] !== 'number')
    propertyNames[propGroup] = 0;
  propertyNames[propGroup] += propName.length - 1;
});
var props = Object.keys(propertyNames);
props.sort(function(a, b) {
  return propertyNames[b] - propertyNames[a];
});
props.forEach(function(prop) {
  var length = propertyNames[prop];
  prop = Array(50).join(' ') + prop;
  prop = prop.substring(prop.length - 30);
  console.log(prop + ': ' + length + ' (' + Math.round(length / code.length * 10000) / 100 + "%)");
});

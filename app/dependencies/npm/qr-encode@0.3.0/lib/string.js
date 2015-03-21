/* */ 
var stringToBytes = function(s) {
  var bytes = new Array()
  for (var i = 0; i < s.length; i += 1) {
    var c = s.charCodeAt(i)
    bytes.push(c & 0xff)
  }
  return bytes
}

module.exports = {
  stringToBytes: stringToBytes
}

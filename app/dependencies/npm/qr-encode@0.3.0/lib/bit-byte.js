/* */ 
var QRMode = require("./constants").QRMode;
var string = require("./string");
var qr8BitByte = function(data) {
  var _mode = QRMode.MODE_8BIT_BYTE;
  var _data = data;
  var _bytes = string.stringToBytes(data);
  var _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _bytes.length;
  };
  _this.write = function(buffer) {
    for (var i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };
  return _this;
};
module.exports = qr8BitByte;

/* */ 
  var byteArrayOutputStream = function() {

  var _bytes = new Array()

  var _this = {}

  _this.writeByte = function(b) {
    _bytes.push(b & 0xff)
  }

  _this.writeShort = function(i) {
    _this.writeByte(i)
    _this.writeByte(i >>> 8)
  }

  _this.writeBytes = function(b, off, len) {
    off = off || 0
    len = len || b.length
    for (var i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off])
    }
  }

  _this.writeString = function(s) {
    for (var i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i) )
    }
  }

  _this.toByteArray = function() {
    return _bytes
  }

  return _this
}

module.exports = byteArrayOutputStream


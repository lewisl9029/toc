/* */ 
var byteArrayOutputStream = require("./byte-array");
var gifImage = function(width, height) {
  var _width = width;
  var _height = height;
  var _data = new Array(width * height);
  var _this = {};
  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };
  _this.write = function(out) {
    out.writeString('GIF87a');
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0x80);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeString(',');
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    var lzwMinCodeSize = 2;
    var raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    var offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0x00);
    out.writeString(';');
  };
  var bitOutputStream = function(out) {
    var _out = out;
    var _bitLength = 0;
    var _bitBuffer = 0;
    var _this = {};
    _this.write = function(data, length) {
      if ((data >>> length) != 0) {
        throw new Error('length over');
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(0xff & ((data << _bitLength) | _bitBuffer));
        length -= (8 - _bitLength);
        data >>>= (8 - _bitLength);
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = (data << _bitLength) | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this;
  };
  var getLZWRaster = function(lzwMinCodeSize) {
    var clearCode = 1 << lzwMinCodeSize;
    var endCode = (1 << lzwMinCodeSize) + 1;
    var bitLength = lzwMinCodeSize + 1;
    var table = lzwTable();
    for (var i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    var byteOut = byteArrayOutputStream();
    var bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    var dataIndex = 0;
    var s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      var c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);
        if (table.size() < 0xfff) {
          if (table.size() == (1 << bitLength)) {
            bitLength += 1;
          }
          table.add(s + c);
        }
        s = c;
      }
    }
    bitOut.write(table.indexOf(s), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  var lzwTable = function() {
    var _map = {};
    var _size = 0;
    var _this = {};
    _this.add = function(key) {
      if (_this.contains(key)) {
        throw new Error('dup key:' + key);
      }
      _map[key] = _size;
      _size += 1;
    };
    _this.size = function() {
      return _size;
    };
    _this.indexOf = function(key) {
      return _map[key];
    };
    _this.contains = function(key) {
      return typeof _map[key] != 'undefined';
    };
    return _this;
  };
  return _this;
};
module.exports = gifImage;

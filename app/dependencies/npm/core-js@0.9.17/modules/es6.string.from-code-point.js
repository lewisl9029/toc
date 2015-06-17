/* */ 
var $def = require("./$.def"),
    toIndex = require("./$").toIndex,
    fromCharCode = String.fromCharCode,
    $fromCodePoint = String.fromCodePoint;
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {fromCodePoint: function fromCodePoint(x) {
    var res = [],
        len = arguments.length,
        i = 0,
        code;
    while (len > i) {
      code = +arguments[i++];
      if (toIndex(code, 0x10ffff) !== code)
        throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }
    return res.join('');
  }});

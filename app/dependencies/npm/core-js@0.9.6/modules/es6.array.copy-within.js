/* */ 
'use strict';
var $ = require("./$"),
    $def = require("./$.def"),
    toIndex = $.toIndex;
$def($def.P, 'Array', {copyWithin: function copyWithin(target, start) {
    var O = Object($.assertDefined(this)),
        len = $.toLength(O.length),
        to = toIndex(target, len),
        from = toIndex(start, len),
        end = arguments[2],
        fin = end === undefined ? len : toIndex(end, len),
        count = Math.min(fin - from, len - to),
        inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from = from + count - 1;
      to = to + count - 1;
    }
    while (count-- > 0) {
      if (from in O)
        O[to] = O[from];
      else
        delete O[to];
      to += inc;
      from += inc;
    }
    return O;
  }});
require("./$.unscope")('copyWithin');

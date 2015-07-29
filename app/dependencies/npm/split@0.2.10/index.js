/* */ 
var through = require("through");
var Decoder = require("string_decoder").StringDecoder;
module.exports = split;
function split(matcher, mapper) {
  var decoder = new Decoder();
  var soFar = '';
  if ('function' === typeof matcher)
    mapper = matcher, matcher = null;
  if (!matcher)
    matcher = /\r?\n/;
  function emit(stream, piece) {
    if (mapper) {
      try {
        piece = mapper(piece);
      } catch (err) {
        return stream.emit('error', err);
      }
      if ('undefined' !== typeof piece)
        stream.queue(piece);
    } else
      stream.queue(piece);
  }
  function next(stream, buffer) {
    var pieces = (soFar + buffer).split(matcher);
    soFar = pieces.pop();
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      emit(stream, piece);
    }
  }
  return through(function(b) {
    next(this, decoder.write(b));
  }, function() {
    if (decoder.end)
      next(this, decoder.end());
    if (soFar != null)
      emit(this, soFar);
    this.queue(null);
  });
}

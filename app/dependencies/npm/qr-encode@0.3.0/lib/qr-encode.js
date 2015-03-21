/* */ 
var qrcode = require("./qr");
function QR(text, opts) {
  text = text || '';
  opts = opts || {};
  var type = opts.type || 4;
  var level = opts.level || 'L';
  var size = opts.size || 4;
  var margin = opts.margin || 0;
  var qr = qrcode(type, level);
  qr.addData(text);
  qr.make();
  return qr.createImgSrc(size, margin);
}
QR.prototype.level = function(level) {
  this._level = level;
  return this;
};
module.exports = QR;

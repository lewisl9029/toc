var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('unlink file', function(t) {
  t.plan(3);
  
  fs.writeFileSync('foo', 'bar');
  fs.unlinkSync('foo');
  t.notOk(fs.existsSync('foo'));
  util.reset();

  fs.writeFileSync('foo', 'bar');
  fs.unlink('foo', function(err) {
    t.error(err);
    t.notOk(fs.existsSync('foo'));
    util.reset();
  });
});

test('unlink directory', function(t) {
  t.plan(2);
  
  fs.mkdirSync('a');
  try {
    fs.unlinkSync('a');
  } catch (err) {
    t.equal(err.code, 'EPERM');
  }
  
  fs.unlink('a', function(err) {
    t.equal(err.code, 'EPERM');
    util.reset();
  });
});

test('unlink not existing file', function(t) {
  t.plan(2);
  
  try {
    fs.unlinkSync('foo');
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }

  fs.unlink('foo', function(err) {
    t.equal(err.code, 'ENOENT');
  });
});

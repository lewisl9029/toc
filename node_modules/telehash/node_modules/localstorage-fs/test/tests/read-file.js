var test = require('tape');
var fs = require('../../');
var util = require('../util');
var Buffer = global.Buffer || require('buffer').Buffer;

test('read simple', function(t) {
  t.plan(5);

  fs.writeFileSync('foo', 'bar');
  
  var data = fs.readFileSync('foo');
  t.ok(Buffer.isBuffer(data));
  t.equal(data.toString(), 'bar');
  
  fs.readFile('foo', function(err, data) {
    t.error(err);
    t.ok(Buffer.isBuffer(data));
    t.equal(data.toString(), 'bar');
    util.reset();
  });
});

test('read non-existent', function(t) {
  t.plan(2);
  
  try {
    fs.readFileSync('foo');
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }
  
  fs.readFile('foo', function(err, data) {
    t.equal(err.code, 'ENOENT');
  });
});

test('read non-existent, bad flag', function(t) {
  t.plan(2);
  
  try {
    fs.readFileSync('foo', { flag: 'w' });
  } catch (err) {
    t.equal(err.code, 'EBADF');
  }
  
  fs.readFile('foo', { flag: 'w' }, function(err, data) {
    t.equal(err.code, 'EBADF');
  });
});

test('read non-existent, good flag', function(t) {
  t.plan(5);
  
  var data = fs.readFileSync('foo', { flag: 'w+' });
  t.ok(fs.existsSync('foo'));
  t.equal(data.toString(), '');
  util.reset();
  
  fs.readFile('foo', { flag: 'w+' }, function(err, data) {
    t.error(err);
    t.ok(fs.existsSync('foo'));
    t.equal(data.toString(), '');
    util.reset();
  });
});

test('read encoding', function (t) {
  t.plan(5);

  fs.writeFileSync('foo', 'bar');
  var data = fs.readFileSync('foo', 'utf8');
  t.notOk(Buffer.isBuffer(data));
  t.equal(data, 'bar');
  util.reset();

  fs.writeFileSync('foo', 'bar');
  fs.readFile('foo', 'utf8', function (err, data) {
    t.error(err);
    t.notOk(Buffer.isBuffer(data));
    t.equal(data, 'bar');
    util.reset();
  });
});

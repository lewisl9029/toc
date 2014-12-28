var test = require('tape');
var fs = require('../../');
var util = require('../util');
var Buffer = global.Buffer || require('buffer').Buffer;

test('write simple', function(t) {
  t.plan(3);

  fs.writeFileSync('foo', 'bar');
  
  var data = fs.readFileSync('foo');
  t.equal(data.toString(), 'bar');
  util.reset();
  
  fs.writeFile('foo', 'bar', function(err) {
    t.error(err);
    t.equal(fs.readFileSync('foo').toString(), 'bar');
    util.reset();
  });
});

test('write replace', function(t) {
  t.plan(4);

  fs.writeFileSync('foo', 'bar');
  fs.writeFileSync('foo', 'baz');
  t.equal(fs.readFileSync('foo').toString(), 'baz');
  util.reset();
  
  fs.writeFile('foo', 'bar', function(err) {
    t.error(err);
    fs.writeFile('foo', 'baz', function(err) {
      t.error(err);
      t.equal(fs.readFileSync('foo').toString(), 'baz');
      util.reset();
    });
  });
});

test('write encoding', function (t) {
  t.plan(3);
  
  var b64encoded = Buffer('bar').toString('base64');
  
  fs.writeFileSync('foo', b64encoded, 'base64');
  t.equal(fs.readFileSync('foo').toString(), 'bar');
  util.reset();

  fs.writeFile('foo', b64encoded, 'base64', function (err, data) {
    t.error(err);
    t.equal(fs.readFileSync('foo').toString(), 'bar');
    util.reset();
  });
});

test('write bad flag', function(t) {
  t.plan(2);
  
  try {
    fs.writeFileSync('foo', 'bar', { flag: 'r' });
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }
  
  fs.writeFile('foo', 'bar', { flag: 'r' }, function(err) {
    t.equal(err.code, 'ENOENT');
  });
});

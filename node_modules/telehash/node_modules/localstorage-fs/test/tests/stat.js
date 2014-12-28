var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('stat non-existent', function (t) {
  t.plan(2);

  try {
    fs.statSync('foo');
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }

  fs.stat('foo', function (err) {
    t.equal(err.code, 'ENOENT');
  });
});

test('stat file', function (t) {
  t.plan(3);
  
  fs.writeFileSync('foo', 'bar');
  
  var stats = fs.statSync('foo');
  t.ok(stats.isFile());

  fs.stat('foo', function (err, stats) {
    t.error(err);
    t.ok(stats.isFile());
    util.reset();
  });
});

test('stat directory', function (t) {
  t.plan(3);
  
  fs.mkdirSync('a');
  
  var stats = fs.statSync('a');
  t.ok(stats.isDirectory());
  
  fs.stat('a', function(err, stats) {
    t.error(err);
    t.ok(stats.isDirectory());
    util.reset();
  });
});

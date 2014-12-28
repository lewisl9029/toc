var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('exists', function(t) {
  t.plan(2);

  fs.writeFileSync('foo', 'bar');
  
  t.ok(fs.existsSync('foo'));
  
  fs.exists('foo', function(exists) {
    t.ok(exists);
    util.reset();
  });
});

test('exists non-existent', function(t) {
  t.plan(2);
  
  t.notOk(fs.existsSync('foo'));
  
  fs.exists('foo', function(exists) {
    t.notOk(exists);
  });
});

test('exists directory', function(t) {
  t.plan(2);

  fs.mkdirSync('a');
  t.ok(fs.existsSync('a'));

  fs.exists('a', function(exists) {
    t.ok(exists);
    util.reset();
  });
});

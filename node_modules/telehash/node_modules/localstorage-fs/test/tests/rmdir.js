var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('rmdir', function(t) {
  t.plan(3);

  fs.mkdirSync('a');
  fs.rmdirSync('a');
  t.notOk(fs.existsSync('a'));
  util.reset();
  
  fs.mkdirSync('a');
  fs.rmdir('a', function(err) {
    t.error(err);
    t.notOk(fs.existsSync('a'));
    util.reset();
  });
});

test('rmdir non-existant', function(t) {
  t.plan(2);
  
  try {
    fs.rmdirSync('a');
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }
  
  util.reset();
  
  fs.rmdir('a', function(err) {
    t.equal(err.code, 'ENOENT');
    util.reset();
  });
});

test('rmdir non-empty', function(t) {
  t.plan(2);
  
  fs.mkdirSync('a');
  fs.writeFileSync('a/foo', 'bar');
  
  try {
    fs.rmdirSync('a');
  } catch (err) {
    t.equal(err.code, 'ENOTEMPTY');
  }
  
  fs.rmdir('a', function(err) {
    t.equal(err.code, 'ENOTEMPTY');
    util.reset();
  });
});

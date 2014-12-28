var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('chmod non-existent', function(t) {
  t.plan(2);
  
  try {
    fs.chmodSync('foo', 0666);
  } catch (err) {
    t.equal(err.code, 'ENOENT');
  }
  
  fs.chmod('foo', 0666, function(err) {
    t.equal(err.code, 'ENOENT');
  });
});

test('chmod', function(t) {
  t.plan(4);
  
  fs.writeFileSync('foo', 'bar');
  t.equal(util.perms('foo'), 0666);
  
  fs.chmodSync('foo', 0644);
  t.equal(util.perms('foo'), 0644);
  
  fs.chmod('foo', 0666, function(err) {
    t.error(err);
    t.equal(util.perms('foo'), 0666);
    util.reset();
  });
});

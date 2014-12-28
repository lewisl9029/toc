var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('mkdir', function(t) {
  t.plan(3);

  fs.mkdirSync('a');
  t.ok(fs.statSync('a').isDirectory());
  util.reset();

  fs.mkdir('a', function(err) {
    t.error(err);
    t.ok(fs.statSync('a').isDirectory());
  });
});

test('mkdir with mode', function (t) {
  t.plan(6);

  t.equal(util.perms('a'), 0777);
  util.reset();
  
  fs.mkdirSync('a', 0666);
  t.ok(fs.statSync('a').isDirectory());
  t.equal(util.perms('a'), 0666);
  util.reset();
  
  fs.mkdir('a', 0666, function(err) {
    t.error(err);
    t.ok(fs.statSync('a').isDirectory());
    t.equal(util.perms('a'), 0666);
    util.reset();
  });
});

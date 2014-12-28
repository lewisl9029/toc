var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('append', function(t) {
  t.plan(4);
  
  fs.appendFileSync('foo', 'bar');
  fs.appendFileSync('foo', 'baz');
  t.equal(fs.readFileSync('foo').toString(), 'barbaz');
  util.reset();
  
  fs.appendFile('foo', 'bar', function(err) {
    t.error(err);
    fs.appendFile('foo', 'baz', function(err) {
      t.error(err);
      t.equal(fs.readFileSync('foo').toString(), 'barbaz');
      util.reset();
    });
  });
});

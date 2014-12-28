var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('truncate', function(t) {
  t.plan(6);
  
  fs.writeFileSync('foo', 'bar');
  fs.truncateSync('foo', 2);
  t.equal(fs.readFileSync('foo').toString(), 'ba');
  fs.truncateSync('foo');
  t.equal(fs.readFileSync('foo').toString(), '');
  util.reset();
  
  fs.writeFileSync('foo', 'bar');
  fs.truncate('foo', 2, function(err) {
    t.error(err);
    t.equal(fs.readFileSync('foo').toString(), 'ba');
    
    fs.truncate('foo', function(err) {
      t.error(err);
      t.equal(fs.readFileSync('foo').toString(), '');
      util.reset();
    });
  });
});

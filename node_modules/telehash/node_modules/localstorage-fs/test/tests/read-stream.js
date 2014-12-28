var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('read stream simple', function(t) {
  t.plan(2);
  
  fs.writeFileSync('foo', 'bar');
  
  fs.createReadStream('foo')
    .on('data', function(data) {
      t.equal(data.toString(), 'bar');
    })
    .on('end', function() {
      t.pass();
      util.reset();
    });
});

test('read stream non-existent, bad flag', function(t) {
  t.plan(1);

  fs.createReadStream('foo')
    .on('error', function(err) {
      t.equal(err.code, 'ENOENT');
    })
    .on('data', function(data) {
      t.fail();
    });
});

test('read stream non-existent, good flag', function(t) {
  t.plan(1);

  fs.createReadStream('foo', { flag: 'w+' })
    .on('data', function() {
      t.fail();
    })
    .on('end', function(err) {
      t.pass();
    });
});

test('close event', function(t) {
  t.plan(1);
  
  fs.createReadStream('foo')
    .on('close', function() {
      t.pass();
      util.reset();
    })
    .read();
});

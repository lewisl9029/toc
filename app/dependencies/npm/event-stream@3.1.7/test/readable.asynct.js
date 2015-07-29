/* */ 
(function(process) {
  var es = require("../index"),
      it = require("it-is").style('colour'),
      u = require("ubelt");
  exports['read an array'] = function(test) {
    console.log('readable');
    return test.end();
    var readThis = u.map(3, 6, 100, u.id);
    console.log('readable');
    var reader = es.readable(function(i, callback) {
      if (i >= readThis.length)
        return this.emit('end');
      console.log('readable');
      callback(null, readThis[i]);
    });
    var writer = es.writeArray(function(err, array) {
      if (err)
        throw err;
      it(array).deepEqual(readThis);
      test.done();
    });
    reader.pipe(writer);
  };
  exports['read an array - async'] = function(test) {
    var readThis = u.map(3, 6, 100, u.id);
    var reader = es.readable(function(i, callback) {
      if (i >= readThis.length)
        return this.emit('end');
      u.delay(callback)(null, readThis[i]);
    });
    var writer = es.writeArray(function(err, array) {
      if (err)
        throw err;
      it(array).deepEqual(readThis);
      test.done();
    });
    reader.pipe(writer);
  };
  exports['emit data then call next() also works'] = function(test) {
    var readThis = u.map(3, 6, 100, u.id);
    var reader = es.readable(function(i, next) {
      if (i >= readThis.length)
        return this.emit('end');
      this.emit('data', readThis[i]);
      next();
    });
    var writer = es.writeArray(function(err, array) {
      if (err)
        throw err;
      it(array).deepEqual(readThis);
      test.done();
    });
    reader.pipe(writer);
  };
  exports['callback emits error, then stops'] = function(test) {
    var err = new Error('INTENSIONAL ERROR'),
        called = 0;
    var reader = es.readable(function(i, callback) {
      if (called++)
        return;
      callback(err);
    });
    reader.on('error', function(_err) {
      it(_err).deepEqual(err);
      u.delay(function() {
        it(called).equal(1);
        test.done();
      }, 50)();
    });
  };
  exports['readable does not call read concurrently'] = function(test) {
    var current = 0;
    var source = es.readable(function(count, cb) {
      current++;
      if (count > 100)
        return this.emit('end');
      u.delay(function() {
        current--;
        it(current).equal(0);
        cb(null, {
          ok: true,
          n: count
        });
      })();
    });
    var destination = es.map(function(data, cb) {
      cb();
    });
    var all = es.connect(source, destination);
    destination.on('end', test.done);
  };
  exports['does not raise a warning: Recursive process.nextTick detected'] = function(test) {
    var readThisDelayed;
    u.delay(function() {
      readThisDelayed = [1, 3, 5];
    })();
    es.readable(function(count, callback) {
      if (readThisDelayed) {
        var that = this;
        readThisDelayed.forEach(function(item) {
          that.emit('data', item);
        });
        this.emit('end');
        test.done();
      }
      callback();
    });
  };
  require("./helper/index")(module);
})(require("process"));

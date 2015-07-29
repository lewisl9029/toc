/* */ 
(function(Buffer, process) {
  var Stream = require("stream").Stream,
      es = exports,
      through = require("through"),
      from = require("from"),
      duplex = require("duplexer"),
      map = require("map-stream"),
      pause = require("pause-stream"),
      split = require("split"),
      pipeline = require("stream-combiner"),
      immediately = global.setImmediate || process.nextTick;
  es.Stream = Stream;
  es.through = through;
  es.from = from;
  es.duplex = duplex;
  es.map = map;
  es.pause = pause;
  es.split = split;
  es.pipeline = es.connect = es.pipe = pipeline;
  es.concat = es.merge = function() {
    var toMerge = [].slice.call(arguments);
    var stream = new Stream();
    stream.setMaxListeners(0);
    var endCount = 0;
    stream.writable = stream.readable = true;
    toMerge.forEach(function(e) {
      e.pipe(stream, {end: false});
      var ended = false;
      e.on('end', function() {
        if (ended)
          return;
        ended = true;
        endCount++;
        if (endCount == toMerge.length)
          stream.emit('end');
      });
    });
    stream.write = function(data) {
      this.emit('data', data);
    };
    stream.destroy = function() {
      toMerge.forEach(function(e) {
        if (e.destroy)
          e.destroy();
      });
    };
    return stream;
  };
  es.writeArray = function(done) {
    if ('function' !== typeof done)
      throw new Error('function writeArray (done): done must be function');
    var a = new Stream(),
        array = [],
        isDone = false;
    a.write = function(l) {
      array.push(l);
    };
    a.end = function() {
      isDone = true;
      done(null, array);
    };
    a.writable = true;
    a.readable = false;
    a.destroy = function() {
      a.writable = a.readable = false;
      if (isDone)
        return;
      done(new Error('destroyed before end'), array);
    };
    return a;
  };
  es.readArray = function(array) {
    var stream = new Stream(),
        i = 0,
        paused = false,
        ended = false;
    stream.readable = true;
    stream.writable = false;
    if (!Array.isArray(array))
      throw new Error('event-stream.read expects an array');
    stream.resume = function() {
      if (ended)
        return;
      paused = false;
      var l = array.length;
      while (i < l && !paused && !ended) {
        stream.emit('data', array[i++]);
      }
      if (i == l && !ended)
        ended = true, stream.readable = false, stream.emit('end');
    };
    process.nextTick(stream.resume);
    stream.pause = function() {
      paused = true;
    };
    stream.destroy = function() {
      ended = true;
      stream.emit('close');
    };
    return stream;
  };
  es.readable = function(func, continueOnError) {
    var stream = new Stream(),
        i = 0,
        paused = false,
        ended = false,
        reading = false;
    stream.readable = true;
    stream.writable = false;
    if ('function' !== typeof func)
      throw new Error('event-stream.readable expects async function');
    stream.on('end', function() {
      ended = true;
    });
    function get(err, data) {
      if (err) {
        stream.emit('error', err);
        if (!continueOnError)
          stream.emit('end');
      } else if (arguments.length > 1)
        stream.emit('data', data);
      immediately(function() {
        if (ended || paused || reading)
          return;
        try {
          reading = true;
          func.call(stream, i++, function() {
            reading = false;
            get.apply(null, arguments);
          });
        } catch (err) {
          stream.emit('error', err);
        }
      });
    }
    stream.resume = function() {
      paused = false;
      get();
    };
    process.nextTick(get);
    stream.pause = function() {
      paused = true;
    };
    stream.destroy = function() {
      stream.emit('end');
      stream.emit('close');
      ended = true;
    };
    return stream;
  };
  es.mapSync = function(sync) {
    return es.through(function write(data) {
      var mappedData = sync(data);
      if (typeof mappedData !== 'undefined')
        this.emit('data', mappedData);
    });
  };
  es.log = function(name) {
    return es.through(function(data) {
      var args = [].slice.call(arguments);
      if (name)
        console.error(name, data);
      else
        console.error(data);
      this.emit('data', data);
    });
  };
  es.child = function(child) {
    return es.duplex(child.stdin, child.stdout);
  };
  es.parse = function() {
    return es.through(function(data) {
      var obj;
      try {
        if (data)
          obj = JSON.parse(data.toString());
      } catch (err) {
        return console.error(err, 'attemping to parse:', data);
      }
      if (obj !== undefined)
        this.emit('data', obj);
    });
  };
  es.stringify = function() {
    var Buffer = require("buffer").Buffer;
    return es.mapSync(function(e) {
      return JSON.stringify(Buffer.isBuffer(e) ? e.toString() : e) + '\n';
    });
  };
  es.replace = function(from, to) {
    return es.pipeline(es.split(from), es.join(to));
  };
  es.join = function(str) {
    if ('function' === typeof str)
      return es.wait(str);
    var first = true;
    return es.through(function(data) {
      if (!first)
        this.emit('data', str);
      first = false;
      this.emit('data', data);
      return true;
    });
  };
  es.wait = function(callback) {
    var arr = [];
    return es.through(function(data) {
      arr.push(data);
    }, function() {
      var body = Buffer.isBuffer(arr[0]) ? Buffer.concat(arr) : arr.join('');
      this.emit('data', body);
      this.emit('end');
      if (callback)
        callback(null, body);
    });
  };
  es.pipeable = function() {
    throw new Error('[EVENT-STREAM] es.pipeable is deprecated');
  };
})(require("buffer").Buffer, require("process"));

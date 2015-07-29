/* */ 
(function(process) {
  var Stream = require("stream").Stream;
  module.exports = function(mapper, opts) {
    var stream = new Stream(),
        self = this,
        inputs = 0,
        outputs = 0,
        ended = false,
        paused = false,
        destroyed = false,
        lastWritten = 0,
        inNext = false;
    this.opts = opts || {};
    var errorEventName = this.opts.failures ? 'failure' : 'error';
    var writeQueue = {};
    stream.writable = true;
    stream.readable = true;
    function queueData(data, number) {
      var nextToWrite = lastWritten + 1;
      if (number === nextToWrite) {
        if (data !== undefined) {
          stream.emit.apply(stream, ['data', data]);
        }
        lastWritten++;
        nextToWrite++;
      } else {
        writeQueue[number] = data;
      }
      if (writeQueue.hasOwnProperty(nextToWrite)) {
        var dataToWrite = writeQueue[nextToWrite];
        delete writeQueue[nextToWrite];
        return queueData(dataToWrite, nextToWrite);
      }
      outputs++;
      if (inputs === outputs) {
        if (paused)
          paused = false, stream.emit('drain');
        if (ended)
          end();
      }
    }
    function next(err, data, number) {
      if (destroyed)
        return;
      inNext = true;
      if (!err || self.opts.failures) {
        queueData(data, number);
      }
      if (err) {
        stream.emit.apply(stream, [errorEventName, err]);
      }
      inNext = false;
    }
    function wrappedMapper(input, number, callback) {
      return mapper.call(null, input, function(err, data) {
        callback(err, data, number);
      });
    }
    stream.write = function(data) {
      if (ended)
        throw new Error('map stream is not writable');
      inNext = false;
      inputs++;
      try {
        var written = wrappedMapper(data, inputs, next);
        paused = (written === false);
        return !paused;
      } catch (err) {
        if (inNext)
          throw err;
        next(err);
        return !paused;
      }
    };
    function end(data) {
      ended = true;
      stream.writable = false;
      if (data !== undefined) {
        return queueData(data, inputs);
      } else if (inputs == outputs) {
        stream.readable = false, stream.emit('end'), stream.destroy();
      }
    }
    stream.end = function(data) {
      if (ended)
        return;
      end();
    };
    stream.destroy = function() {
      ended = destroyed = true;
      stream.writable = stream.readable = paused = false;
      process.nextTick(function() {
        stream.emit('close');
      });
    };
    stream.pause = function() {
      paused = true;
    };
    stream.resume = function() {
      paused = false;
    };
    return stream;
  };
})(require("process"));

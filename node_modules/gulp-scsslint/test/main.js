var scsslint = require('../src');

var gutil = require('gulp-util');
var child_process = require('child_process');
var es = require('event-stream');
var path = require('path');
var should = require('should');
require('mocha');

var getFile = function(filePath) {
   filePath = 'test/' + filePath;
   return new gutil.File({
      path: filePath,
      cwd: 'test/',
      base: path.dirname(filePath),
      contents: null
   });
};

describe('gulp-scsslint', function() {
   describe('scsslint()', function() {
      this.timeout(5000); // travis appears to be slow at running tests

      it('should pass file through', function(done) {
         var fileCount = 0;

         var file = getFile('fixtures/pass.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            should.exist(newFile);
            should.exist(newFile.path);
            should.exist(newFile.relative);
            newFile.path.should.equal('test/fixtures/pass.scss');
            newFile.relative.should.equal('pass.scss');
            ++fileCount;
         });

         stream.once('end', function() {
            fileCount.should.equal(1);
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should send success status', function(done) {
         var file = getFile('fixtures/pass.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            should.exist(newFile.scsslint.success);
            newFile.scsslint.success.should.equal(true);
            should.not.exist(newFile.scsslint.results);
         });
         stream.once('end', function() {
           done();
         });

         stream.write(file);
         stream.end();
      });

      it('should send failure status', function(done) {
         var file = getFile('fixtures/warning.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            should.exist(newFile.scsslint.success);
            newFile.scsslint.success.should.equal(false);
            should.exist(newFile.scsslint.results);
         });
         stream.once('end', function() {
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should lint two files', function(done) {
         var fileCount = 0;

         var file1 = getFile('fixtures/error.scss');
         var file2 = getFile('fixtures/warning.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
           ++fileCount;
         });

         stream.once('end', function() {
            fileCount.should.equal(2);
            done();
         });

         stream.write(file1);
         stream.write(file2);
         stream.end();
      });

      it('should lint lots of files quickly', function(done) {
         var fileCount = 0;
         var expectedFileCount = 100;

         var files = [];
         for (var i = 1; i <= expectedFileCount; i++) {
            files.push(getFile('fixtures/lots/error' + i + '.scss'));
         }

         var stream = scsslint();
         stream.on('data', function(newFile) {
           ++fileCount;
         });

         stream.once('end', function() {
            fileCount.should.equal(expectedFileCount);
            done();
         });

         for (i = 0; i < files.length; i++) {
            stream.write(files[i]);
         }
         stream.end();
      });

      it('should support config file as options param', function(done) {
         var file = getFile('fixtures/pass-with-config.scss');

         var stream = scsslint('test/fixtures/scss-lint-config.yml');
         stream.on('data', function(newFile) {
           should.exist(newFile.scsslint.success);
           newFile.scsslint.success.should.equal(true);
           should.not.exist(newFile.scsslint.results);
           should.not.exist(newFile.scsslint.opt);
         });

         stream.once('end', function() {
           done();
         });

         stream.write(file);
         stream.end();
      });

      it('should support config file in options param', function(done) {
         var file = getFile('fixtures/pass-with-config.scss');

         var stream = scsslint({ config: 'test/fixtures/scss-lint-config.yml' });
         stream.on('data', function(newFile) {
           should.exist(newFile.scsslint.success);
           newFile.scsslint.success.should.equal(true);
           should.not.exist(newFile.scsslint.results);
           should.not.exist(newFile.scsslint.opt);
         });

         stream.once('end', function() {
           done();
         });

         stream.write(file);
         stream.end();
      });

      it('should included detailed issues on error', function(done) {
         var file = getFile('fixtures/warning.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            newFile.scsslint.errorCount.should.be.greaterThan(0);
            should.exist(newFile.scsslint.results[0].reason);
            should.exist(newFile.scsslint.results[0].line);
            should.exist(newFile.scsslint.results[0].severity);
         });
         stream.once('end', function() {
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should handle a long file with many issues', function(done) {
         this.timeout(30000);
         var file = getFile('fixtures/long.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            should.exist(newFile.scsslint.errorCount);
            newFile.scsslint.errorCount.should.be.greaterThan(2500);
         });
         stream.once('end', function() {
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should emit an error if scss-lint is not available', function(done) {
         var fileCount = 0;

         var file = getFile('fixtures/pass.scss');

         var stream = scsslint({ bin: 'scss-lint-not-installed' });

         stream.once('end', function() {
            fileCount.should.equal(1);
         });

         stream.on('error', function(error) {
            error.message.should.match(/could not be found/);
            done();
        });

         stream.write(file);
         stream.end();
      });

      it('should be runnable through bundle exec', function(done) {
         var fileCount = 0;

         var file = getFile('fixtures/pass.scss');

         var stream = scsslint({ bin: 'bundle exec scss-lint' });
         stream.on('data', function(newFile) {
            newFile.scsslint.success.should.equal(true);
            ++fileCount;
         });
         stream.once('end', function() {
            fileCount.should.equal(1);
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should handle scss file paths with spaces', function(done) {
         var fileCount = 0;

         var file = getFile('fixtures/pass with spaces.scss');

         var stream = scsslint();
         stream.on('data', function(newFile) {
            should.exist(newFile);
            newFile.path.should.equal('test/fixtures/pass with spaces.scss');
            newFile.scsslint.success.should.equal(true);
            ++fileCount;
         });

         stream.once('end', function() {
            fileCount.should.equal(1);
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should not error if no files are provided', function(done) {
         var fileCount = 0;
         var stream = scsslint();

         stream.on('error', function(error){
            // this should not be reached
            error.should.equal(null);
         });

         stream.once('end', function() {
            fileCount.should.equal(0);
            done();
         });

         stream.end();
      });


      it('should error on a file with no path', function(done) {
         var errorCount = 0;

         var fakeFile = new gutil.File({
            contents: es.readArray(['stream', 'with', 'contents'])
         });

         var stream = scsslint();

         stream.on('error', function(error){
            error.message.should.equal('File provided with no path');
            ++errorCount;
         });

         stream.once('end', function() {
            errorCount.should.equal(1);
            done();
         });

         stream.write(fakeFile);
         stream.end();
      });

      it('should pass options.args to scss-lint', function(done) {
         var expectedArg = '--exclude=foo bar';
         var actualArgs;

         var file = getFile('fixtures/error.scss');

         var stream = scsslint({ args: [expectedArg] });

         // Stub child_process.spawn
         var child_process_spawn = child_process.spawn;
         child_process.spawn = function(command, args, options) {
            actualArgs = args;
            return child_process_spawn(command, args, options);
         };

         stream.once('end', function() {
            actualArgs.should.containEql(expectedArg);

            child_process.spawn = child_process_spawn;
            done();
         });

         stream.write(file);
         stream.end();
      });

   });
});

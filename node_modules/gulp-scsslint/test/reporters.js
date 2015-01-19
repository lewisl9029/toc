var scsslint = require('../src');

var gutil = require('gulp-util');
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
   describe('scsslint.reporter()', function() {
      it('should pass file through', function(done) {
         var fileCount = 0;

         var file = getFile('fixtures/pass.scss');

         var stream = scsslint.reporter();
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

      it('should not error if no files are provided', function(done) {
         var fileCount = 0;

         var stream = scsslint.reporter();

         stream.on('error', function(error){
            // this should not be reached
            error.should.equal(null);
            done();
         });

         stream.once('end', function() {
            fileCount.should.equal(0);
            done();
         });

         stream.end();
      });
   });

   describe('scsslint.reporter(default)', function() {
      it('should log error on failure', function(done) {
         var writtenValue;
         var file = getFile('fixtures/error.scss');

         var stream = scsslint();
         var failStream = scsslint.reporter('default');
         stream.pipe(failStream);

         // Stub process.stdout.write
         var stdout_write = process.stdout.write;
         process.stdout.write = function(value) {
            writtenValue = value;
         };

         stream.once('end', function() {
            writtenValue.should.match(/Invalid CSS/);

            process.stdout.write = stdout_write;
            done();
         });

         stream.write(file);
         stream.end();
      });
   });

   describe('scsslint.reporter(fail)', function() {
      it('should emit error on failure', function(done) {
         var file = getFile('fixtures/error.scss');

         var stream = scsslint();
         var failStream = scsslint.reporter('fail');
         stream.pipe(failStream);

         failStream.on('error', function (err) {
            should.exist(err);
            err.message.indexOf(file.relative).should.not.equal(-1, 'should say which file');
            done();
         });

         stream.write(file);
         stream.end();
      });

      it('should not emit error on success', function(done) {
         var file = getFile('fixtures/pass.scss');

         var stream = scsslint();
         var failStream = scsslint.reporter('fail');
         stream.pipe(failStream);

         failStream.on('error', function (err) {
            should(0).ok; // assert fail
            done();
         });

         stream.once('end', function() {
            should(1).ok; // assert success
            done();
         });

         stream.write(file);
         stream.end();
      });
   });
});

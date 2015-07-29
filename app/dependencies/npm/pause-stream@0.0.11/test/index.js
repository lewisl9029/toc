/* */ 
var spec = require("stream-spec");
var tester = require("stream-tester");
var ps = require("../index")();
spec(ps).through({strict: false}).validateOnExit();
var master = tester.createConsistent;
tester.createRandomStream(1000).pipe(master = tester.createConsistentStream()).pipe(tester.createUnpauseStream()).pipe(ps).pipe(tester.createPauseStream()).pipe(master.createSlave());

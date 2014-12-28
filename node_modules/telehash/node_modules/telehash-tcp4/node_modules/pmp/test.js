
var pmp = require('pmp');
// this should return your external ip address as reported by your gateway - not from an external site

// the first parameter is your gateway if you know it - otherwise it will try to find it.

pmp.getExternalAddress('',function(err,rslt){
    console.log(err,rslt);
});



pmp.portMap('',3000,3000,20,function(err,rslt){
    console.log(err,rslt);
});


exports.name = 'http';
exports.client = require("./client.js");
exports.server = require("./server.js");

// wrapper to load both client and server
exports.mesh = function(mesh, cbMesh)
{
  mesh.extend(exports.client, function(err){
    if(err) return cbMesh(err);
    mesh.extend(exports.server, cbMesh);
  });
}

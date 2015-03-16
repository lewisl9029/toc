exports.json = require("./seeds.json");
exports.install = function(self, args)
{
  var seeds = exports.json;
  if(args && args.seeds)
  {
    if(typeof args.seeds == "string") seeds = require(args.seeds);
    if(typeof args.seeds == "object") seeds = args.seeds;
  }
  Object.keys(seeds).forEach(function(seed){self.addSeed(seeds[seed])});
}
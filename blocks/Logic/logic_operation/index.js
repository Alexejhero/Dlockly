const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_operation";
block.default = true;
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the input parameters.", ["A", "B"]),
]

module.exports = block;
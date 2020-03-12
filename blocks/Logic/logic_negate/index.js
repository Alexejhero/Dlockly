const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_negate";
block.default = true;
block.extra = function () {
  return this.readFromFile("shadows.xml");
}
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the input parameter.", ["BOOL"]),
]

module.exports = block;
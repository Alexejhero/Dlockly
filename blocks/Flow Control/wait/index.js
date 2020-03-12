const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "wait";
block.message0 = "wait for %1 seconds";
block.args0.push(new Classes.ArgValue("amount", "number"));
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Waits a specified amount of seconds";
block.generator = function () {
  return this.require("./generator.js")();
}
block.extra = block.readFromFile("shadows.xml");
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'seconds' paramter", ["amount"]),
]

module.exports = block;
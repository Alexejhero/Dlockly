const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "wait";
block.message0 = "wait for %1 seconds";
block.args0.push(new Classes.ArgValue("amount", "number"));
block.previousStatement = true;
block.nextStatement = true;
block.tooltip = "Waits a specified amount of seconds";
block.generator = function () {
  this.require("./generator.js")();
}
block.extra = function () {
  return this.readFromFile("shadows.xml");
}

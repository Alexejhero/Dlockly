const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "try_catch";
block.message0 = "try %1 %2 catch error %3 %4";
block.args0.push(
  new Classes.ArgDummy(),
  new Classes.ArgStatement("try"),
  new Classes.ArgDummy(),
  new Classes.ArgStatement("catch")
);
block.colour = "#A00000";
block.previousStatement = true;
block.nextStatement = true;
block.tooltip = "If the code in the try block throws an error, it is caught in the catch block";
block.generator = function () {
  this.require("./generator.js")();
}
block.extra = function () {
  return this.readFromFile("shadows.xml");
}

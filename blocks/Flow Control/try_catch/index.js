const b = require("node-blockly");
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
  return this.require("./generator.js")();
}
block.extra = function () {
  return this.readFromFile("shadows.xml");
}
block.restrictions = [
  new Classes.Restriction("!toplevelparent", "The 'try/catch' block many not be used inside an 'on error' event.", ["types"]),
  new Classes.Restriction("custom", "The 'try/catch' block may not be used inside another 'try/catch' block.", custom),
]

/**
 * @param {b} Blockly 
 * @param {b.Block} block
 */
function custom(Blockly, block) {
  block = block.getSurroundParent();
  while (block) {
    if (block.type == 'try_catch') return false;
    block = block.getSurroundParent();
  }
  return true;
}

module.exports = block;
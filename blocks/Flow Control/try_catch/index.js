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
block.extra = block.readFromFile("shadows.xml");
block.restrictions = [
  new Classes.Restriction("!toplevelparent", "The 'try/catch' block many not be used inside an 'on error' event.", ["types"]),
  new Classes.Restriction("custom", "The 'try/catch' block may not be used inside another 'try/catch' block.", restriction),
]

/**
 * @param {import("node-blockly")} Blockly 
 * @param {import("node-blockly").Block} block
 */
function restriction(Blockly, block) {
  block = block.getSurroundParent();
  while (block) {
    if (block.type == 'try_catch') return false;
    block = block.getSurroundParent();
  }
  return true;
}

/**
 * @param {import("node-blockly")} Blockly 
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'try {' + Blockly.JavaScript.statementToCode(block, 'try') + '} catch (error) {' + Blockly.JavaScript.statementToCode(block, 'catch') + '}';
}


module.exports = block;
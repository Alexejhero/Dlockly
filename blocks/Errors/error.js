const b = require("node-blockly");

const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "error";
block.message0 = "error";
block.output = "Error";
block.tooltip = "The error that occured.";
block.restrictions = [
  new Classes.Restriction("surroundparent", "The 'error' variable may only be used in an 'on error' event or a 'catch' block.", [
    "on_error",
    "try_catch",
  ]),
  new Classes.Restriction("custom", "The 'error' variable may only be used in an 'on error' event or a 'catch' block.", restriction)
];
block.reserved = [
  "error",
];

/**
 * @param {b} Blockly 
 * @param {b.Block} block 
 */
function restriction(Blockly, block) {
  var parent = block.getSurroundParent();
  while (parent && parent.type != 'try_catch') parent = parent.getSurroundParent();
  if (parent) {
    if (parent.inputList[3].connection.targetBlock()) {
      var id = parent.inputList[3].connection.targetBlock().id;
      parent = block.getSurroundParent();
      while (parent && parent.id != id) parent = parent.getSurroundParent();
      if (!parent) return false;
    } else return false;
  }
  return true;
}

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['error', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
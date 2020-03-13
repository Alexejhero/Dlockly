const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "newline";
block.message0 = "new line";
block.output = "String";
block.tooltip = "Creates a new line in the string.";

/**
 * @param {import("node-blockly")} Blockly 
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ["' '", Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
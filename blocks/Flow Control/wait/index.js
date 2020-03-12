const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "wait";
block.message0 = "wait for %1 seconds";
block.args0.push(new Classes.ArgValue("amount", "Number"));
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Waits a specified amount of seconds";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'seconds' paramter", ["amount"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await require("../../src/utils").wait(' + Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC) + ');';
}

module.exports = block;
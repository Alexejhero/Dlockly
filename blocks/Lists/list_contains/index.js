const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "list_contains";
block.message0 = "%1 contains %2";
block.args0.push(
  new Classes.ArgValue("list", "Array"),
  new Classes.ArgValue("contains"),
);
block.inputsInline = true;
block.output = "Boolean";
block.tooltip = "Checks if a list contains a given value";
block.extra = block.readShadows();

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'list', Blockly.JavaScript.ORDER_NONE) + '.includes(' + Blockly.JavaScript.valueToCode(block, 'contains', Blockly.JavaScript.ORDER_NONE) + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
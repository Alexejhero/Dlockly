const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "string_starts_with";
block.message0 = "%1 starts with %2";
block.args0.push(
  new Classes.ArgValue("s_one", "String", "RIGHT"),
  new Classes.ArgValue("s_two", "String"),
);
block.inputsInline = true;
block.output = "Boolean";
block.tooltip = "Checks if a text starts with another text";
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the text parameters.", ["s_one", "s_two"]),
]
block.extra = block.readShadows();

/**
 * @param {import("node-blockly")} Blockly 
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 's_one', Blockly.JavaScript.ORDER_ATOMIC) + '.startsWith(' + Blockly.JavaScript.valueToCode(block, 's_two', Blockly.JavaScript.ORDER_ATOMIC) + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "error_text";
block.message0 = "get text of error %1";
block.args0.push(
  new Classes.ArgValue("err", "Error"),
);
block.inputsInline = false;
block.output = "String";
block.tooltip = "Gets the text of an error.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'error' parameter", ["err"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'err', Blockly.JavaScript.ORDER_ATOMIC) + '.toString()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
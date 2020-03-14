const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "channel_name";
block.message0 = "get name of channel/category %1";
block.args0.push(
  new Classes.ArgValue("channel", "Channel"),
);
block.inputsInline = false;
block.output = "String";
block.tooltip = "Gets the name of a channel or category.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' parameter", ["channel"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.name', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;
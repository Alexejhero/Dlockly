const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "channel_nsfw";
block.message0 = "is text channel nsfw %1";
block.args0.push(
  new Classes.ArgValue("channel", "Channel"),
);
block.inputsInline = false;
block.output = "Boolean";
block.tooltip = "Checks if a channel is marked as NSFW or not. Only available for text channels.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' parameter", ["channel"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.nsfw', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;
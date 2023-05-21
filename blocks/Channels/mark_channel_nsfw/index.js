const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "mark_channel_nsfw";
block.message0 = "mark text channel %1 as nsfw %2";
block.args0.push(
  new Classes.ArgValue("channel", "Channel"),
  new Classes.ArgValue("val", "Boolean", "RIGHT"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Marks a channel as SFW/NSFW. Only available for text channels.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' and 'value' parameters", ["channel", "val"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.setNSFW(' + Blockly.JavaScript.valueToCode(block, 'val', Blockly.JavaScript.ORDER_ATOMIC) + ');'
}

module.exports = block;
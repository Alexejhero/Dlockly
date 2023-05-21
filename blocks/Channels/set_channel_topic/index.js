const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "set_channel_topic";
block.message0 = "set text channel %1 topic to %2";
block.args0.push(
  new Classes.ArgValue("channel", "Channel"),
  new Classes.ArgValue("topic", "String", "RIGHT"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Changes the topic of a channel. Only available for text channels.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' and 'topic' parameters", ["channel", "topic"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.setTopic(' + Blockly.JavaScript.valueToCode(block, 'topic', Blockly.JavaScript.ORDER_ATOMIC) + ');'
}

module.exports = block;
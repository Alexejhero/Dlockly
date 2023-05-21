const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "channel";
block.message0 = "channel";
block.colour = 0;
block.output = "Channel";
block.tooltip = "The channel that triggered the event";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'channel' variable may only be used in an 'on channel...' or 'on message...' event.", [
    "on_channel_create",
    "on_channel_delete",
    "on_message",
    "on_message_delete",
  ]),
];
block.reserved = [
  "channel",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['channel', Blockly.JavaScript.ORDER_ATOMIC]
}

module.exports = block;
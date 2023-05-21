const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "message";
block.message0 = "message";
block.colour = 0;
block.output = "Message";
block.tooltip = "The message that triggered the event.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'message' variable may only be used in an 'on message...' event.", [
    require("./on_message").type,
    require("./on_message_delete").type,
    require("./on_message_edit").type,
  ]),
];
block.reserved = [
  "message",
  // TODO: Remove this from here after guild blocks are added
  "guild",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['message', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
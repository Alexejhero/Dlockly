const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "old_message";
block.message0 = "oldmessage";
block.colour = 0;
block.output = "Message";
block.tooltip = "The old values of the message. Only the content and clean content will be different.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'old message' variable may only be used in an 'on message edited' event.", [
    require("./on_message_edit").type,
  ]),
];
block.reserved = [
  "oldmessage",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['oldmessage', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
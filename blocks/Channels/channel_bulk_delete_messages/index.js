const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "channel_bulk_delete_messages";
// TODO: Plural extension
block.message0 = "delete %1 message(s) from text channel %2";
block.args0.push(
  new Classes.ArgValue("num", "Number", "RIGHT"),
  new Classes.ArgValue("channel", "Channel"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Deletes a number of messages from a channel. Only available for text channels.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' parameter", ["channel"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.bulkDelete(' + 'Number.parseInt(Number.parseInt(' + Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC) + ') + 1));';
}

module.exports = block;
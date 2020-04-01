const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "get_message_by_id";
block.message0 = "get message by id %1 from channel %2";
block.args0.push(
  new Classes.ArgValue("id", "String"),
  new Classes.ArgValue("channel", "Channel", "RIGHT"),
);
block.inputsInline = false;
block.output = "Message";
block.tooltip = "Gets a message from a channel by its ID.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' and 'id' parameters.", ["channel", "id"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.messages.cache.get(' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "get_channel_by_id";
block.message0 = "get channel/category by id %1";
block.args0.push(
  new Classes.ArgValue("id", "String"),
);
block.inputsInline = false;
block.output = "Channel";
block.tooltip = "Gets a channel from the server by its ID.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'id' parameter", ["id"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['guild.channels.cache.get(' + Blockly.JavaScript.valueToCode(block, 'id', Blockly.JavaScript.ORDER_ATOMIC) + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "send_message";
block.message0 = "send message %1 to channel %2";
block.args0.push(
  new Classes.ArgValue("msg", [
    "String",
    "Embed",
  ]),
  new Classes.ArgValue("channel", "Channel", "RIGHT"),
);
block.inputsInline = false;
block.optionalReturn = "Message";
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Sends a message to a channel. Only available for text channels.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'message' and 'channel' parameters", ["msg", "channel"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  var result = 'await require(\"../../src/utils\").sendToChannel(' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + ',' + Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC) + ');';
  if (block.optionalReturn) return [result, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  else return result;
  // TODO: Make sure this works
}

module.exports = block;
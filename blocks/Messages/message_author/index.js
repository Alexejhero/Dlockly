const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "message_author";
block.message0 = "get author of message %1";
block.args0.push(
  new Classes.ArgValue("msg", "Message"),
);
block.inputsInline = false;
block.output = "Member";
block.tooltip = "Gets the author of a message.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'message' parameter", ["message"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC) + '.author', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;
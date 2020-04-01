const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "delete_message";
block.message0 = "delete message %1";
block.args0.push(
  new Classes.ArgValue("msg", "Message"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Deletes a message.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'message' parameter.", ["msg"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC) + '.delete();';
}

module.exports = block;
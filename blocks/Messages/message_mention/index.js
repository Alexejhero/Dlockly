const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "message_mention"; // TODO: Redo this block
block.message0 = "get %1 mention number %2 from message %3";
block.args0.push(
  new Classes.ArgDropdown("type", [
    [
      "member",
      "members"
    ],
    [
      "role",
      "roles"
    ],
    [
      "channel",
      "channels"
    ]
  ]),
  new Classes.ArgNumber("nr", 1, 1, 1, 1),
  new Classes.ArgValue("msg", "Message"),
);
block.inputsInline = false;
block.output = [ // TODO: Output extension
  "Member",
  "Role",
  "Channel",
]
block.tooltip = "Gets a mention from a message.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'message' parameter.", ["msg"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC) + '.mentions.' + block.getFieldValue('type') + '.array()[' + Number.parseInt(Number.parseInt(block.getFieldValue('nr')) - 1) + ']', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;
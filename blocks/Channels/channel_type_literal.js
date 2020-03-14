const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "channel_type_literal";
block.message0 = "channel type %1";
block.args0 = [
  new Classes.ArgDropdown("type", [
    [
      "text channel",
      "text"
    ],
    [
      "voice channel",
      "voice"
    ],
    [
      "announcement channel",
      "news"
    ],
    [
      "store channel",
      "store"
    ],
    [
      "category",
      "category"
    ],
  ]),
];
block.inputsInline = false;
block.output = [
  "ChannelType",
  "String",
];
block.tooltip = "Contains all of the possible channel types. Useful for 'if' blocks";

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['\"' + block.getFieldValue('type') + '\"', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
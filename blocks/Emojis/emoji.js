const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "emoji";
block.message0 = "emoji";
block.colour = 0;
block.output = [
  "Emoji",
  "String",
];
block.tooltip = "The emoji that triggered the event.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'emoji' variable may only be used in an 'on emoji added' or 'on emoji deleted' event.", [
    "on_emoji_create",
    "on_emoji_delete",
  ]),
];
block.reserved = [
  "emoji",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['emoji', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
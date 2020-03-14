const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "set_channel_name";
block.message0 = "set channel/category %1 name to %2";
block.args0.push(
  new Classes.ArgValue("channel", "Channel"),
  new Classes.ArgValue("name", "String", "RIGHT"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Changes the name of a channel or category.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'channel' and 'name' parameters", ["channel", "name"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC) + '.setName(' + Blockly.JavaScript.valueToCode(block, 'name', Blockly.JavaScript.ORDER_ATOMIC) + ');'
}

module.exports = block;
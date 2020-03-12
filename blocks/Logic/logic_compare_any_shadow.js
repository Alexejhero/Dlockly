const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_compare_any_shadow";
block.message0 = "%1";
block.args0.push(new Classes.ArgText("TEXT", ""));
block.output = null;
block.style = "text_blocks";
block.helpUrl = "%{BKY_TEXT_TEXT_HELPURL}";
block.tooltip = "%{BKY_TEXT_TEXT_TOOLTIP}";
block.extensions = [
  "text_quotes",
  "parent_tooltip_when_inline"
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return Blockly.JavaScript.text.call(block, block);
}

block.hidden = true;

module.exports = block;
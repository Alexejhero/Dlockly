const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_checkbox";
block.message0 = "%1";
block.args0.push(new Classes.ArgCheckbox("check", true));
block.output = "Boolean";
block.tooltip = "Returns either true or false";

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 * @returns {[boolean, number]}
 */
block.generator = function (Blockly, block) {
  return [block.getFieldValue('check') == 'TRUE', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "date_now";
block.message0 = "now";
block.output = [
  "Date",
  "Time",
];
block.tooltip = "Gets the current date and time";

/**
 * @param {import("node-blockly")} Blockly 
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['Date.now()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
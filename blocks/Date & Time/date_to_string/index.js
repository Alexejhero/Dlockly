const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "date_to_string";
block.message0 = "date %1 to text as %2";
block.args0.push(
  new Classes.ArgValue("date", ["Date", "Time"]),
  new Classes.ArgDropdown("func", [
    [
      "date & time",
      "toString",
    ],
    [
      "date",
      "toDateString",
    ],
    [
      "time",
      "toTimeString",
    ],
  ]),
);
block.output = "String";
block.tooltip = "Gets the text representation of a date";
block.extra = block.readShadows();

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['new Date(' + Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_NONE) + ').' + block.getFieldValue('func') + '()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
const b = require("node-blockly");

module.exports =
  /**
   * @param {b} Blockly
   * @param {b.Block} block 
   */
  function (Blockly, block) {
    return 'await require(\"../../src/utils\").wait(' + Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC) + ');';
  }

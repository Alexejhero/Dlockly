const Blockly = require("../../../src/classes/blockly");

module.exports =
  /**
   * @param {*} Blockly 
   * @param {*} block 
   */
  function (Blockly, block) {
    return 'await require(\"../../src/utils\").wait(' + Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC) + ');';
  }

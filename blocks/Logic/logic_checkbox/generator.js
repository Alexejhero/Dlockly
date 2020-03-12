const b = require("node-blockly");

module.exports =
  /**
   * @param {b} Blockly
   * @param {b.Block} block 
   */
  function (Blockly, block) {
    return [block.getFieldValue('check') == 'TRUE', Blockly.JavaScript.ORDER_ATOMIC];
  }

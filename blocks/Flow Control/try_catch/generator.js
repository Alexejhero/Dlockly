const b = require("node-blockly");

module.exports =
  /**
   * @param {b} Blockly
   * @param {b.Block} block 
   */
  function (Blockly, block) {
    return 'try {' +
      Blockly.JavaScript.statementToCode(block, 'try') +
      '} catch (error) {' +
      Blockly.JavaScript.statementToCode(block, 'catch') +
      '}';
  }

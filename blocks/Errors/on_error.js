const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "on_error";
block.message0 = "on error %1 %2";
block.args0.push(
  new Classes.ArgDummy(),
  new Classes.ArgStatement("code"),
);
block.tooltip = "Triggers when an error occurs.";
block.icons = [
  "event",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block, data) {
  return ' module.exports.error = async (error, guild) => { try { ' + Blockly.JavaScript.statementToCode(block, 'code') + '} catch (e) { require(\"../../src/errors\").onerror(\"' + data.req.body.guild + '\", e, true); } }';
}

module.exports = block;
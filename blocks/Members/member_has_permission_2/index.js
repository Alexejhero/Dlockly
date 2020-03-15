const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "member_has_permission_2";
block.message0 = "member %1 has permission %2";
block.args0.push(
  new Classes.ArgValue("member", "Member", "RIGHT"),
  // TODO: For l10n, align all fields
  new Classes.ArgValue("permission", "Permission"),
);
block.inputsInline = false;
block.output = "Boolean";
block.tooltip = "Checks if a member has a permission.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'member' and 'permission' parameters", ["member", "permission"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'member', Blockly.JavaScript.ORDER_ATOMIC) + '.hasPermission(' + Blockly.JavaScript.valueToCode(block, 'permission', Blockly.JavaScript.ORDER_ATOMIC) + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

module.exports = block;
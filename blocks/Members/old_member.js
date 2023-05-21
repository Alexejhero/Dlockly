const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "old_member";
block.message0 = "old member";
block.colour = 0;
block.output = "Member";
block.tooltip = "The old values of the member. Only the nickname will be different.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'old member' variable may only be used in an 'on member nickname changed' event.", [
    require("./on_member_nick_change").type,
  ]),
];
block.reserved = [
  "oldmember",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['oldmember', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
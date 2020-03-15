const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "member";
block.message0 = "member";
block.colour = 0;
block.output = "Member";
block.tooltip = "The member that triggered the event.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'member' variable may only be used in an 'on member...' event.", [
    require("./on_member_join").type, // TODO: Do this in other files
    require("./on_member_leave").type,
    require("./on_member_nick_change").type,
    require("../Messages/on_message").type,
    require("../Messages/on_message_delete").type,
    require("../Messages/on_message_edit").type,
  ]),
];
block.reserved = [
  "member",
  // TODO: Remove this from here after guild blocks are added
  "guild",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['member', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "me";
block.message0 = "dlockly member";
block.colour = 15;
block.output = "Member";
block.tooltip = "Gets Dlockly as a member in the server.";
block.restrictions = [
  new Classes.Restriction("toplevelparent", "The 'dlockly member' variable may only be used in an event.", [
    require("../Channels/on_channel_create").type,
    require("../Channels/on_channel_delete").type,
    require("../Emojis/on_emoji_create").type,
    require("../Emojis/on_emoji_delete").type,
    require("./on_member_join").type,
    require("./on_member_leave").type,
    require("./on_member_nick_change").type,
    require("../Messages/on_message").type,
    require("../Messages/on_message_delete").type,
    require("../Messages/on_message_edit").type,
  ]),
];
block.reserved = [
  "member",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['guild.me', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "permission_literal";
block.message0 = "permission %1";
block.args0 = [
  new Classes.ArgDropdown("type", [
    [
      "Administrator",
      "ADMINISTRATOR",
    ],
    [
      "View Audit Log",
      "VIEW_AUDIT_LOG",
    ],
    [
      "Manage Server",
      "MANAGE_GUILD",
    ],
    [
      "Manage Roles",
      "MANAGE_ROLES",
    ],
    [
      "Manage Channels",
      "MANAGE_CHANNELS",
    ],
    [
      "Kick Members",
      "KICK_MEMBERS",
    ],
    [
      "Ban Members",
      "BAN_MEMBERS",
    ],
    [
      "Create Invite",
      "CREATE_INSTANT_INVITE",
    ],
    [
      "Change Nickname",
      "CHANGE_NICKNAME",
    ],
    [
      "Manage Nicknames",
      "MANAGE_NICKNAMES",
    ],
    [
      "Manage Emojis",
      "MANAGE_EMOJIS",
    ],
    [
      "Manage Webhooks",
      "MANAGE_WEBHOOKS",
    ],
    [
      "Read Text Channels & See Voice Channels",
      "VIEW_CHANNEL",
    ],
    [
      "Send Messages",
      "SEND_MESSAGES",
    ],
    [
      "Send TTS Messages",
      "SEND_TTS_MESSAGES",
    ],
    [
      "Manage Messages",
      "MANAGE_MESSAGES",
    ],
    [
      "Embed Links",
      "EMBED_LINKS",
    ],
    [
      "Attach Files",
      "ATTACH_FILES",
    ],
    [
      "Read Message History",
      "READ_MESSAGE_HISTORY",
    ],
    [
      "Mention @everyone, @here and All Roles",
      "MENTION_EVERYONE",
    ],
    [
      "Use External Emojis",
      "USE_EXTERNAL_EMOJIS",
    ],
    [
      "Add Reactions",
      "ADD_REACTIONS",
    ],
    [
      "Connect",
      "CONNECT",
    ],
    [
      "Speak",
      "SPEAK",
    ],
    [
      "Mute Members",
      "MUTE_MEMBERS",
    ],
    [
      "Deafen Members",
      "DEAFEN_MEMBERS",
    ],
    [
      "Move Members",
      "MOVE_MEMBERS",
    ],
    [
      "Use Voice Activity",
      "USE_VAD",
    ],
    [
      "Priority Speaker",
      "PRIORITY_SPEAKER",
    ],
    [
      "Go Live",
      "STREAM",
    ],
  ]),
]
block.inputsInline = false;
block.output = [
  "String",
  "Permission",
];
block.tooltip = "Contains all of the possible permissions. Can be used with the 'member has permission' block.";

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return ['\"' + block.getFieldValue('type') + '\"', Blockly.JavaScript.ORDER_ATOMIC];
}

module.exports = block;
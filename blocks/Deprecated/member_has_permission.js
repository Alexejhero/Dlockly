const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "member_has_permission";
block.message0 = "member %1 has permission %2";
block.args0 = [
  new Classes.ArgValue("member", "Member", "RIGHT"),
  new Classes.ArgDropdown("perm", [
    [
      "administrator",
      "ADMINISTRATOR"
    ],
    [
      "create instant invite",
      "CREATE_INSTANT_INVITE"
    ],
    [
      "kick members",
      "KICK_MEMBERS"
    ],
    [
      "ban members",
      "BAN_MEMBERS"
    ],
    [
      "manage channels",
      "MANAGE_CHANNELS"
    ],
    [
      "manage server",
      "MANAGE_GUILD"
    ],
    [
      "add reactions",
      "ADD_REACTIONS"
    ],
    [
      "view audit log",
      "VIEW_AUDIT_LOG"
    ],
    [
      "priority speaker",
      "PRIORITY_SPEAKER"
    ],
    [
      "read text channels and see voice channels",
      "VIEW_CHANNEL"
    ],
    [
      "send messages",
      "SEND_MESSAGES"
    ],
    [
      "send /tts messages",
      "SEND_TTS_MESSAGES"
    ],
    [
      "manage messages",
      "MANAGE_MESSAGES"
    ],
    [
      "embed links",
      "EMBED_LINKS"
    ],
    [
      "attach files",
      "ATTACH_FILES"
    ],
    [
      "mention @everyone and @here",
      "MENTION_EVERYONE"
    ],
    [
      "use external emojis",
      "USE_EXTERNAL_EMOJIS"
    ],
    [
      "connect to voice channels",
      "CONNECT"
    ],
    [
      "speak in voice channels",
      "SPEAK"
    ],
    [
      "mute members",
      "MUTE_MEMBERS"
    ],
    [
      "deafen members",
      "DEAFEN_MEMBERS"
    ],
    [
      "move members to other voice channels",
      "MOVE_MEMBERS"
    ],
    [
      "use voice activity detection (VAD)",
      "USE_VAD"
    ],
    [
      "change nickname",
      "CHANGE_NICKNAME"
    ],
    [
      "manage nicknames",
      "MANAGE_NICKNAMES"
    ],
    [
      "manage roles",
      "MANAGE_ROLES"
    ],
    [
      "manage webhooks",
      "MANAGE_WEBHOOKS"
    ],
    [
      "manage emojis",
      "MANAGE_EMOJIS"
    ]
  ]),
];
block.inputsInline = false;
block.output = "Boolean";
block.colour = 180;
block.deprecated = true;

module.exports = block;
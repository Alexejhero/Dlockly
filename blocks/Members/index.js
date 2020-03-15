const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Members";
category.colour = "#008080";
category.blocks = [
  require("./on_member_join"),
  require("./on_member_leave"),
  require("./on_member_nick_change"),
  require("./member"),
  require("./old_member"),
  require("./me"),
  require("./member_has_permission_2"),
  require("./kick_member"),
  require("./ban_member"),
  require("./get_member_by_id"),
  require("./member_avatar"),
  require("./member_color"),
  require("./member_createdat"),
  require("./member_discriminator"),
  require("./member_displayname"),
  require("./member_joinedat"),
  require("./member_nickname"),
  require("./member_tag"),
  require("./member_username"),
];

module.exports = category;
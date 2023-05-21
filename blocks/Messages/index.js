const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Messages";
category.colour = "#b49145";
category.blocks = [
  require("./on_message"),
  require("./on_message_delete"),
  require("./on_message_edit"),
  require("./message"),
  require("./old_message"),
  require("./send_message"),
  require("./delete_message"),
  require("./message_mention"),
  require("./get_message_by_id"),
  require("./message_author"),
  require("./message_channel"),
  require("./message_content"),
  require("./message_cleancontent"),
];

module.exports = category;
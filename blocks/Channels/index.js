const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Channels";
category.colour = "#bb6d51";
category.blocks = [
  require("./on_channel_create"),
  require("./on_channel_delete"),
  require("./channel"),
  require("./channel_type_literal"),
  require("./set_channel_name"),
  require("./set_channel_topic"),
  require("./mark_channel_nsfw"),
  require("./channel_bulk_delete_messages"),
  require("./get_channel_by_id"),
  require("./channel_name"),
  require("./channel_nsfw"),
  require("./channel_topic"),
  require("./channel_type"),
];

module.exports = category;
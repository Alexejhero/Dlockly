const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Text";
category.colour = 160;
category.blocks = [
  require("./text"),
  require("./text_multiline"),
  require("./newline"),
  require("./text_join"),
  require("./text_append"),
  require("./text_length"),
  require("./text_isEmpty"),
  require("./text_trim"),
  require("./string_starts_with"),
  require("./string_contains"),
  require("./string_ends_with"),
  require("./text_indexOf"),
  require("./text_charAt"),
  require("./text_getSubstring"),
  require("./text_changeCase"),
];

module.exports = category;
const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Errors";
category.colour = "#A00000";
category.blocks = [
  require("./on_error"),
  require("./error"),
  require("./error_text"),
];

module.exports = category;
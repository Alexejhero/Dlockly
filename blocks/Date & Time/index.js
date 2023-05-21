const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Date & Time";
category.colour = "#9da859";
category.blocks = [
  require("./date_now"),
  require("./date_to_string"),
];

module.exports = category;
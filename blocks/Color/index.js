const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Color";
category.colour = 20;
category.blocks = [
  require("./colour_picker"),
  require("./colour_random"),
  require("./colour_rgb"),
  require("./colour_blend"),
];

module.exports = category;
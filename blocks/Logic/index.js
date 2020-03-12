const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Logic";
category.color = 210;
category.blocks = [
  require("./logic_compare"),
  require("./logic_operation"),
  require("./logic_negate"),
  require("./logic_boolean"),
];

module.exports = category;
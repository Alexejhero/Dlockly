const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Logic";
category.colour = 210;
category.blocks = [
  require("./logic_compare"),
  require("./logic_operation"),
  require("./logic_negate"),
  require("./logic_boolean"),
  require("./logic_checkbox"),
  require("./logic_null"),
  require("./logic_ternary"),
  require("./logic_compare_any_shadow"),
];

module.exports = category;
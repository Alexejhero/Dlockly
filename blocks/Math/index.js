const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Math";
category.colour = 230;
category.blocks = [
  require("./math_number"),
  require("./math_arithmetic"),
  require("./math_single"),
  require("./math_trig"),
  require("./math_constant"),
  require("./math_number_property"),
  require("./math_round"),
  require("./math_on_list"),
  require("./math_modulo"),
  require("./math_constrain"),
  require("./math_random_int"),
  require("./math_random_float"),
];

module.exports = category;
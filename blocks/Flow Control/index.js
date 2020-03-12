const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Flow Control";
category.color = 120;
category.blocks = [
  require("./controls_if"),
  require("./controls_repeat_ext"),
  require("./controls_whileUntil"),
  require("./controls_for"),
  require("./controls_forEach"),
  require("./controls_flow_statements"),
  require("./wait"),
  require("./try_catch"),
];


module.exports = category;
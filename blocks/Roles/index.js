const Classes = require("../../src/classes");

var soon = new Classes.Block(__dirname);
soon.message0 = "More role blocks coming soon!";
soon.colour = 0;
soon.max = -1;

var category = new Classes.Category(__dirname);
category.name = "Roles";
category.colour = "#f86883";
category.blocks = [
  require("./permission_literal"),
  soon,
];

module.exports = category;
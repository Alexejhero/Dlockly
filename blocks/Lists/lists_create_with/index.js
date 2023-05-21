const Classes = require("../../../src/classes");

var block1 = new Classes.Block(__dirname);
block1.type = "lists_create_with";
block1.default = true;
block1.extra = block1.readShadows();

var block2 = new Classes.Block(__dirname);
block2.type = "lists_create_with";
block2.default = true;

module.exports = [
  block1,
  block2,
];
const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "math_on_list";
block.default = true;
block.extra = block.readShadows();

module.exports = block;
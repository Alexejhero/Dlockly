const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "controls_for";
block.default = true;
block.extra = block.readShadows();

module.exports = block;
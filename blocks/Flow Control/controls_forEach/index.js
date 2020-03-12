const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "controls_forEach";
block.default = true;
block.extra = block.readFromFile("shadows.xml");

module.exports = block;
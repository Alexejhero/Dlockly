const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "colour_picker";
block.default = true;

module.exports = block;
const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "str_space";
block.message0 = "space";
block.output = "String";
block.colour = 160;
block.deprecated = true;

module.exports = block;
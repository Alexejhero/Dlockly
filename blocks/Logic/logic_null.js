const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_null";
block.default = true;

module.exports = block;
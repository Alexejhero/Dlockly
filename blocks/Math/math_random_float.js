const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "math_random_float";
block.default = true;

module.exports = block;
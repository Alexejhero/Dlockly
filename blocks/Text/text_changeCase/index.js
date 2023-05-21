const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "text_changeCase";
block.default = true;
block.extra = block.readShadows();

module.exports = block;
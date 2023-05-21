const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "set_channel_nsfw";
block.message0 = "set text channel %1 nsfw %2";
block.args0 = [
  new Classes.ArgValue("channel", "Channel"),
  new Classes.ArgCheckbox("val", true),
];
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.colour = 270;
block.deprecated = true;

module.exports = block;
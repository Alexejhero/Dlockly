const Classes = require("../../src/classes");

module.exports = new Classes.Category(__dirname);
this.name = "Embeds";
this.colour = "#5e04a1";
this.blocks = [
  require("./embed"),
  require("./embed_author"),
  require("./embed_footer"),
  require("./embed_field"),
];

module.exports = category;
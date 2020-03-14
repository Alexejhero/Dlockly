const Classes = require("../src/classes");

module.exports = [
  require("./Flow Control"),
  require("./Logic"),
  require("./Math"),
  require("./Text"),
  require("./Lists"),
  require("./Color"),
  require("./Date & Time"),
  new Classes.SepCategory(),
  // TODO: l10n
  new Classes.Category("Variables", 330, "VARIABLE"),
  new Classes.Category("Functions", 290, "PROCEDURE"),
  new Classes.SepCategory(),
  require("./Channels"),
  // require("./Embeds"),
  require("./Emojis"),
]
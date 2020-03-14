const Classes = require("../src/classes");

var variables = new Classes.Category();
variables.name = "Variables";
variables.colour = 330;
variables.custom = "VARIABLE";

var functions = new Classes.Category();
functions.name = "Functions";
functions.colour = 290;
functions.custom = "PROCEDURE";

module.exports = [
  require("./Flow Control"),
  require("./Logic"),
  require("./Math"),
  require("./Text"),
  require("./Lists"),
  require("./Color"),
  require("./Date & Time"),
  new Classes.SepCategory(),
  variables,
  functions,
  new Classes.SepCategory(),
  require("./Channels"),
]
const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "logic_checkbox";
block.message0 = "%1";
block.args0.push(new Classes.ArgCheckbox("check", true));
block.output = "Boolean";
block.tooltip = "Returns either true or false";
block.generator = function () {
  return this.require("./generator.js")();
}

module.exports = block;
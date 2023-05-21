const Classes = require("../../../src/classes");

var mutator = new Classes.Mutator();

mutator.name = "optional_return";
mutator.blocks[require("./optional_return_mutator_dummy").type] = -1;
mutator.mixin = {
  returns: false,

  mutationToDom: function () {
    if (!this.returns) return;

    var mutation = Blockly.utils.xml.createElement("mutation");
    mutation.setAttribute("returns", "true");
    return mutation;
  },

  domToMutation: function (xml) {
    this.returns = xml.getAttribute("returns") == "true";
    this.updateShape();
  },

  decompose: function (workspace) {
    var containerBlock = workspace.newBlock(require("./optional_return_mutator_container").type);
    containerBlock.initSvg();
    containerBlock.setFieldValue(this.returns, "val");
    return containerBlock;
  },

  compose: function (containerBlock) {
    this.returns = containerBlock.getFieldValue("val") == "TRUE";
    this.updateShape();
  },

  updateShape: function () {
    if (this.returns && (this.previousConnection || this.nextConnection || !this.outputConnection)) {
      if (this.previousConnection.isConnected()) this.previousConnection.disconnect();
      this.setPreviousStatement(false);
      if (this.nextConnection.isConnected()) this.nextConnection.disconnect();
      this.setNextStatement(false);
      this.setOutput(true, this.output);
    } else if (!this.returns && (!this.previousConnection || !this.nextConnection || this.outputConnection)) {
      if (this.outputConnection.isConnected()) this.outputConnection.disconnect();
      this.setOutput(false);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  }
};

module.exports = mutator;
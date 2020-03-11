var mutator = {
  name: "embed_footer_mutator",
  blocks: {
    "embed_footer_mutator_icon": 1,
  },
  mixin: {
    icon: false,

    suppressPrefixSuffix: true,

    mutationToDom: function () {
      if (!this.icon) return;

      var mutation = Blockly.utils.xml.createElement("mutation");
      mutation.setAttribute("icon", true);

      return mutation;
    },

    domToMutation: function (xml) {
      this.icon = xml.getAttribute("icon") == "true";
      this.rebuildShape();
    },

    decompose: function (ws) {
      var containerBlock = ws.newBlock("embed_footer_mutator_container");
      containerBlock.initSvg ? containerBlock.initSvg() : null;

      var connection = containerBlock.getFirstStatementConnection();
      if (this.icon) {
        var block = ws.newBlock("embed_footer_mutator_icon");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
      }

      return containerBlock;
    },

    compose: function (containerBlock) {
      this.icon = false;

      var nextBlock = containerBlock.getFirstStatementConnection().targetBlock();
      var connections = {};

      while (nextBlock) {
        switch (nextBlock.type) {
          case "embed_footer_mutator_icon":
            this.icon = true;
            connections.icon = nextBlock.value_;
            break;
          default:
            throw TypeError("Unknown block type: " + nextBlock.type);
        }
        nextBlock = nextBlock.nextConnection && nextBlock.nextConnection.targetBlock();
      }

      this.updateShape();
      this.reconnectChildren(connections);
    },

    saveConnections: function (containerBlock) {
      var nextBlock = containerBlock.getFirstStatementConnection().targetBlock();
      while (nextBlock) {
        switch (nextBlock.type) {
          case "embed_footer_mutator_icon":
            var input = this.getInput("icon");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          default:
            throw TypeError("Unknown block type: " + nextBlock.type);
        }
        nextBlock = nextBlock.nextConnection && nextBlock.nextConnection.targetBlock();
      }
    },

    rebuildShape: function () {
      var connections = {}

      var input = this.getInput("icon");
      if (input) connections.url = input.connection.targetConnection;

      this.updateShape();
      this.reconnectChildren(connections);
    },

    updateShape: function () {
      if (this.getInput("icon") && !this.icon) this.removeInput("icon");

      if (this.icon && !this.getInput("icon")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("https://cdn.discordapp.com/avatars/591694201230721043/d9144ef96b4dda2392c1151bb444539e.png?size=1024", "TEXT");
        this.appendValueInput("icon").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with icon").connection.connect(block.outputConnection);
      }
    },

    reconnectChildren: function (connections) {
      Blockly.Mutator.reconnect(connections.icon, this, "icon");
    },
  }
}

Blockly.Extensions.registerMutator(mutator.name, mutator.mixin, null, Object.keys(mutator.blocks));
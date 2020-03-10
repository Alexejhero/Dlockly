var mutator = {
  name: "embed_mutator",
  blocks: {
    "embed_mutator_name": 1,
    "embed_mutator_color": 1,
    "embed_mutator_description": 1,
    "embed_mutator_field": 10,
    "embed_mutator_footer": 1,
  },
  mixin: {
    name: false,
    color: false,
    description: false,
    fields: 0,
    footer: false,

    suppressPrefixSuffix: true,

    mutationToDom: function () {
      if (!this.name && !this.color && !this.description && !this.field && !this.footer) return;

      var mutation = Blockly.utils.xml.createElement("mutation");
      if (this.name) mutation.setAttribute("name", true);
      if (this.color) mutation.setAttribute("color", true);
      if (this.description) mutation.setAttribute("description", true);
      if (this.fields) mutation.setAttribute("fields", this.fields);
      if (this.footer) mutation.setAttribute("footer", true);

      return mutation;
    },

    domToMutation: function (xml) {
      this.name = xml.getAttribute("name") == "true";
      this.color = xml.getAttribute("color") == "true";
      this.description = xml.getAttribute("description") == "true";
      this.fields = parseInt(xml.getAttribute("fields"), 10);
      this.footer = xml.getAttribute("footer") == "true";
      this.rebuildShape();
    },

    decompose: function (workspace) {
      workspace.options.maxInstances = mutator.blocks;

      var containerBlock = workspace.newBlock("embed_mutator_container");
      containerBlock.initSvg();

      var connection = containerBlock.getFirstStatementConnection();
      if (this.name) {
        var block = workspace.newBlock("embed_mutator_name");
        block.initSvg();
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.color) {
        var block = workspace.newBlock("embed_mutator_color");
        block.initSvg();
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.description) {
        var block = workspace.newBlock("embed_mutator_description");
        block.initSvg();
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      for (var i = 0; i < this.fields; i++) {
        var block = workspace.newBlock("embed_mutator_field");
        block.initSvg();
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.footer) {
        var block = workspace.newBlock("embed_mutator_footer");
        block.initSvg();
        connection.connect(block.previousConnection);
      }

      return containerBlock;
    },

    compose: function (containerBlock) {
      this.name = false;
      this.color = false;
      this.description = false;
      this.fields = 0;
      this.footer = false;

      var nextBlock = containerBlock.getFirstStatementConnection().targetBlock();
      var connections = {
        fields: [],
      };
      while (nextBlock) {
        switch (nextBlock.type) {
          case "embed_mutator_name":
            this.name = true;
            connections.name = nextBlock.value_;
            break;
          case "embed_mutator_color":
            this.color = true;
            connections.color = nextBlock.value_;
            break;
          case "embed_mutator_description":
            this.description = true;
            connections.description = nextBlock.value_;
            break;
          case "embed_mutator_field":
            this.fields++;
            connections.fields.push(nextBlock.value_);
            break;
          case "embed_mutator_footer":
            this.footer = true;
            connections.footer = nextBlock.value_;
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
      var i = 1;
      while (nextBlock) {
        switch (nextBlock.type) {
          case "embed_mutator_name":
            var input = this.getInput("name");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_color":
            var input = this.getInput("color");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_description":
            var input = this.getInput("description");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_field":
            var input = this.getInput("field" + i);
            nextBlock.value_ = input && input.connection.targetConnection;
            i++;
            break;
          case "embed_mutator_footer":
            var input = this.getInput("footer");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          default:
            throw TypeError("Unknown block type: " + nextBlock.type);
        }
        nextBlock = nextBlock.nextConnection && nextBlock.nextConnection.targetBlock();
      }
    },

    rebuildShape: function () {
      var connections = {
        fields: [],
      }

      var input = this.getInput("name");
      if (input) connections.name = input.connection.targetConnection;
      input = this.getInput("color");
      if (input) connections.color = input.connection.targetConnection;
      input = this.getInput("description");
      if (input) connections.description = input.connection.targetConnection;
      var i = 1;
      input = this.getInput("field" + i);
      while (input) {
        connections.fields.push(input);
        i++;
        input = this.getInput("field" + i);
      }
      input = this.getInput("footer");
      if (input) connections.footer = input.connection.targetConnection;

      this.updateShape();
      this.reconnectChildren(connections);
    },

    updateShape: function () {
      if (this.getInput("name")) this.removeInput("name");
      if (this.getInput("color")) this.removeInput("color");
      if (this.getInput("description")) this.removeInput("description");
      var i = 1;
      var input = this.getInput("field" + i);
      while (input) {
        this.removeInput("field" + i);
        i++;
        input = this.getInput("field" + i);
      }
      if (this.getInput("footer")) this.removeInput("footer");

      if (this.name) this.appendValueInput("name").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with title").connection//.setShadowDom(Blockly.Xml.textToDom("<shadow type='text'><field name='TEXT'>Title</field></shadow>"));
      if (this.color) this.appendValueInput("color").setCheck(["Color", "Colour"]).setAlign(Blockly.ALIGN_RIGHT).appendField("with color").connection//.setShadowDom(Blockly.Xml.textToDom("<shadow type='colour_rgb'></shadow>"));
      if (this.description) this.appendValueInput("description").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with description").connection//.setShadowDom(Blockly.Xml.textToDom("<shadow type='text'><field name='TEXT'>Description</field></shadow>"));
      for (var i = 1; i <= this.fields; i++) this.appendValueInput("field" + i).setCheck("EmbedField").setAlign(Blockly.ALIGN_RIGHT).appendField("with field");
      if (this.footer) this.appendValueInput("footer").setCheck("EmbedFooter").setAlign(Blockly.ALIGN_RIGHT).appendField("with footer");
    },

    reconnectChildren: function (connections) {
      Blockly.Mutator.reconnect(connections.name, this, "name");
      Blockly.Mutator.reconnect(connections.color, this, "color");
      Blockly.Mutator.reconnect(connections.description, this, "description");
      for (var i = 1; i <= this.fields; i++) Blockly.Mutator.reconnect(connections.fields[i - 1], this, "field" + i);
      Blockly.Mutator.reconnect(connections.footer, this, "footer");
    }
  }
}

Blockly.Extensions.registerMutator(mutator.name, mutator.mixin, null, Object.keys(mutator.blocks));
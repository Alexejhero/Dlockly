var mutator = {
  name: "embed_mutator",
  blocks: {
    "embed_mutator_color": 1,
    "embed_mutator_author": 1,
    "embed_mutator_title": 1,
    "embed_mutator_url": 1,
    "embed_mutator_thumbnail": 1,
    "embed_mutator_description": 1,
    "embed_mutator_field": 10,
    "embed_mutator_image": 1,
    "embed_mutator_footer": 1,
    "embed_mutator_timestamp": 1,
  },
  mixin: {
    color: false,
    author: false,
    title: false,
    url: false,
    thumbnail: false,
    description: false,
    fields: 0,
    image: false,
    footer: false,
    timestamp: false,

    suppressPrefixSuffix: true,

    mutationToDom: function () {
      if (!this.color && !this.author && !this.title && !this.url && !this.thumbnail && !this.description && !this.fields && !this.image && !this.footer && !this.timestamp) return;

      var mutation = Blockly.utils.xml.createElement("mutation");
      if (this.color) mutation.setAttribute("color", true);
      if (this.author) mutation.setAttribute("author", true);
      if (this.title) mutation.setAttribute("title", true);
      if (this.url) mutation.setAttribute("url", true);
      if (this.thumbnail) mutation.setAttribute("thumbnail", true);
      if (this.description) mutation.setAttribute("description", true);
      if (this.fields) mutation.setAttribute("fields", this.fields);
      if (this.image) mutation.setAttribute("image", true);
      if (this.footer) mutation.setAttribute("footer", true);
      if (this.timestamp) mutation.setAttribute("timestamp", true);

      return mutation;
    },

    domToMutation: function (xml) {
      this.color = xml.getAttribute("color") == "true";
      this.author = xml.getAttribute("author") == "true";
      this.title = xml.getAttribute("title") == "true";
      this.url = xml.getAttribute("url") == "true";
      this.thumbnail = xml.getAttribute("thumbnail") == "true";
      this.description = xml.getAttribute("description") == "true";
      this.fields = parseInt(xml.getAttribute("fields"), 10);
      this.image = xml.getAttribute("image") == "true";
      this.footer = xml.getAttribute("footer") == "true";
      this.timestamp = xml.getAttribute("timestamp") == "true";
      this.rebuildShape();
    },

    decompose: function (ws) {
      var containerBlock = ws.newBlock("embed_mutator_container");
      containerBlock.initSvg ? containerBlock.initSvg() : null;

      var connection = containerBlock.getFirstStatementConnection();
      if (this.color) {
        var block = ws.newBlock("embed_mutator_color");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.author) {
        var block = ws.newBlock("embed_mutator_author");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.title) {
        var block = ws.newBlock("embed_mutator_title");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.url) {
        var block = ws.newBlock("embed_mutator_url");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.thumbnail) {
        var block = ws.newBlock("embed_mutator_thumbnail");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.description) {
        var block = ws.newBlock("embed_mutator_description");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      for (var i = 0; i < this.fields; i++) {
        var block = ws.newBlock("embed_mutator_field");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.image) {
        var block = ws.newBlock("embed_mutator_image");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.footer) {
        var block = ws.newBlock("embed_mutator_footer");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
      }
      if (this.timestamp) {
        var block = ws.newBlock("embed_mutator_timestamp");
        block.initSvg ? block.initSvg() : null;
        connection.connect(block.previousConnection);
      }

      return containerBlock;
    },

    compose: function (containerBlock) {
      this.color = false;
      this.author = false;
      this.title = false;
      this.url = false;
      this.thumbnail = false;
      this.description = false;
      this.fields = 0;
      this.image = false;
      this.footer = false;
      this.timestamp = false;

      var nextBlock = containerBlock.getFirstStatementConnection().targetBlock();
      var connections = {
        fields: [],
      };

      while (nextBlock) {
        switch (nextBlock.type) {
          case "embed_mutator_color":
            this.color = true;
            connections.color = nextBlock.value_;
            break;
          case "embed_mutator_author":
            this.author = true;
            connections.author = nextBlock.value_;
            break;
          case "embed_mutator_title":
            this.title = true;
            connections.title = nextBlock.value_;
            break;
          case "embed_mutator_url":
            this.url = true;
            connections.url = nextBlock.value_;
            break;
          case "embed_mutator_thumbnail":
            this.thumbnail = true;
            connections.thumbnail = nextBlock.value_;
            break;
          case "embed_mutator_description":
            this.description = true;
            connections.description = nextBlock.value_;
            break;
          case "embed_mutator_field":
            this.fields++;
            connections.fields.push(nextBlock.value_);
            break;
          case "embed_mutator_image":
            this.image = true;
            connections.image = nextBlock.value_;
            break;
          case "embed_mutator_footer":
            this.footer = true;
            connections.footer = nextBlock.value_;
            break;
          case "embed_mutator_timestamp":
            this.timestamp = true;
            connections.timestamp = nextBlock.value_;
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
          case "embed_mutator_color":
            var input = this.getInput("color");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_author":
            var input = this.getInput("author");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_title":
            var input = this.getInput("title");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_url":
            var input = this.getInput("url");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_thumbnail":
            var input = this.getInput("thumbnail");
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
          case "embed_mutator_image":
            var input = this.getInput("image");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_footer":
            var input = this.getInput("footer");
            nextBlock.value_ = input && input.connection.targetConnection;
            break;
          case "embed_mutator_timestamp":
            var input = this.getInput("timestamp");
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

      var input = this.getInput("color");
      if (input) connections.color = input.connection.targetConnection;
      input = this.getInput("author");
      if (input) connections.author = input.connection.targetConnection;
      input = this.getInput("title");
      if (input) connections.title = input.connection.targetConnection;
      input = this.getInput("url");
      if (input) connections.url = input.connection.targetConnection;
      input = this.getInput("thumbnail");
      if (input) connections.thumbnail = input.connection.targetConnection;
      input = this.getInput("description");
      if (input) connections.description = input.connection.targetConnection;
      var i = 1;
      input = this.getInput("field" + i);
      while (input) {
        connections.fields.push(input);
        i++;
        input = this.getInput("field" + i);
      }
      input = this.getInput("image");
      if (input) connections.image = input.connection.targetConnection;
      input = this.getInput("footer");
      if (input) connections.footer = input.connection.targetConnection;
      input = this.getInput("timestamp");
      if (input) connections.timestamp = input.connection.targetConnection;

      this.updateShape();
      this.reconnectChildren(connections);
    },

    updateShape: function () {
      if (this.getInput("color") && !this.color) this.removeInput("color");
      if (this.getInput("author") && !this.author) this.removeInput("author");
      if (this.getInput("title") && !this.title) this.removeInput("title");
      if (this.getInput("url") && !this.url) this.removeInput("url");
      if (this.getInput("thumbnail") && !this.thumbnail) this.removeInput("thumbnail");
      if (this.getInput("description") && !this.description) this.removeInput("description");
      var i = 1;
      var input = this.getInput("field" + i);
      while (input) {
        if (this.fields < i) this.removeInput("field" + i);
        i++;
        input = this.getInput("field" + i);
      }
      if (this.getInput("image") && !this.image) this.removeInput("image");
      if (this.getInput("footer") && !this.footer) this.removeInput("footer");
      if (this.getInput("timestamp") && !this.timestamp) this.removeInput("timestamp");

      if (this.color && !this.getInput("color")) {
        var block = workspace.newBlock("colour_picker");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        this.appendValueInput("color").setCheck(["Color", "Colour", "String"]).setAlign(Blockly.ALIGN_RIGHT).appendField("with color").connection.connect(block.outputConnection);
      }
      if (this.author && !this.getInput("author")) {
        var block = workspace.newBlock("embed_author");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);

        var name = workspace.newBlock("text");
        name.initSvg ? name.initSvg() : null;
        name.render ? name.render() : null;
        name.setShadow(true);
        name.setFieldValue("name", "TEXT");
        block.getConnections_()[1].connect(name.outputConnection);

        block.updateShape();

        this.appendValueInput("author").setCheck("EmbedAuthor").setAlign(Blockly.ALIGN_RIGHT).appendField("with author").connection.connect(block.outputConnection);
      }
      if (this.title && !this.getInput("title")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("Title", "TEXT");
        this.appendValueInput("title").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with title").connection.connect(block.outputConnection);
      }
      if (this.url && !this.getInput("url")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "TEXT");
        this.appendValueInput("url").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with url").connection.connect(block.outputConnection);
      }
      if (this.thumbnail && !this.getInput("thumbnail")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("https://cdn.discordapp.com/avatars/591694201230721043/d9144ef96b4dda2392c1151bb444539e.png?size=1024", "TEXT");
        this.appendValueInput("thumbnail").setCheck(["Image", "String"]).setAlign(Blockly.ALIGN_RIGHT).appendField("with thumbnail").connection.connect(block.outputConnection);
      }
      if (this.description && !this.getInput("description")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("Description", "TEXT");
        this.appendValueInput("description").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField("with description").connection.connect(block.outputConnection);
      }
      for (var i = 1; i <= this.fields; i++) {
        if (this.getInput("field" + i)) continue;
        var block = workspace.newBlock("embed_field");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);

        var name = workspace.newBlock("text");
        name.initSvg ? name.initSvg() : null;
        name.render ? name.render() : null;
        name.setShadow(true);
        name.setFieldValue("name", "TEXT");
        block.getConnections_()[1].connect(name.outputConnection);

        var icon = workspace.newBlock("text");
        icon.initSvg ? icon.initSvg() : null;
        icon.render ? icon.render() : null;
        icon.setShadow(true);
        icon.setFieldValue("value", "TEXT");
        block.getConnections_()[2].connect(icon.outputConnection);

        var url = workspace.newBlock("logic_checkbox");
        url.initSvg ? url.initSvg() : null;
        url.render ? url.render() : null;
        url.setShadow(true);
        url.setFieldValue("TRUE", "check");
        block.getConnections_()[3].connect(url.outputConnection);

        this.appendValueInput("field" + i).setCheck("EmbedField").setAlign(Blockly.ALIGN_RIGHT).appendField("with field").connection.connect(block.outputConnection);
      }
      if (this.image && !this.getInput("image")) {
        var block = workspace.newBlock("text");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        block.setFieldValue("https://cdn.discordapp.com/avatars/591694201230721043/d9144ef96b4dda2392c1151bb444539e.png?size=1024", "TEXT");
        this.appendValueInput("image").setCheck(["Image", "String"]).setAlign(Blockly.ALIGN_RIGHT).appendField("with image").connection.connect(block.outputConnection);
      }
      if (this.footer && !this.getInput("footer")) {
        var block = workspace.newBlock("embed_footer");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);

        var text = workspace.newBlock("text");
        text.initSvg ? text.initSvg() : null;
        text.render ? text.render() : null;
        text.setShadow(true);
        text.setFieldValue("text", "TEXT");
        block.getConnections_()[1].connect(text.outputConnection);

        block.updateShape();

        this.appendValueInput("footer").setCheck("EmbedFooter").setAlign(Blockly.ALIGN_RIGHT).appendField("with footer").connection.connect(block.outputConnection);
      }
      if (this.timestamp && !this.getInput("timestamp")) {
        var block = workspace.newBlock("date_now");
        block.initSvg ? block.initSvg() : null;
        block.render ? block.render() : null;
        block.setShadow(true);
        this.appendValueInput("timestamp").setCheck(["Date", "Time"]).setAlign(Blockly.ALIGN_RIGHT).appendField("with timestamp").connection.connect(block.outputConnection);
      }

      // TODO: Fix field inputs deleting/adding in wrong places
      // TODO: Fix timestamp

      this.orderInputs();
    },

    reconnectChildren: function (connections) {
      Blockly.Mutator.reconnect(connections.color, this, "color");
      Blockly.Mutator.reconnect(connections.author, this, "author");
      Blockly.Mutator.reconnect(connections.title, this, "title");
      Blockly.Mutator.reconnect(connections.url, this, "url");
      Blockly.Mutator.reconnect(connections.thumbnail, this, "thumbnail");
      Blockly.Mutator.reconnect(connections.description, this, "description");
      for (var i = 1; i <= this.fields; i++) Blockly.Mutator.reconnect(connections.fields[i - 1], this, "field" + i);
      Blockly.Mutator.reconnect(connections.image, this, "image");
      Blockly.Mutator.reconnect(connections.footer, this, "footer");
      Blockly.Mutator.reconnect(connections.timestamp, this, "timestamp");
    },

    orderInputs: function () {
      var inputs = this.inputList.map(i => i.name);
      inputs.sort((a, b) => {
        function getIntValue(x) {
          switch (x) {
            case "author": return 0;
            case "title": return 1;
            case "url": return 2;
            case "thumbnail": return 3;
            case "description": return 4;
            case "image": return 100;
            case "footer": return 101;
            case "timestamp": return 102;
          }
          if (!x.startsWith("field")) return -1;
          var field = parseInt(x.substring(5), 10);
          return 20 + field;
        }

        a = getIntValue(a);
        b = getIntValue(b);

        if (a < b) return -1;
        if (a == b) return 0;
        return 1;
      });
      inputs = inputs.reverse();

      for (var i = 0; i < inputs.length; i++) {
        this.moveInputBefore(inputs[i], i == 0 ? null : inputs[i - 1]);
      }
    }
  }
}

Blockly.Extensions.registerMutator(mutator.name, mutator.mixin, null, Object.keys(mutator.blocks));
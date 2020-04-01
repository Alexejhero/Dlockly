const B = require("node-blockly");
const Classes = require("../../../src/classes");

module.exports = new Classes.Block(__dirname);
this.type = "embed";
this.message0 = "new embed";
this.output = "Embed";
this.tooltip = "Generates a message embed";
this.mutator = "embed_mutator";
this.generator = generator;

/**
 * @param {B} Blockly
 * @param {B.Block} block
 */
function generator(Blockly, block) {
  var str = 'new (require(\\\"discord.js\\\").MessageEmbed)({';
  if (this.color) str += `color: ${Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.author) str += `author: ${Blockly.JavaScript.valueToCode(block, 'author', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.title) str += `title: ${Blockly.JavaScript.valueToCode(block, 'title', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.url) str += `url: ${Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.thumbnail) str += `thumbnail: {url: ${Blockly.JavaScript.valueToCode(block, 'thumbnail', Blockly.JavaScript.ORDER_ATOMIC)}},`;
  if (this.description) str += `description: ${Blockly.JavaScript.valueToCode(block, 'description', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.fields > 0) { 
    str += 'fields: [';
    for (var i = 1; i <= this.fields; i++) str += `${Blockly.JavaScript.valueToCode(block, 'field' + i, Blockly.JavaScript.ORDER_ATOMIC)},`; 
    str += '],';
  }
  if (this.image) str += `image: {url: ${Blockly.JavaScript.valueToCode(block, 'image', Blockly.JavaScript.ORDER_ATOMIC)}},`;
  if (this.footer) str += `footer: ${Blockly.JavaScript.valueToCode(block, 'footer', Blockly.JavaScript.ORDER_ATOMIC)},`;
  if (this.timestamp) str += `timestamp: ${Blockly.JavaScript.valueToCode(block, 'timestamp', Blockly.JavaScript.ORDER_ATOMIC)},`;

  return [str, Blockly.JavaScript_ORDER_ATOMIC];
}
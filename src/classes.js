const Blockly = require("node-blockly");
const decache = require("decache");
const fs = require("fs");
const path = require("path");

/**
 * @typedef {"input_value" | "input_statement" | "input_dummy" | "field_label_serializable" | "field_input" | "field_number" | "field_angle" | "field_dropdown" | "field_checkbox" | "field_colour" | "field_variable" | "field_image"} BlockType
 * @typedef {"LEFT" | "CENTRE" | "RIGHT"} BlockAlign
 * @typedef {"toplevelparent" | "!toplevelparent" | "blockexists" | "!blockexists" | "parent" | "!parent" | "surroundparent" | "!surroundparent" | "custom" | "notempty"} RestrictionType
 */

class Base {
  /** @type {string} */
  _dirname;

  /** @param {string} dirname */
  constructor(dirname) {
    this._dirname = dirname;
  }

  /** @param {string} p */
  readFromFile(p) {
    p = path.join(this._dirname, p);
    return fs.readFileSync(p, "utf-8");
  }
}

class Block extends Base {
  /** @type {string} */
  label = undefined;

  /** @type {string[]} */
  icons = [];

  /** @type {string} */
  type = "";

  /** @type {string} */
  message0 = "";

  /** @type {Arg[]} */
  args0 = [];

  /** @type {number} */
  max;

  /** @type {string|string[]} */
  previousStatement = undefined;

  /** @type {string|string[]} */
  nextStatement = undefined;

  /** @type {boolean} */
  inputsInline;

  /** @type {string|string[]} */
  output = undefined;

  /** @type {string} */
  optionalReturn;

  /** @type {number|string} */
  colour = "#000000";

  /** @type {string} */
  style;

  /** @type {string} */
  tooltip = "";

  /** @type {string} */
  helpUrl = "";

  /** @type {Mutator} */
  mutator;

  /** @type {string[]} */
  extensions;

  /** @type {Category} */
  category;

  /** @type {function(Blockly,Blockly.Block):[string,number]|string} */
  generator = function () { };

  /** @type {string} */
  extra = "";

  /** @type {Restriction[]} */
  restrictions = [];

  /** @type {boolean} */
  default = false;

  /** @type {boolean} */
  deprecated = false;

  /** @type {boolean} */
  hidden = false;

  /** @type {string[]} */
  reserved = [];

  /** @param {string} path */
  readShadows(path) {
    if (!path) path = "shadows.xml";
    return this.readFromFile(path).replace(/\n/g, " ");
  }
}

class Label extends Block {
  /** @type {string} */
  label;

  constructor(label) {
    super();
    this.label = label;
  }
}

class Category extends Base {
  /** @type {boolean} */
  sep = false;

  /** @type {string} */
  name = "";

  /** @type {string|number} */
  colour = "#000000";

  /** @type {Block[]} */
  blocks = [];

  /** @type {"PROCEDURE"|"VARIABLE"} */
  custom;

  /** @type {Category[]} */
  subcategories = [];

  /**
   * @param {string} name 
   * @param {string|number} colour 
   * @param {"PROCEDURE"|"VARIABLE"} custom 
   * @param {string} _dirname
   */
  constructor(name, colour, custom, _dirname) {
    super(_dirname);
    this.name = name;
    this.colour = colour;
    this.custom = custom;
  }
}

class SepCategory extends Category {
  /** @type {true} */
  sep = true;

  constructor() {
    super();
    this.sep = true;
  }
}

class Restriction {
  /** @type {RestrictionType} */
  type;

  /** @type {string} */
  message;

  /** @type {string[]} */
  types;

  /** 
   * @type {function(Blockly,Blockly.Block):boolean} 
   */
  code;

  /** 
   * @param {RestrictionType} type
   * @param {string} message
   * @param {string[]|function(Blockly,Blockly.Block):boolean} types 
   */
  constructor(type, message, types) {
    this.type = type;
    this.message = message;
    if (this.type == "custom") this.code = types;
    else this.types = types;
  }
}

class Mutator {
  /** @type {string} */
  name;

  /** @type {{string:number}} */
  blocks = {};

  mixin = {
    suppressPrefixSuffix: true,

    /**
     * @returns {Element}
     */
    mutationToDom() { },

    /**
     * @param {Element} xml
     */
    domToMutation(xml) { },

    /**
     * @param {Blockly.Workspace} ws
     * @returns {Blockly.Block}
     */
    decompose(ws) { },

    /**
     * @param {Blockly.Block} containerBlock
     */
    compose(containerBlock) { },

    /**
     * @this Blockly.Block
     */
    updateShape() { },
  };
}

// #region Arg

class Arg {
  /** @type {BlockType} */
  type = "";

  /** @type {string} */
  name = "";

  /** @type {BlockAlign} */
  align;

  /**
   * @param {BlockType} type 
   * @param {string} name 
   * @param {BlockAlign} align 
   */
  constructor(type, name, align) {
    this.type = type;
    this.name = name;
    this.align = align;
  }
}

class ArgDummy extends Arg {
  /** @type {"input_dummy"} */
  type = "input_dummy";

  constructor(align) {
    super("input_dummy", null, align);
  }
}

class ArgValue extends Arg {
  /** @type {"input_value"} */
  type = "input_value";

  /** @type {string} */
  check;

  /**
   * @param {string} name 
   * @param {string} check 
   * @param {BlockAlign} align 
   */
  constructor(name, check, align) {
    super("input_value", name, align);
    this.check = check;
  }
}

class ArgStatement extends Arg {
  /** @type {input_statement"} */
  type = "input_statement";

  /** @type {string} */
  check;

  /**
   * @param {string} name 
   * @param {string} check 
   * @param {BlockAlign} align 
   */
  constructor(name, check, align) {
    super("input_statement", name, align);
    this.check = check;
  }
}

class ArgLabelSerializable extends Arg {
  /** @type {"field_label_serializable"} */
  type = "field_label_serializable";

  /** @type {string} */
  text;

  /**
   * @param {string} name 
   * @param {string} text 
   * @param {BlockAlign} align 
   */
  constructor(name, text, align) {
    super("field_label_serializable", name, align);
    this.text = text;
  }
}

class ArgText extends Arg {
  /** @type {"field_input"} */
  type = "field_input";

  /** @type {string} */
  text;

  /**
   * @param {string} name 
   * @param {string} text 
   * @param {BlockAlign} align 
   */
  constructor(name, text, align) {
    super("field_input", name, align);
    this.text = text;
  }
}

class ArgNumber extends Arg {
  /** @type {"field_number"} */
  type = "field_number";

  /** @type {number} */
  value;

  /** @type {number} */
  min;

  /** @type {number} */
  max;

  /** @type {number} */
  precision;

  /**
   * @param {string} name 
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @param {number} precision 
   * @param {BlockAlign} align 
   */
  constructor(name, value, min, max, precision, align) {
    super("field_number", name, align);
    this.value = value;
    this.min = min;
    this.max = max;
    this.precision = precision;
  }
}

class ArgAngle extends Arg {
  /** @type {"field_angle"} */
  type = "field_angle";

  /** @type {number} @*/
  angle;

  /**
   * @param {string} name 
   * @param {number} angle 
   * @param {BlockAlign} align 
   */
  constructor(name, angle, align) {
    super("field_angle", name, align);
    this.angle = angle;
  }
}

class ArgDropdown extends Arg {
  /** @type {"field_dropdown"} */
  type = "field_dropdown";

  /** @type {string[][]} */
  options;

  /**
   * @param {string} name 
   * @param {string[][]} options 
   * @param {BlockAlign} align 
   */
  constructor(name, options, align) {
    super("field_dropdown", name, align);
    this.options = options;
  }
}

class ArgCheckbox extends Arg {
  /** @type {"field_checkbox"} */
  type = "field_checkbox";

  /** @type {boolean} */
  checked;

  /**
   * @param {string} name 
   * @param {boolean} checked 
   * @param {BlockAlign} align 
   */
  constructor(name, checked, align) {
    super("field_checkbox", name, align);
    this.checked = checked;
  }
}

class ArgColour extends Arg {
  /** @type {"field_colour"} */
  type = "field_colour";

  /** @type {string} */
  colour;

  /**
   * @param {string} name 
   * @param {string} colour 
   * @param {BlockAlign} align 
   */
  constructor(name, colour, align) {
    super("field_colour", name, align);
    this.colour = colour;
  }
}

class ArgVariable extends Arg {
  /** @type {"field_variable"} */
  type = "field_variable";

  /** @type {string} */
  variable;

  /**
   * @param {string} name 
   * @param {string} variable 
   * @param {BlockAlign} align 
   */
  constructor(name, variable, align) {
    super("field_variable", name, align);
    this.variable = variable;
  }
}

class ArgImage extends Arg {
  /** @type {"field_image"} */
  type = "field_image";

  /** @type {string} */
  src;

  /** @type {number} */
  width;

  /** @type {number} */
  height;

  /** @type {string} */
  alt;

  /** @type {boolean} */
  flipRtl;

  /**
   * @param {string} name 
   * @param {string} src
   * @param {number} width 
   * @param {number} height 
   * @param {string} alt
   * @param {boolean} flipRtl
   * @param {BlockAlign} align 
   */
  constructor(name, src, width, height, alt, flipRtl, align) {
    super("field_image", name, align);
    this.src = src;
    this.width = width || 15;
    this.height = height || 15;
    this.alt = alt;
    this.flipRtl = flipRtl;
  }
}

// #endregion

module.exports = {
  Block,
  Label,
  Restriction,
  Category,
  SepCategory,
  Mutator,
  Arg,
  ArgDummy,
  ArgValue,
  ArgStatement,
  ArgLabelSerializable,
  ArgText,
  ArgNumber,
  ArgAngle,
  ArgDropdown,
  ArgCheckbox,
  ArgColour,
  ArgVariable,
  ArgImage,
}
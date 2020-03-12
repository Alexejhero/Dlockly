const fs = require("fs");
const path = require("path");

/**
 * @typedef {"input_value" | "input_statement" | "input_dummy" | "field_label_serializable" | "field_input" | "field_number" | "field_angle" | "field_dropdown" | "field_checkbox" | "field_colour" | "field_variable" | "field_image"} BlockType
 * @typedef {"LEFT" | "CENTRE" | "RIGHT"} BlockAlign
 */

class Block {
  /** @type {BlockRestriction[]} */
  restrictions = [];

  /** @type {string[]} */
  icons = [];

  /** @type {string} */
  type = "";

  /** @type {string} */
  message0 = "";

  /** @type {Arg[]} */
  args0 = [];

  /** @type {string} */
  previousStatement;

  /** @type {string} */
  nextStatement;

  /** @type {boolean} */
  inputsInline;

  /** @type {string} */
  output;

  /** @type {number|string} */
  colour;

  /** @type {string} */
  tooltip = "";

  /** @type {string} */
  helpUrl;

  /** @type {string} */
  category;

  /** @type {(block)=>{} | Function} */
  generator;

  /** @type {Function} */
  extra = function () { return ""; }

  /** @type {boolean} */
  default = false;

  /** @type {boolean} */
  deprecated = false;

  /** @type {boolean} */
  hidden = false;

  /** 
   * @type {string}
   * @private 
   */
  _dirname;

  constructor(dirname) {
    this._dirname = dirname;
  }

  readFromFile(p) {
    p = path.join(this._dirname, p);
    return fs.readFileSync(p, "utf-8");
  }
}

class BlockRestriction {
  /** @type {"toplevelparent" | "!toplevelparent" | "blockexists" | "!blockexists" | "parent" | "!parent" | "surroundparent" | "!surroundparent" | "custom" | "notempty"} */
  type;

  /** @type {string} */
  message;

  /** @type {string[]} */
  types;
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
  Restriction: BlockRestriction,
  Args: {
    Arg,
    Value: ArgValue,
    Statement: ArgStatement,
    Label: ArgLabelSerializable,
    Text: ArgText,
    number: ArgNumber,
    Angle: ArgAngle,
    Dropdown: ArgDropdown,
    Checkbox: ArgCheckbox,
    Colour: ArgColour,
    Variable: ArgVariable,
    Image: ArgImage,
  },
}
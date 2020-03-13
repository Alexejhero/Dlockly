function disableUnapplicable(event) {
  var workspace = Blockly.Workspace.getById(event.workspaceId);
  var blocks = workspace.getAllBlocks();
  var warnings = [];

  for (var block of blocks) {
    if (!restrictions[block.type]) restrictions[block.type] = [];

    if (block.disabled || block.getInheritedDisabled()) {
      block.setWarningText(null);
      continue;
    }

    for (var i = 0; i < restrictions[block.type].length; i++) {
      var res = restrictions[block.type][i];
      if (!validateConfiguration(block, res)) continue;
      if (!validateRestriction(block, blocks, res)) {
        block.setWarningText(res.message, i.toString());
        warnings.push(res.message);
      } else {
        block.setWarningText(null, i.toString());
      }
    }
  }

  return warnings;
};

function validateRestriction(block, blocks, res) {
  var reverse = false;
  var type = res.type;
  if (type != "custom") {
    if (type.startsWith("!")) {
      type = type.substring(1);
      reverse = true;
    }
    switch (type) {
      case "toplevelparent":
        return (res.types.includes(getTopLevelParent(block).type)) != reverse;
      case "blockexists":
        return (blocks.filter(b => res.types.includes(b.type) && !b.getInheritedDisabled()).length > 0) != reverse;
      case "parent":
        return (res.types.includes(block.getParent().type)) != reverse;
      case "surroundparent":
        return (getSurroundParents(block).filter(t => res.types.includes(t)).length > 0) != reverse;
      case "notempty":
        for (var t of res.types)
          if (!block.getInput(t).connection.targetBlock()) return false;
        return true;
      default:
        return true;
    }
  } else {
    eval("var func = " + res.code);
    return func(Blockly, block);
  }
}

function validateConfiguration(block, res) {
  switch (res.type) {
    case "toplevelparent":
    case "!toplevelparent":
      return getTopLevelParent(block) && !getTopLevelParent(block).getInheritedDisabled();
    case "blockexists":
    case "!blockexists":
      return true;
    case "parent":
    case "!parent":
      return block.getParent() && !block.getParent().getInheritedDisabled();
    case "surroundparent":
    case "!surroundparent":
      return block.getSurroundParent() && !block.getSurroundParent().getInheritedDisabled();
    case "custom":
    case "notempty":
    default:
      return false;
  }
}

function getTopLevelParent(block) {
  if (!block) return undefined;
  if (!block.getParent()) return block;

  return getTopLevelParent(block.getParent());
}

function getSurroundParents(block) {
  var result = [];
  block = block.getSurroundParent();
  while (block) {
    result.push(block.type);
    block = block.getSurroundParent();
  }
  return result;
}
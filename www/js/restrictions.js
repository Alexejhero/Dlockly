function disableUnapplicable(event) {
  var workspace = Blockly.Workspace.getById(event.workspaceId);
  var blocks = workspace.getAllBlocks(false);

  for (var block of blocks) {
    if (!block) continue;
    if (!document.restrictions[block.type]) document.restrictions[block.type] = [];

    if (block.disabled || block.getInheritedDisabled()) {
      block.setWarningText(null);
      continue;
    }

    var warnings = [];

    for (var i = 0; i < document.restrictions[block.type].length; i++) {
      var res = document.restrictions[block.type][i];
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
      case "deprecated":
        return false;
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
    var _return = true;
    eval(res.code);
    return _return;
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
    case "deprecated":
      return true;
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
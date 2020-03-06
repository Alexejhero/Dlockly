const beautify = require('js-beautify');
const esprima = require('esprima');

module.exports = function (js) {
  var tokens = esprima.tokenize(js);
  for (var token of tokens) {
    if (token.type == "Keyword" && token.value == "function") {
      token.value = "async function";
    }
  }
  return beautify(tokens.map(t => t.value).join(" "));
}
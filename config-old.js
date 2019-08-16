var chn, msg;

function Respond_to_bot_message(chn, msg) {
  await chn.send(msg);}



module.exports.message = async message => { try {  Respond_to_bot_message(message.channel, message);
} catch (e) { require("../../src/errors").onerror("610877150181982210", e); } }
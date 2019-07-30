const server = require('../server');

module.exports.getVotes = function (userid) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return server.db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).votes;
}

module.exports.getTotalVotes = function (userid) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return server.db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).totalVotes;
}

module.exports.addVotes = function (userid, number) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  server.db.prepare("UPDATE votedata SET votes = votes + ? WHERE userid=?;").run(number, userid);
  server.db.prepare("UPDATE votedata SET totalVotes = totalVotes + ? WHERE userid=?;").run(number, userid);
}
'use strict';
module.exports.getVotes = function (userid, db) {
  db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).votes;
}

module.exports.getTotalVotes = function (userid, db) {
  db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).totalVotes;
}

module.exports.addVotes = function (userid, number, db) {
  db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  db.prepare("UPDATE votedata SET votes = votes + ? WHERE userid=?;").run(number, userid);
  db.prepare("UPDATE votedata SET totalVotes = totalVotes + ? WHERE userid=?;").run(number, userid);
}
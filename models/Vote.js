const sql = require('../db/db');

const Vote = function(vote) {
  this.pollId = vote.pollId;
  this.userId = vote.userId;
  this.vote = vote.vote;
};

Vote.create = (newVote, result) => {
  sql.query('INSERT INTO votes SET ?', newVote, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
  });
};

Vote.getVotesForPoll = (pollId, result) => {
  sql.query('SELECT * FROM votes WHERE pollId = ?', pollId, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Vote;

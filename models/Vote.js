const sql = require('../db/db');

const Vote = function (vote) {
  this.id = vote.id;
  this.user_id = vote.user_id;
  this.poll_id = vote.poll_id;
  this.question_id = vote.question_id;
  this.option_id = vote.option_id;
};

Vote.create = (newVote, result) => {
  sql.query('INSERT INTO votes (user_id, poll_id, question_id, option_id) VALUES (?, ?, ?, ?)', [newVote.user_id, newVote.poll_id, newVote.question_id, newVote.option_id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newVote });
  });
};

Vote.getVotesForPoll = (pollId, result) => {
  sql.query('SELECT * FROM votes WHERE poll_id = ?', pollId, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Vote.getUserVotes = (userId, result) => {
  sql.query('SELECT poll_id FROM votes WHERE user_id = ?', userId, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    const userVotes = res.map((vote) => vote.poll_id);
    result(null, userVotes);
  });
};

module.exports = Vote;

// models/vote.js
const db = require('../db/db');

class Vote {
  static create(userId, pollId, questionId, optionId) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO votes (user_id, poll_id, question_id, option_id) VALUES (?, ?, ?, ?)', [userId, pollId, questionId, optionId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static calculateRewards(userId) {
    return new Promise((resolve, reject) => {
      // Implement the logic to calculate rewards based on user's votes
      // Query the database and return the rewards information
    });
  }
}

module.exports = Vote;

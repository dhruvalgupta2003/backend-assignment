const sql = require('../db/db');

const Question = function (question) {
  this.poll_id = question.poll_id;
  this.question_text = question.question_text;
  this.question_type = question.question_type;
};

Question.create = (newQuestion, result) => {
  sql.query('INSERT INTO questions SET ?', newQuestion, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newQuestion });
  });
};

Question.getQuestionSetsForPoll = (pollId, result) => {
    sql.query('SELECT * FROM questions WHERE poll_id = ?', pollId, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    });
  };
  

  Question.getFirstQuestionForPoll = (pollId, result) => {
    sql.query('SELECT * FROM questions WHERE poll_id = ? LIMIT 1', pollId, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length > 0) {
        result(null, res[0]);
      } else {
        result(null, null);
      }
    });
  };

module.exports = Question;

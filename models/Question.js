const sql = require('../db/db');

const Question = function (question) {
  this.pollId = question.pollId;
  this.questionText = question.questionText;
  this.questionType = question.questionType;
};

Question.create = (newQuestion, result) => {
  sql.query(
    'INSERT INTO questions (poll_id, question_text, question_type) VALUES (?, ?, ?)',
    [newQuestion.pollId, newQuestion.questionText, newQuestion.questionType],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId });
    }
  );
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

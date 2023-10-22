const sql = require('../db/db');

const Option = function(option) {
  this.question_id = option.question_id;
  this.options = option.options;
};

Option.create = (newOption, result) => {
  sql.query('INSERT INTO options SET ?', newOption, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newOption });
  });
};

module.exports = Option;

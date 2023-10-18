const sql = require('../db/db');

const Poll = function(poll) {
  this.title = poll.title;
  this.category = poll.category;
  this.start_date = poll.start_date;
  this.end_date = poll.end_date;
  this.min_reward = poll.min_reward;
  this.max_reward = poll.max_reward;
};

Poll.create = (newPoll, result) => {
  sql.query('INSERT INTO polls SET ?', newPoll, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    // console.log('created poll: ', { id: res.insertId, ...newPoll });
    result(null, { id: res.insertId, ...newPoll });
  });
};

Poll.findById = (id, result) => {
  sql.query(`SELECT * FROM polls WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log('found poll: ', res[0]);
      result(null, res[0]);
      return;
    }
    // Not found Poll with the id
    result({ kind: 'not_found' }, null);
  });
};

Poll.getAll = (title, result) => {
  let query = 'SELECT * FROM polls';

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('polls: ', res);
    result(null, res);
  });
};

Poll.updateById = (id, poll, result) => {
  sql.query(
    'UPDATE polls SET title = ?, category = ?, start_date = ?, end_date = ?, min_reward = ?, max_reward = ? WHERE id = ?',
    [poll.title, poll.category, poll.start_date, poll.end_date, poll.min_reward, poll.max_reward, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // Not found Poll with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('updated poll: ', { id: id, ...poll });
      result(null, { id: id, ...poll });
    }
  );
};

Poll.remove = (id, result) => {
  sql.query('DELETE FROM polls WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // Not found Poll with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted poll with id: ', id);
    result(null, res);
  });
};

Poll.removeAll = result => {
  sql.query('DELETE FROM polls', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} polls`);
    result(null, res);
  });
};

module.exports = Poll;
const sql = require("../db/db");

const User = function (user) {
  this.username = user.username;
  // Add more user properties here as needed
};

User.create = (newUser, result) => {
    sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
  
      // Return the inserted ID along with the newUser object
      result(null, { id: res.insertId, ...newUser });
    });
  };

User.getAll = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

User.findById = (userId, result) => {
  sql.query("SELECT * FROM users WHERE id = ?", userId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // User with the specified ID not found
    result({ kind: "not_found" }, null);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET username = ? WHERE id = ?",
    [user.username, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // User with the specified ID not found
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // User with the specified ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { message: "User deleted successfully", id: id });
  });
};
module.exports = User;

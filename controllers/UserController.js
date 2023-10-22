const User = require("../models/User");

// Create a new user
exports.createUser = (req, res) => {
  const newUser = new User({
    username: req.body.username,
  });

  User.create(newUser, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Failed to create a new user",
          data: null,
          error: err,
        });
    }
    
    res
      .status(201)
      .json({ success: true, message: "User created successfully",  data: { id: user.id, username: user.username }, error: null });
  });
  
};

// Get a list of all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch users", data: null, error: err });
    }

    res
      .status(200)
      .json({
        message: "Users fetched successfully",
        data: users,
        error: null,
      });
  });
};

// Update a user by ID
exports.updateUser = (req, res) => {
  const userId = req.params.id;
//   console.log()
  const updatedUser = new User({
    username: req.body.username,
  });


  User.updateById(userId, updatedUser, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .json({
            message: `User with ID ${userId} not found`,
            data: null,
            error: err,
          });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to update user", data: null, error: err });
      }
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: user, error: null });
  });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.remove(userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .json({
            message: `User with ID ${userId} not found`,
            data: null,
            error: err,
          });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to delete user", data: null, error: err });
      }
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", data: user, error: null });
  });
};

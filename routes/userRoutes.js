const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/create-user', UserController.createUser);

// Get a list of all users
router.get('/users', UserController.getAllUsers);

// Get a User by id
// router.get('/users/:id', UserController);

router.post('/users/:id', UserController.updateUser);

// Delete a user by ID
router.delete('/users/:id', UserController.deleteUser);


module.exports = router;

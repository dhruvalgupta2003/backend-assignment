const express = require('express');
const router = express.Router();

// Import the Option controller
const optionController = require('../controllers/optionsController');

// Create a new option
router.post('/', optionController.createOption);

// Add more routes for updating, deleting, or retrieving options if needed

module.exports = router;

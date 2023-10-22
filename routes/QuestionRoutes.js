const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Create a new question
router.post('/questions', questionController.createQuestion);

// Fetch all questions for a specific poll
// router.get('/polls/:pollId/questions', questionController.getQuestionsForPoll);
module.exports = router;

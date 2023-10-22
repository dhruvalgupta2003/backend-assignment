const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Create a new vote
router.post('/votes', voteController.createVote);

// Get votes for a specific poll by pollId
router.get('/poll/:pollId/votes', voteController.getVotesForPoll);

// Get votes for a specific user by userId
router.get('/user/:userId/votes', voteController.getUserVotes);
module.exports = router;
const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Create a new vote
router.post('/votes', voteController.createVote);

// Fetch all votes for a specific poll
router.get('/polls/:pollId/votes',voteController.getVotesForPoll);

module.exports = router;
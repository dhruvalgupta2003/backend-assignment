// routes/polls.js
const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollsController');

router.post('/create-poll', pollController.createPoll);
router.get('/all-polls', pollController.getAllPolls);
router.put('/update-poll/:pollId', pollController.updatePoll);
router.get('/user-polls/:userId', pollController.getUserPollsAndQuestions);
router.post('/submit-poll/:userId', pollController.submitPoll);
router.get('/poll-analytics/:pollId', pollController.getPollAnalytics);
router.get('/overall-poll-analytics', pollController.getOverallPollAnalytics);

module.exports = router;

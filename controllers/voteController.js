const Vote = require('../models/Vote'); // Import the Vote model

// Create a new vote
exports.createVote = async (req, res) => {
  // Check if the request body contains the required fields
  if (!req.body.pollId || !req.body.userId || !req.body.questionId || !req.body.optionId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Create a new vote object
  const newVote = new Vote({
    user_id: req.body.userId,
    poll_id: req.body.pollId,
    question_id: req.body.questionId,
    option_id: req.body.optionId,
  });

  // Call the create method from the model
  Vote.create(newVote, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error creating vote', error: err });
    }
    res.status(201).json({ success: true, message: 'Vote created successfully', data: { voteId: data.id } });
  });
};

// Fetch all votes for a specific poll
exports.getVotesForPoll = async (req, res) => {
  const pollId = req.params.pollId;
  
  // Call a method from the model to get votes for the poll
  Vote.getVotesForPoll(pollId, (err, votes) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching votes', error: err });
    }
    res.status(200).json({ success: true, data: { votes } });
  });
};

const Vote = require('../models/Vote');

exports.createVote = (req, res) => {
  // Check if the request body contains the required fields
  if (!req.body.userId || !req.body.pollId || !req.body.questionId || !req.body.optionId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

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

exports.getVotesForPoll = (req, res) => {
  const { pollId } = req.params;

  Vote.getVotesForPoll(pollId, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error retrieving votes for the poll', error: err });
    }
    res.status(200).json({ success: true, message: 'Votes retrieved successfully', data });
  });
};

exports.getUserVotes = (req, res) => {
  const { userId } = req.params;

  Vote.getUserVotes(userId, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error retrieving user votes', error: err });
    }
    res.status(200).json({ success: true, message: 'User votes retrieved successfully', data });
  });
};

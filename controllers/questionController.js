// controllers/questionController.js

const Question = require('../models/Question');

// Update a particular question set within a poll
exports.updateQuestionSet = async (req, res) => {
  try {
    const { pollId, questionId } = req.params;
    const { question_text, options, question_type } = req.body;

    // Check if the poll exists
    const poll = await Poll.getById(pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if the question set exists within the specified poll
    const questionSet = await Question.getById(pollId, questionId);

    if (!questionSet) {
      return res.status(404).json({ error: 'Question set not found in the poll' });
    }

    // Update the question set's details based on the parameters provided in the request body
    const updatedQuestionSet = {};

    if (question_text) {
      updatedQuestionSet.question_text = question_text;
    }

    if (options) {
      updatedQuestionSet.options = options;
    }

    if (question_type) {
      updatedQuestionSet.question_type = question_type;
    }

    await Question.update(pollId, questionId, updatedQuestionSet);

    res.status(200).json({ message: 'Question set updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getUserQuestions = async (req, res) => {
    try {
      // Implement the logic to fetch questions for a user
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
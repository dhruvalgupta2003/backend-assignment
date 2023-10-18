const Question = require('./question.model');

// Create a new question
exports.createQuestion = (req, res) => {
  // Check if the request body contains the required fields
  if (!req.body.pollId || !req.body.questionText || !req.body.questionType) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Create a new question object
  const newQuestion = new Question({
    pollId: req.body.pollId,
    questionText: req.body.questionText,
    questionType: req.body.questionType,
  });

  // Call the create method from the model
  Question.create(newQuestion, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error creating question', error: err });
    }
    res.status(201).json({ success: true, message: 'Question created successfully', data: { questionId: data.id } });
  });
};

// Fetch all question sets for a specific poll
exports.getQuestionSetsForPoll = (req, res) => {
    const pollId = req.params.pollId;
  
    Question.getQuestionSetsForPoll(pollId, (err, questionSets) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error fetching question sets', error: err });
      }
      res.status(200).json({ success: true, data: { questionSets } });
    });
  };

// Fetch the first question for a specific poll
exports.getFirstQuestionForPoll = (req, res) => {
  const pollId = req.params.pollId;

  Question.getFirstQuestionForPoll(pollId, (err, question) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching the first question', error: err });
    }
    if (question) {
      res.status(200).json({ success: true, data: { question } });
    } else {
      res.status(404).json({ success: false, message: 'No questions found for the poll' });
    }
  });
};
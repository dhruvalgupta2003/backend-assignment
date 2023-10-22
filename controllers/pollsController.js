const Question = require('../models/Question');
const Poll = require('../models/Poll')
const Vote = require('../models/Vote');

// Create a new poll
exports.createPoll = async (req, res) => {
  // Check if the request body contains the required fields
  if (!req.body.title || !req.body.category || !req.body.start_date || !req.body.end_date || !req.body.min_reward || !req.body.max_reward) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Create a new poll object
  const newPoll = new Poll({
    title: req.body.title,
    category: req.body.category,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    min_reward: req.body.min_reward,
    max_reward: req.body.max_reward,  
  });

  // Call the create method from the model
  Poll.create(newPoll, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error creating poll', error: err });
    }
    res.status(201).json({ success: true, message: 'Poll created successfully', data: { pollId: data.id } });
  });
};


const addQuestionSet = (req, res) => {
  const { pollId } = req.params;
  const poll = polls.find((p) => p.title === pollId);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  const { type, text, options } = req.body;
  const question = new Question(type, text, options);
  poll.questions.push(question);

  res.json({ message: 'Question set added to the poll', question });
};


exports.getAllPolls = async (req, res) => {
  try {
    // Get a list of all polls
    Poll.getAll(null, (err, polls) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', data: null, error: 'Internal server error' });
      }

      // Return the list of polls without additional details
      res.status(200).json({ success: true, message: 'Polls retrieved successfully', data: polls, error: null });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', data: null, error: 'Internal server error' });
  }
};

// Update poll
  exports.updatePoll = async (req, res) => {
    try {
      const { pollId } = req.params;
      const { title, category, start_date, end_date, min_reward, max_reward } = req.body;
      const poll = {
        title,
        category,
        start_date,
        end_date,
        min_reward,
        max_reward
      };
  
      Poll.updateById(pollId, poll, (err, updatedPoll) => {
        if (err) {
          if (err.kind === 'not_found') {
            return res.status(404).json({
              success: false,
              message: 'Poll not found',
              data: null,
              error: 'Poll not found'
            });
          } else {
            return res.status(500).json({
              success: false,
              message: 'Internal server error',
              data: null,
              error: 'Internal server error'
            });
          }
        }
  
        res.status(200).json({
          success: true,
          message: 'Poll updated successfully',
          data: updatedPoll,
          error: null
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null,
        error: 'Internal server error'
      });
    }
  };
  



// Fetch user polls and serve questions
exports.getUserPollsAndQuestions = async (req, res) => {
   try {
    const userId = req.params.userId;
    const { startDate, endDate } = req.query; // Optional date range

    // Get user's voting history to determine answered questions
    const userVotes = await Vote.getUserVotes(userId);

    // Get available polls for the user within the specified date range
    const availablePolls = await Poll.getAvailableUserPolls(userId, startDate, endDate);

    // Check if there are any available polls
    if (availablePolls.length === 0) {
      return res.status(404).json({ message: 'No new polls exist', data: null, error: null });
    }

    // Find the next unanswered question for the user
    let nextQuestion = null;

    for (const poll of availablePolls) {
      // Find the first unanswered question in the current poll
      const unansweredQuestion = poll.questions.find((question) => !userVotes.includes(question.id));

      if (unansweredQuestion) {
        nextQuestion = unansweredQuestion;
        break;
      }
    }

    // If no unanswered question was found, return an appropriate message
    if (!nextQuestion) {
      return res.status(404).json({ message: 'No new questions in available polls', data: null, error: null });
    }

    // Return the next question and relevant poll details
    res.status(200).json({
      message: 'Next question served successfully',
      data: {
        poll: nextQuestion.poll,
        question: nextQuestion,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', data: null, error: 'Internal server error' });
  }
};

// Submit a poll
exports.submitPoll = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pollId, questionId, optionId } = req.body;

    // Create a new Vote object
    const newVote = new Vote({
      user_id: userId,
      poll_id: pollId,
      question_id: questionId,
      option_id: optionId,
    });
    
    await Vote.create(newVote);

    // Retrieve the Poll's min_reward and max_reward based on the pollId
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    // Calculate the reward
    // const minReward = poll.min_reward;
    // const maxReward = poll.max_reward;

    // const reward = calculateReward(minReward, maxReward);

    res.status(200).json({ data: newVote });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch poll analytics
exports.getPollAnalytics = async (req, res) => {
  try {
    const { pollId } = req.params;
    const analytics = await Poll.getPollAnalytics(pollId);

    res.status(200).json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch overall poll analytics
exports.getOverallPollAnalytics = async (req, res) => {
  try {
    const analytics = await Poll.getOverallPollAnalytics();

    res.status(200).json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Intern al server error' });
  }
};

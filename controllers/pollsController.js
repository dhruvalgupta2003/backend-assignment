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


// Fetch all created polls with additional information
// exports.getAllPolls = async (req, res) => {
//     try {
//       // Get a list of all polls
//       const polls = await Poll.getAll();
  
//       // Define an array to store the detailed poll information
//       const detailedPolls = [];
  
//       // Iterate through each poll to gather additional information
//       for (const poll of polls) {
//         // Get the total number of votes for the poll
//         const totalVotes = await Vote.getVotesForPoll(poll.id);
  
//         // Get the number of question sets in the poll
//         const questionSets = await Question.getQuestionSetsForPoll(poll.id);
  
//         // Get details of at least one question from the poll
//         const question = await Question.getFirstQuestionForPoll(poll.id);
  
//         // Add the detailed poll information to the array
//         detailedPolls.push({
//           id: poll.id,
//           title: poll.title,
//           category: poll.category,
//           start_date: poll.start_date,
//           end_date: poll.end_date,
//           total_votes: totalVotes,
//           question_sets_count: questionSets.length,
//           first_question: question,
//         });
//       }
  
//       // Respond with the detailed poll information
//       res.status(200).json({ polls: detailedPolls });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };

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

    await Vote.create(userId, pollId, questionId, optionId);
    const reward = calculateReward(); // Implement your reward calculation logic

    res.status(200).json({ reward });
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

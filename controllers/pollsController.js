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


// Fetch all created polls with additional information
exports.getAllPolls = async (req, res) => {
    try {
      // Get a list of all polls
      const polls = await Poll.getAll();
  
      // Define an array to store the detailed poll information
      const detailedPolls = [];
  
      // Iterate through each poll to gather additional information
      for (const poll of polls) {
        // Get the total number of votes for the poll
        const totalVotes = await Vote.getVotesForPoll(poll.id);
  
        // Get the number of question sets in the poll
        const questionSets = await Question.getQuestionSetsForPoll(poll.id);
  
        // Get details of at least one question from the poll
        const question = await Question.getFirstQuestionForPoll(poll.id);
  
        // Add the detailed poll information to the array
        detailedPolls.push({
          id: poll.id,
          title: poll.title,
          category: poll.category,
          start_date: poll.start_date,
          end_date: poll.end_date,
          total_votes: totalVotes,
          question_sets_count: questionSets.length,
          first_question: question,
        });
      }
  
      // Respond with the detailed poll information
      res.status(200).json({ polls: detailedPolls });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Update a particular poll
exports.updatePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { title, category, start_date, end_date, min_reward, max_reward, questionSets } = req.body;

    await Poll.update( title, category, start_date, end_date, min_reward, max_reward);

    for (const questionSet of questionSets) {
      await Poll.updateQuestion(questionSet.question_id, questionSet.question_text, questionSet.question_type, questionSet.options);
    }

    res.status(200).json({ message: 'Poll updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Fetch user polls and serve questions
exports.getUserPollsAndQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start_date, end_date } = req.query;

    // Fetch the user's voting history
    const userVotes = await Vote.getUserVotes(userId);

    // Fetch the polls available within the specified date range
    const availablePolls = await Poll.getAvailablePolls(start_date, end_date);

    // Define a response object to store poll and question information
    const response = {
      polls: [],
    };

    // Iterate through each available poll
    for (const poll of availablePolls) {
      // Check if the user has already voted in this poll
      const userVoteInThisPoll = userVotes.find((vote) => vote.pollId === poll.id);

      // If the user hasn't voted in this poll, serve the first unanswered question
      if (!userVoteInThisPoll) {
        const firstUnansweredQuestion = await Question.getFirstUnansweredQuestion(userId, poll.id);

        if (firstUnansweredQuestion) {
          response.polls.push({
            id: poll.id,
            title: poll.title,
            category: poll.category,
            start_date: poll.start_date,
            end_date: poll.end_date,
            question: firstUnansweredQuestion,
          });
        }
      } else {
        // The user has already voted in this poll, serve the next unanswered question
        const nextUnansweredQuestion = await Question.getNextUnansweredQuestion(userId, poll.id, userVoteInThisPoll.questionId);

        if (nextUnansweredQuestion) {
          response.polls.push({
            id: poll.id,
            title: poll.title,
            category: poll.category,
            start_date: poll.start_date,
            end_date: poll.end_date,
            question: nextUnansweredQuestion,
          });
        }
      }
    }

    // If no new polls or questions exist, return a response indicating that
    // "no new polls exist."
    if (response.polls.length === 0) {
      return res.status(200).json({ message: 'No new polls exist.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

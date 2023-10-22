const Option = require('../models/Options');

exports.createOption = (req, res) => {
  // Check if the request body contains the required fields
  if (!req.body.question_id || !req.body.option_text) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Create a new option object
  const newOption = new Option({
    question_id: req.body.question_id,
    option_text: req.body.option_text,
  });
  console.log(newOption);

  // Call the create method from the model
  Option.create(newOption, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error creating option', error: err });
    }
    res.status(201).json({ success: true, message: 'Option created successfully',  data: { optionId: data.id }  });
  });
};

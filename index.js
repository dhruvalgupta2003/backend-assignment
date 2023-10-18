const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const db = require('./db/db');
require('dotenv').config();
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const Port = process.env.PORT || 5000;

// Ensure that the database connection is established
db.connect((err) => {
    if (err) {
      console.error('DB connection error:', err);
    } else {
      console.log('DB connection established');
      // Start the server only when the DB connection is established
      app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
      });
    }
  });
  
// API routes
app.use('/api', pollRoutes);
app.use('/api',voteRoutes);

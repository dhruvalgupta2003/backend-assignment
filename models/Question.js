const mysql = require('mysql2/promise');

class Question {
  static async create(pollId, question_text, question_type) {
    // Implement the logic to create a new question in the database
    try {
      const [results] = await connection.execute(
        'INSERT INTO poll_questions (poll_id, question_text, question_type) VALUES (?, ?, ?)',
        [pollId, question_text, question_type]
      );

      return results.insertId;
    } catch (error) {
      throw error;
    } finally {
      connection.close();
    }
  }

  static async update(questionId, question_text, question_type) {
    // Implement the logic to update a question in the database
    const connection = await mysql.createConnection({ host: 'your_host', user: 'your_user', password: 'your_password', database: 'your_database' });

    try {
      await connection.execute(
        'UPDATE poll_questions SET question_text = ?, question_type = ? WHERE id = ?',
        [question_text, question_type, questionId]
      );

      return true;
    } catch (error) {
      throw error;
    } finally {
      connection.close();
    }
  }
}

module.exports = Question;

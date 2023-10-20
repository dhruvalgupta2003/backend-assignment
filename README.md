# backend-assignment

```markdown

This is a RESTful API for a polling application. The API allows users to create, retrieve, and vote on polls. It also tracks user votes and calculates rewards based on their choices.

## Table of Contents
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [Create a Poll](#create-a-poll)
  - [Retrieve All Polls](#retrieve-all-polls)
  - [Update a Poll](#update-a-poll)
  - [Fetch User Polls](#fetch-user-polls)
  - [Submit a Poll](#submit-a-poll)
  - [Fetch Poll Analytics](#fetch-poll-analytics)
  - [Fetch Overall Poll Analytics](#fetch-overall-poll-analytics)
- [Error Handling](#error-handling)
- [Data Validation](#data-validation)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Getting Started

To get started with the Polling Application API, follow the steps below:

1. Clone this repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Set up your MySQL database with the provided schema and seed data scripts.
4. Configure your environment variables in a `.env` file.
5. Run the application with `npm start`.

## Endpoints

### Create a Poll

**Endpoint**: `POST /api/create-poll`

**Request Body**:
```json
{
  "title": "Poll Title",
  "category": "Poll Category",
  "start_date": "2023-10-17",
  "end_date": "2023-10-24",
  "min_reward": 10,
  "max_reward": 50,
  "questionSets": [
    {
      "question_text": "Question 1",
      "question_type": "single",
      "options": ["Option 1", "Option 2"]
    },
    {
      "question_text": "Question 2",
      "question_type": "multiple",
      "options": ["Option A", "Option B", "Option C"]
    }
  ]
}
```

### Retrieve All Polls

**Endpoint**: `GET /api/get-all-polls`

### Update a Poll

**Endpoint**: `PUT /api/update-poll/:pollId`

**Request Body**:
```json
{
  "title": "Updated Poll Title",
  "min_reward": 5,
  "max_reward": 30
}
```

### Fetch User Polls

**Endpoint**: `GET /api/user-polls/:userId`

### Submit a Poll

**Endpoint**: `POST /api/submit-poll`

**Request Body**:
```json
{
  "user_id": 123,
  "poll_id": 456,
  "question_id": 789,
  "option_id": 1
}
```

### Fetch Poll Analytics

**Endpoint**: `GET /api/poll-analytics/:pollId`

### Fetch Overall Poll Analytics

**Endpoint**: `GET /api/overall-poll-analytics`

## Error Handling

The API handles various error scenarios and provides appropriate error responses. Possible error responses include:

- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

## Data Validation

The API includes data validation to ensure the integrity and security of the application. It validates input data to prevent invalid or malicious data from being processed.

## Installation

1. Clone this repository to your local machine.
2. Run `npm install` to install the required dependencies.

## Usage

1. Set up your MySQL database with the provided schema and seed data scripts.
2. Configure your environment variables in a `.env` file.
3. Run the application with `npm start`.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

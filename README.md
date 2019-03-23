# Spot Quiz api

This React project is designed to work in unison with it's frontend UI found here: https://github.com/franklia/spot-quiz-frontend

The app has been created to assist in learning the fundamentals of any subject matter via repetition. Enter your own questions and answers, then test yourself regularly using a random question generator.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* NPM and Node.js
* MongoDB

### Installation

* Clone the repo `git clone https://github.com/franklia/spot-quiz-frontend.git`
* Navigate into the repo `cd spot-quiz-frontend`
* Run `npm install` to install the node modules
* Run `mongod` to start the Mongo server
* Run `mongo` to start the Mongo Shell, which is an application to access data in Mongo
* Run `use spot_quiz_dev` to create a new database
* Create a .env file in the root directory using the template below

API_PORT=3001
API_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
MONGODB_DEV=mongodb://localhost:27017/spot_quiz_dev
DEBUG=true

* Run `npm start` to start the app in development mode

## Author

Frank Liardet

## License

This project is licensed under the MIT License.

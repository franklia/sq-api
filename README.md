# Spot Quiz api

This React project is designed to work in unison with it's frontend UI found here: https://github.com/franklia/sq-ui

The purpose of the app is to assist in learning the fundamentals of any subject matter via repetition. Enter your own questions and answers, then test yourself regularly using a random question generator.

## About The Project

Spot Quiz was the first end to end app I've built using React, Node, and Mongo. I also used Auth0 for user authentication. I hadn't done much with JS or no-SQL db's before, so I learned a LOT!

Like any learning exercise, you run on your instincts and move forward by trial and error. Here are some notes about what I learned and how I can improve.

### Things I've learned Across The Stack

- Compare to SQL databases, no-SQL is very flexible with how you achieve things. But with flexibility comes the need to know why and how to do things correctly. I would probably make some changes to my schema if starting out again.
- CSS - like any other framework, you need a solid CSS strategy from the outset. I used the "@material-ui/core" package which offers its own CSS structure using a version of the "styled-components". However I found that there were some issues with this e.g. it didn't play nicely with another npm package I used (react-transition-group), plus there were limitations with the theme functionality. Hence, to get a result without major refactoring, I had to use a combination of styling solutions including CSS in JS, regular stylesheets and inline styles.

### Things I Can Improve On

- Inconsistent code - there are inconsistencies in terms of syntax and methodologies because I tried different ways of doing things as I gained more experience in the frameworks. Consistent code improves productivity, especially in teams.
- Catching errors - in the quest to get the project up and running I did not handling exceptions but I should have.
- Unit Tests - I did not write tests for this app but I should have.
- Bloated server.js file - I am in the process of splitting this out into services and models

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- NPM and Node.js
- MongoDB

### Installation

- Clone the repo `git clone https://github.com/franklia/sq-api.git`
- Navigate into the repo `cd sq-api`
- Run `npm install` to install the node modules
- Open a new tab in your terminal and run `mongod` to start the Mongo server
- Open a new tab in your terminal and run `mongo` to start the Mongo Shell, which is an application to access data in Mongo
- In the Mongo Shell, run `use spot_quiz_dev` to create a new database
- Create a .env file in the root directory using the template below

PORT=3001  
CORS_ORIGIN=http://localhost:3000  
MONGODB_URI=[enter your own mongoDB uri]  
DEBUG=true  
AUTH0_ADMIN_ID=[an Auth0 user ID for system categories] - See Installation instructions in frontend README for further details: https://github.com/franklia/spot-quiz-frontend.git Once you've created an Auth0 user via the application "Login / Sign Up" button, you can locate the user ID inside your Auth0 account under "Users & Roles".

- Run `npm start` to start the app in development mode

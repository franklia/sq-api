// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
require('dotenv').config();
import QuizQuestion from './models/quiz_questions';

// create instances
const app = express();
const router = express.Router();

// set our env variables
const API_PORT = process.env.API_PORT || 3001;

// connect to the database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(process.env.MONGODB_URI))
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log(err));

// since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

// configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000'
}));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// Get all questions
router.get('/questions/index', (req, res, next) => {
  QuizQuestion.find({})
    .then(data => res.json(data))
    .catch(next);
});

// Get one specific question
router.get('/question/:id', (req, res, next) => {
  QuizQuestion.find({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(next);
});

// Add a question
router.post('/question/create', (req, res, next) => {
  if (req.body) {
    QuizQuestion.create(req.body)
      .then(data => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: 'The input field is empty'
    });
  }
});

// Update a question
router.post('/question/:id', (req, res) => {
  QuizQuestion.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully updated');
    }
  });
});

// Delete a question
router.delete('/question/delete/:id', (req, res) => {
  QuizQuestion.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.json({
        reason: 'An error occurred, perhaps the id was not found?',
        error: err
      });
    } else {
      res.json('Successfully removed');
    }
  });
});

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log('Listening on port ' + API_PORT));

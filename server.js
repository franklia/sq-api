// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
require('dotenv').config();
import Questions from './models/questions';

// create instances
const app = express();
const router = express.Router();

// set our env variables
const API_PORT = process.env.API_PORT || 3001;
const MONGO_DB = process.env.MONGODB_DEV || 3001;

// connect to the database
mongoose.connect(MONGO_DB, { useNewUrlParser: true })
  .then(() => console.log(MONGO_DB))
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

// Get all questions
router.get('/questions/index', (req, res, next) => {
  Questions.find({})
    .then(data => res.json(data))
    .catch(next);
});

// Get all categories
router.get('/questions/index/category', (req, res, next) => {
  Questions.distinct('category')
    .then(data => res.json(data))
    .catch(next);
});

// Get one random test question
router.get('/question/test/:category', (req, res, next) => {
  const updateStatusToTrue = (randomQuestion) => {
    Questions.findByIdAndUpdate(randomQuestion._id, { $set: { status: true } }, (err) => {
      if (err) {
        res.json(err);
      } else {
        res.json(randomQuestion);
      }
    });
  };

  const findRandomQuestion = () => {
    Questions.find({ status: false, category: req.params.category }).sort({ 'questions.position': 1 })
      .then((data) => {
        // If there are no questions with a status === false, then change all questions in the
        // category to false i.e the user has tested all questions and now needs to reset
        if (data === undefined || data.length === 0) {
          Questions.where({ status: true, category: req.params.category })
            .updateMany({ $set: { status: false } })
            .then();
          findRandomQuestion();
        } else {
          const randomQuestion = data[Math.floor(Math.random() * data.length)];
          updateStatusToTrue(randomQuestion);
        }
      })
      .catch(next);
  };

  findRandomQuestion();
});

// Get one specific question
router.get('/question/:id', (req, res, next) => {
  Questions.find({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(next);
});

// Add a question
router.post('/question/create', (req, res, next) => {
  if (req.body) {
    Questions.create(req.body)
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
  Questions.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully updated');
    }
  });
});

// Delete a question
router.delete('/question/delete/:id', (req, res) => {
  Questions.findByIdAndDelete({ _id: req.params.id }, (err) => {
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

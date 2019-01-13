// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
require('dotenv').config();
import QuizQuestion from './models/quiz_questions';

// create instances
const app = express();
const router = express.Router();
const corsOrigin = process.env.CORS_ORIGIN;


// set our env variables
const API_PORT = process.env.API_PORT || 3001;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_code';

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// set the route path & initialize the API
router.get('/', (req, res, next) => {
  // this will return all the data, exposing only the id and action field to the client
  QuizQuestion.find({})
    .then(data => res.json(data))
    .catch(next);
});

router.post('/create', (req, res, next) => {
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

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log('Listening on port ' + API_PORT));

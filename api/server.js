// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
require('dotenv').config();

// create instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

// configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

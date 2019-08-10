// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
require('dotenv').config();
import Questions from './models/questions';
import Users from './models/users';

// create instances
const app = express();
const router = express.Router();

// set our env variables
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// connect to the database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(MONGODB_URI))
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log(err));

// This allows us to add Mongo ObjectId's to new records
const ObjectId = mongoose.Types.ObjectId;

// since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

// configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

// Test route
router.get('/test', (req, res) => {
  res.send('The Spot Quiz API is working!');
});

// Get all questions
router.get('/questions/index', (req, res, next) => {
  Questions.find({ auth0_id: req.query.userId })
    .then(data => {
      if (data.length === 0) {
        res.json(data);
      } else {
        res.questions = data;
        next();
      }
    });
}, (req, res, next) => {
  Users.find({ auth0_id: req.query.userId })
    .lean()
    .select('categories')
    .then(data => {
      const userCategories = data[0].categories;
      const dataArray = [];

      // For each question returned from the first section of the query...
      res.questions.forEach((element) => {
        // Get the category id
        const categoryId = element.category;
        // Then locate the category object
        const categoryObject = userCategories.find((cat) => {
          return cat._id.toString() === categoryId.toString();
        });
        // Create a new unified object containing all the relevant info
        const object = {
          _id: element.id,
          status: element.status,
          auth0_id: element.auth0_id,
          categoryId: categoryObject._id,
          categoryName: categoryObject.name,
          questions: element.questions
        }
        // Push each object into an array
        dataArray.push(object);
      });

      res.send(dataArray);
    })
    .catch(next);
});

// Get inbuilt system generated categories
router.get('/admin/categories', (req, res, next) => {
  Users.find({ auth0_id: process.env.AUTH0_ADMIN_ID })
    .lean()
    .select('categories')
    .then(data => {
      // res.adminCategories = data[0].categories;
      // console.log(res.adminCategories);
      res.json(data);
    })
    .catch(next);
});

// Get user generated categories
router.get('/user/categories', (req, res, next) => {
  Users.find({ auth0_id: req.query.auth0Id })
    .lean()
    .select('categories')
    .then(data => {
      res.json(data);
    })
    .catch(next);
});

// Create a new category
router.put('/user/category/create', (req, res) => {
  // Declare function to save new category
  const saveCategories = () => {
    const findBy = { auth0_id: req.body.auth0Id };
    const updateValues = { $push: { categories: { _id: ObjectId(), name: req.body.categoryName } } };
    Users.update(findBy, updateValues, (error) => {
      if (error) {
        res.json(error);
      } else {
        res.json();
      }
    });
  };

  Users.findOne({ auth0_id: req.body.auth0Id }).select('_id').lean()
    .then(data => {
      // Check if a user exists
      if (data) {
        saveCategories();
      } else {
        // Create user record
        const newUser = new Users({
          auth0_id: req.body.auth0Id,
          categories: []
        });
        // Then save data
        newUser.save(err => {
          if (err) {
            res.json(err);
          } else {
            saveCategories();
          }
        });
      }
    });
});

// Update a category
router.put('/user/category/update', (req, res) => {
  const findBy = { auth0_id: req.body.auth0Id, 'categories._id': req.body.updateOrDeleteCategoryId };
  const updateValues = { $set: { 'categories.$.name': req.body.updateCategoryName } };
  Users.update(findBy, updateValues, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json();
    }
  });
});

// Detete a category
router.put('/user/category/delete', (req, res) => {
  const findBy = { auth0_id: req.body.auth0Id };
  const updateValues = { $pull: { categories: { _id: req.body.updateOrDeleteCategoryId } } };
  Users.update(findBy, updateValues, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json();
    }
  });
});

// Get one random test question
router.get('/question/test/:category', (req, res, next) => {
  // first, check if the category has any questions and abort if none exist
  Questions.find({ category: req.params.category })
    .then(data => {
      if (data.length === 0) {
        res.json(data);
      } else {
        next();
      }
    });
// if category has questions, continue executing
}, (req, res, next) => {
  // function which changes status once the question has been asked
  const updateStatusToTrue = (randomQuestion) => {
    Questions.findByIdAndUpdate(randomQuestion._id, { $set: { status: true } }, (err) => {
      if (err) {
        res.json(err);
      } else {
        res.json(randomQuestion);
      }
    });
  };
  // function to find one random questions from a specific category
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

// Get one specific question (so that you can view it prior to updating it)
router.get('/question/:id', (req, res, next) => {
  Questions.find({ _id: req.params.id })
    .then(data => {
      console.log(data);
      res.json(data);
    })
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
  console.log(req.params.id);
  console.log(req.body);
  Questions.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully updated');
    }
  });
  // Questions.findByIdAndUpdate(req.params.id, req.body, (err) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json('Successfully updated');
  //   }
  // });
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

app.listen(PORT, () => console.log('Listening on port ' + PORT));

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create schema for Questions
const UsersSchema = new Schema({
  auth0_id: {
    type: String,
    required: [true, 'The auth0 text field is required']
  },
  email: {
    type: String,
    required: false
  },
  categories: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ]
}, {
  collection: 'users'
});

// create model
const Users = mongoose.model('User', UsersSchema);

module.exports = Users;

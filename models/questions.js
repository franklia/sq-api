import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create child Schema
const NestedQuestionsSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'The sub question id is a required field']
  },
  sub_question: {
    type: String,
    required: [true, 'The sub question text field is required']
  },
  sub_answer: {
    type: String,
    required: [true, 'The sub answer text field is required']
  },
  position: {
    type: Number,
    required: [true, 'The sub question position is required']
  },
  _id: false
});

// create schema for Questions
const QuestionsSchema = new Schema({
  auth0_id: {
    type: String,
    required: [true, 'The auth0 field is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    required: [true, 'The category text field is required']
  },
  topic: {
    type: String,
    required: false
  },
  questions: [NestedQuestionsSchema],
  status: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'questions'
});

// create model for QuizQuestion
const Questions = mongoose.model('Question', QuestionsSchema);

module.exports = Questions;

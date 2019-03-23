import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create schema for Create
const QuestionsSchema = new Schema({
  category: {
    type: String,
    required: [true, 'The category text field is required']
  },
  questions: [{
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
    }
  }],
  status: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'questions'
});

// create model for QuizQuestion
const Questions = mongoose.model('Questions', QuestionsSchema);

module.exports = Questions;

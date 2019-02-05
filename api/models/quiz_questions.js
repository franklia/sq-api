import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create schema for Create

const QuizQuestionSchema = new Schema({
  category: {
    type: String,
    required: [true, 'The category text field is required']
  },
  question: {
    type: String,
    required: [true, 'The question text field is required']
  },
  answer: {
    type: String,
    required: [true, 'The answer text field is required']
  },
  status: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'quiz_questions'
});

// create model for QuizQuestion
const QuizQuestion = mongoose.model('QuizQuestion', QuizQuestionSchema);

module.exports = QuizQuestion;
// export default QuizQuestion;

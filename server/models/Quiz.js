import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    maxLength: 500
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    marks: {
      type: Number,
      default: 1,
      min: 1
    },
    explanation: {
      type: String,
      default: ''
    }
  }],
  totalMarks: {
    type: Number,
    default: 0
  },
  passingMarks: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  attempts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    answers: [Number],
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: Number // in seconds
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total marks from questions
quizSchema.pre('save', function(next) {
  this.totalMarks = this.questions.reduce((total, q) => total + q.marks, 0);
  this.passingMarks = Math.ceil(this.totalMarks * 0.6); // 60% passing
  next();
});

export default mongoose.model('Quiz', quizSchema);
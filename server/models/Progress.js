import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonsCompleted: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: {
      type: Number, // in seconds
      default: 0
    }
  }],
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quizScore: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  lastAccessedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }
}, {
  timestamps: true
});

// Ensure one progress record per user per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Calculate completion percentage
progressSchema.methods.calculatePercentage = function(totalLessons) {
  if (totalLessons === 0) return 0;
  return Math.round((this.lessonsCompleted.length / totalLessons) * 100);
};

export default mongoose.model('Progress', progressSchema);
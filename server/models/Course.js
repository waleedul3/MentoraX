import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxLength: 1000
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  thumbnail: {
    type: String,
    default: 'https://picsum.photos/400/300'
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxLength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  duration: {
    type: Number, // in hours
    default: 0
  },
  requirements: [String],
  learningOutcomes: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }
}, {
  timestamps: true
});

// Calculate total duration from lessons
courseSchema.methods.calculateDuration = function() {
  return this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
};

export default mongoose.model('Course', courseSchema);

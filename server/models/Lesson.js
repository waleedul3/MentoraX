import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 500
  },
  videoUrl: {
    type: String,
    default: ''
  },
  content: {
    type: String, // Rich text content
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'code', 'image']
    }
  }],
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure unique order within a course
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);
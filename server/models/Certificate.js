import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    unique: true,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  certificateUrl: {
    type: String,
    required: true
  },
  qrCodeUrl: {
    type: String,
    required: true
  },
  verificationUrl: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one certificate per user per course
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Certificate', certificateSchema);
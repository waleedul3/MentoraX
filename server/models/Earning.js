import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    default: 0.2 // 20% platform commission
  },
  netAmount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['course_enrollment', 'session_booking', 'tip'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  payoutDate: Date,
  transactionId: String
}, {
  timestamps: true
});

export default mongoose.model('Earning', earningSchema);
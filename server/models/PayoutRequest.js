import mongoose from 'mongoose';

const payoutRequestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'rejected'],
    default: 'pending'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentDetail'
  },
  earnings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Earning'
  }],
  processedAt: Date,
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('PayoutRequest', payoutRequestSchema);
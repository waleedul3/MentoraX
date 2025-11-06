import mongoose from 'mongoose';

const paymentDetailSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  ifscCode: {
    type: String,
    required: true
  },
  accountHolderName: {
    type: String,
    required: true
  },
  upiId: {
    type: String
  },
  panNumber: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('PaymentDetail', paymentDetailSchema);
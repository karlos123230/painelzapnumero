const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'PhoneNumber', required: true },
  service: { type: String, required: true },
  price: { type: Number, required: true },
  verificationCode: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  messages: [{
    text: String,
    receivedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const phoneNumberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  service: { type: String, default: 'whatsapp' },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'inactive'],
    default: 'available'
  },
  currentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rentedUntil: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema);

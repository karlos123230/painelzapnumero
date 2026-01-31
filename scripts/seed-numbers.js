const mongoose = require('mongoose');
require('dotenv').config();

const PhoneNumber = require('../models/PhoneNumber');

const sampleNumbers = [
  { number: '+5511987654321', country: 'Brasil', countryCode: '55', price: 5.00, service: 'whatsapp' },
  { number: '+5511987654322', country: 'Brasil', countryCode: '55', price: 5.00, service: 'whatsapp' },
  { number: '+5521987654323', country: 'Brasil', countryCode: '55', price: 5.00, service: 'whatsapp' },
  { number: '+1234567890', country: 'USA', countryCode: '1', price: 8.00, service: 'whatsapp' },
  { number: '+1234567891', country: 'USA', countryCode: '1', price: 8.00, service: 'whatsapp' },
  { number: '+351912345678', country: 'Portugal', countryCode: '351', price: 6.00, service: 'whatsapp' },
  { number: '+34612345678', country: 'Espanha', countryCode: '34', price: 6.50, service: 'whatsapp' },
  { number: '+4915123456789', country: 'Alemanha', countryCode: '49', price: 7.00, service: 'whatsapp' },
];

async function seedNumbers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');

    await PhoneNumber.deleteMany({});
    console.log('Números antigos removidos');

    await PhoneNumber.insertMany(sampleNumbers);
    console.log(`✅ ${sampleNumbers.length} números adicionados com sucesso!`);

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

seedNumbers();

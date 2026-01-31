const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');

    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log('Uso: node scripts/create-admin.js email@exemplo.com senha123');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      existingUser.isAdmin = true;
      await existingUser.save();
      console.log(`✅ Usuário ${email} agora é admin!`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        isAdmin: true,
        balance: 100 // Saldo inicial de R$ 100
      });
      await user.save();
      console.log(`✅ Admin criado: ${email} com saldo inicial de R$ 100`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

createAdmin();
